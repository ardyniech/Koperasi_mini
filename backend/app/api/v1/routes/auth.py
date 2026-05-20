# backend/app/api/v1/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.schemas.anggota import AnggotaCreate, AnggotaLogin, AnggotaResponse, Token
from app.models.anggota import Anggota
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    oauth2_scheme,
    JWTError,
    jwt,
    SECRET_KEY,
    ALGORITHM,
    get_current_anggota_from_token,
    get_current_anggota_optional,
)
from app.core.logger import logger
import re
from app.api.v1.routes.auth_helpers import (
    is_blocked,
    record_failed_attempt,
    reset_attempts,
)

def normalize_phone(no_whatsapp: str) -> str:
    """Normalize phone number to international 628xxx format."""
    logger.info(f"[Auth DEBUG] normalize_phone INPUT: repr={repr(no_whatsapp)}")
    cleaned = re.sub(r"\D", "", no_whatsapp)
    logger.info(f"[Auth DEBUG] normalize_phone AFTER re.sub: cleaned={cleaned}")
    if cleaned.startswith("0"):
        cleaned = "62" + cleaned[1:]
    elif not cleaned.startswith("62"):
        cleaned = "62" + cleaned
    logger.info(f"[Auth DEBUG] normalize_phone OUTPUT: normalized={cleaned}")
    return cleaned

router = APIRouter()

@router.post("/register", response_model=AnggotaResponse)
def register(
    anggota: AnggotaCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[Anggota] = Depends(get_current_anggota_optional)
):
    """Register a new member. First user becomes admin, subsequent require admin token (Syariah compliance)."""
    logger.info(f"[Auth] Register attempt: email={anggota.email}, nama={anggota.nama}")
    try:
        admin_exists = db.query(Anggota).filter(Anggota.role == "admin").first()
        
        # Allow open registration: any user can register. If an admin already exists, new users become regular anggota.
        existing = db.query(Anggota).filter(Anggota.email == anggota.email).first()
        if existing:
            logger.warning(f"[Auth] Register failed: email already exists - {anggota.email}")
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
        
        role = "admin" if not admin_exists else "anggota"
        hashed_password = get_password_hash(anggota.password)
        new_user = Anggota(
            nama=anggota.nama,
            email=anggota.email,
            no_wa=anggota.no_wa,
            password_hash=hashed_password,
            role=role,
            status="Aktif",
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"[Auth] Register success: id={new_user.id}, email={new_user.email}, role={role}")
        return new_user
    except Exception as e:
        logger.error(f"[Auth] Register failed: {str(e)}")
        raise

@router.post("/login", response_model=Token)
def login(anggota: AnggotaLogin, db: Session = Depends(get_db)):
    """Login with email or phone number"""
    identifier = anggota.identifier
    logger.info(f"[Auth] Login attempt: identifier_repr={repr(identifier)}")
    logger.info(f"[Auth DEBUG] Contains @: {'@' in identifier}, type={type(identifier)}, len={len(identifier)}")
    try:
        if not identifier:
            logger.warning("[Auth] Login failed: email/phone not provided")
            raise HTTPException(status_code=400, detail="Email atau nomor HP harus diisi")
        
        blocked, message = is_blocked(identifier)
        if blocked:
            logger.warning(f"[Auth] Login blocked: identifier={identifier}")
            raise HTTPException(status_code=429, detail=message)
        
        # Try to find user by email or phone_number (no_wa)
        user = None
        if '@' in identifier:
            # It's an email
            logger.info(f"[Auth DEBUG] BRANCH: EMAIL lookup")
            user = db.query(Anggota).filter(Anggota.email == identifier).first()
            logger.info(f"[Auth DEBUG] Email lookup: identifier={identifier}, user_found={user is not None}")
        else:
            # It's a phone number, normalize to 628xxx format
            logger.info(f"[Auth DEBUG] BRANCH: PHONE lookup")
            normalized_phone = normalize_phone(identifier)
            user = db.query(Anggota).filter(Anggota.no_wa == normalized_phone).first()
            logger.info(f"[Auth DEBUG] Phone lookup: normalized={normalized_phone}, user_found={user is not None}")
        
        if not user:
            record_failed_attempt(identifier)
            logger.warning(f"[Auth] Login failed: user not found - identifier={identifier}")
            raise HTTPException(status_code=401, detail="Email/HP atau password salah")
        
        if not verify_password(anggota.password, user.password_hash):
            record_failed_attempt(identifier)
            logger.warning(f"[Auth] Login failed: wrong password - identifier={identifier}, user_id={user.id}")
            raise HTTPException(status_code=401, detail="Email/HP atau password salah")
        
        logger.info(f"[Auth DEBUG] Password verified successfully for user_id={user.id}")
        
        reset_attempts(identifier)
        access_token = create_access_token(data={"sub": str(user.id)}, role=user.role)
        logger.info(f"[Auth] Login success: user_id={user.id}, email={user.email}, role={user.role}")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"[Auth] Login error: {str(e)}")
        raise

@router.post("/refresh", response_model=Token)
def refresh_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Refresh JWT token preserving role."""
    logger.info("[Auth] Refresh token attempt")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        anggota_id: str = payload.get("sub")
        role: str = payload.get("role", "anggota")
        if anggota_id is None:
            logger.warning("[Auth] Refresh failed: Invalid token (no sub)")
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        logger.warning("[Auth] Refresh failed: JWTError")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    anggota = db.query(Anggota).filter(Anggota.id == int(anggota_id)).first()
    if not anggota:
        logger.warning(f"[Auth] Refresh failed: Anggota not found - id={anggota_id}")
        raise HTTPException(status_code=404, detail="Anggota not found")
    
    new_token = create_access_token(data={"sub": str(anggota.id)}, role=role)
    logger.info(f"[Auth] Refresh success: user_id={anggota.id}")
    return {"access_token": new_token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: Anggota = Depends(get_current_anggota_from_token)):
    """Get current user profile"""
    logger.info(f"[Auth] GetMe: user_id={current_user.id}, email={current_user.email}")
    try:
        return {
            "id": current_user.id, 
            "email": current_user.email, 
            "nama": current_user.nama, 
            "role": current_user.role, 
            "status": current_user.status
        }
    except Exception as e:
        logger.error(f"[Auth] GetMe failed: {str(e)}")
        raise
