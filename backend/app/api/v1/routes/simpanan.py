from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_anggota, admin_required
from app.schemas.simpanan import SimpananCreate, SimpananResponse, SimpananList
from app.models.anggota import Anggota
from app.services import simpanan as simpanan_service
from app.core.logger import logger

router = APIRouter(tags=["simpanan"])

@router.post("/", response_model=SimpananResponse, status_code=status.HTTP_201_CREATED)
async def create_simpanan(
    simpanan_in: SimpananCreate,
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """Create new simpanan (savings)"""
    logger.info(f"[Simpanan] Create: user_id={current_anggota.id}, nominal={simpanan_in.nominal}")
    try:
        # Regular users can only create simpanan for themselves
        if current_anggota.role != "admin" and simpanan_in.anggota_id != current_anggota.id:
            raise HTTPException(status_code=403, detail="Bisa hanya untuk diri sendiri")
        result = simpanan_service.create_simpanan(db, simpanan_in)
        logger.info(f"[Simpanan] Created: id={result.id}, saldo_setelah={result.saldo_setelah}")
        return result
    except Exception as e:
        logger.error(f"[Simpanan] Create failed: {str(e)}")
        raise

@router.get("/", response_model=SimpananList)
async def list_simpanan(
    anggota_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """List simpanan (admin: all, user: own only)"""
    logger.info(f"[Simpanan] List: user_id={current_anggota.id}, role={current_anggota.role}, filter_anggota_id={anggota_id}")
    try:
        # Regular users can only see their own simpanan
        if current_anggota.role != "admin" and anggota_id and anggota_id != current_anggota.id:
            raise HTTPException(status_code=403, detail="Bisa hanya untuk diri sendiri")
        # If not admin and anggota_id not specified, default to current user's data
        if current_anggota.role != "admin":
            anggota_id = current_anggota.id
        simpanan_list = simpanan_service.get_simpanan_list(db, anggota_id, skip, limit)
        total = len(simpanan_list)  # Simplified, in real app use count query
        logger.info(f"[Simpanan] Listed: count={total}")
        return {"simpanan": simpanan_list, "total": total}
    except Exception as e:
        logger.error(f"[Simpanan] List failed: {str(e)}")
        raise

@router.get("/me", response_model=SimpananList)
async def list_my_simpanan(
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """List my simpanan (for current user)"""
    logger.info(f"[Simpanan] ListMy: user_id={current_anggota.id}")
    try:
        simpanan_list = simpanan_service.get_simpanan_list(db, current_anggota.id)
        total = len(simpanan_list)
        logger.info(f"[Simpanan] ListMy: count={total}")
        return {"simpanan": simpanan_list, "total": total}
    except Exception as e:
        logger.error(f"[Simpanan] ListMy failed: {str(e)}")
        raise

@router.get("/{id}", response_model=SimpananResponse)
async def get_simpanan(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Get simpanan by ID (admin only)"""
    logger.info(f"[Simpanan] Get: id={id}")
    try:
        simpanan = simpanan_service.get_simpanan(db, id)
        if not simpanan:
            raise HTTPException(status_code=404, detail="Simpanan not found")
        logger.info(f"[Simpanan] Got: id={simpanan.id}, nominal={simpanan.nominal}")
        return simpanan
    except Exception as e:
        logger.error(f"[Simpanan] Get failed: {str(e)}")
        raise

@router.put("/{id}", response_model=SimpananResponse)
async def update_simpanan(
    id: int,
    simpanan_in: SimpananCreate,  # Reuse Create schema for update
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Update simpanan by ID (admin only)"""
    logger.info(f"[Simpanan] Update: id={id}, nominal={simpanan_in.nominal}")
    try:
        result = simpanan_service.update_simpanan(db, id, simpanan_in)
        logger.info(f"[Simpanan] Updated: id={id}")
        return result
    except Exception as e:
        logger.error(f"[Simpanan] Update failed: {str(e)}")
        raise

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_simpanan(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Delete simpanan by ID (admin only)"""
    logger.info(f"[Simpanan] Delete: id={id}")
    try:
        simpanan_service.delete_simpanan(db, id)
        logger.info(f"[Simpanan] Deleted: id={id}")
        return
    except Exception as e:
        logger.error(f"[Simpanan] Delete failed: {str(e)}")
        raise
