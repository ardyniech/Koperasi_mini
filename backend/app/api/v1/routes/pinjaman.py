from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_anggota, admin_required
from app.schemas.pinjaman import PinjamanCreate, PinjamanResponse, PinjamanList
from app.models.anggota import Anggota
from app.services import pinjaman as pinjaman_service
from app.core.logger import logger

router = APIRouter(tags=["pinjaman"])

@router.post("/", response_model=PinjamanResponse, status_code=status.HTTP_201_CREATED)
async def create_pinjaman(
    pinjaman_in: PinjamanCreate,
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """Create loan application. Members can only apply for themselves (status: Diajukan). Admin can create for others (status: Diterima)."""
    is_admin = current_anggota.role == "admin"
    logger.info(f"[Pinjaman] Create: user_id={current_anggota.id}, is_admin={is_admin}, nominal={pinjaman_in.nominal}")
    try:
        # Members can only apply for themselves
        if not is_admin:
            pinjaman_in.anggota_id = current_anggota.id
            logger.info(f"[Pinjaman] Creating for self: anggota_id={current_anggota.id}")
            result = pinjaman_service.create_pinjaman(db, pinjaman_in, anggota_id=current_anggota.id, is_admin=False)
            logger.info(f"[Pinjaman] Created: id={result.id}, status={result.status}")
            return result
        
        # Admin can create for any member (auto-approved)
        logger.info(f"[Pinjaman] Admin creating for anggota_id={pinjaman_in.anggota_id}")
        result = pinjaman_service.create_pinjaman(db, pinjaman_in, is_admin=True)
        logger.info(f"[Pinjaman] Created by admin: id={result.id}, status={result.status}")
        return result
    except Exception as e:
        logger.error(f"[Pinjaman] Create failed: {str(e)}")
        raise

@router.get("/", response_model=PinjamanList)
async def list_pinjaman(
    anggota_id: int = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """List all pinjaman (admin only)"""
    logger.info(f"[Pinjaman] List: anggota_id={anggota_id}, status={status}")
    try:
        pinjaman_list = pinjaman_service.get_pinjaman_list(db, anggota_id, skip, limit, status)
        total = len(pinjaman_list)
        logger.info(f"[Pinjaman] Listed: count={total}")
        return {"pinjaman": pinjaman_list, "total": total}
    except Exception as e:
        logger.error(f"[Pinjaman] List failed: {str(e)}")
        raise

@router.get("/me", response_model=PinjamanList)
async def list_my_pinjaman(
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """List my pinjaman applications"""
    logger.info(f"[Pinjaman] ListMy: user_id={current_anggota.id}")
    try:
        pinjaman_list = pinjaman_service.get_pinjaman_list(db, current_anggota.id)
        total = len(pinjaman_list)
        logger.info(f"[Pinjaman] ListMy: count={total}")
        return {"pinjaman": pinjaman_list, "total": total}
    except Exception as e:
        logger.error(f"[Pinjaman] ListMy failed: {str(e)}")
        raise

@router.get("/{id}", response_model=PinjamanResponse)
async def get_pinjaman(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Get pinjaman by ID (admin only)"""
    logger.info(f"[Pinjaman] Get: id={id}")
    try:
        pinjaman = pinjaman_service.get_pinjaman(db, id)
        if not pinjaman:
            logger.warning(f"[Pinjaman] Get failed: not found - id={id}")
            raise HTTPException(status_code=404, detail="Pinjaman not found")
        logger.info(f"[Pinjaman] Got: id={id}, status={pinjaman.status}")
        return pinjaman
    except Exception as e:
        logger.error(f"[Pinjaman] Get failed: {str(e)}")
        raise

@router.put("/{id}", response_model=PinjamanResponse)
async def update_pinjaman(
    id: int,
    pinjaman_in: PinjamanCreate,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Update pinjaman by ID (admin only)"""
    logger.info(f"[Pinjaman] Update: id={id}")
    try:
        result = pinjaman_service.update_pinjaman(db, id, pinjaman_in)
        logger.info(f"[Pinjaman] Updated: id={id}")
        return result
    except Exception as e:
        logger.error(f"[Pinjaman] Update failed: {str(e)}")
        raise

@router.put("/{id}/approve", response_model=PinjamanResponse)
async def approve_pinjaman(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Approve a loan application (status: Diajukan -> Diterima)"""
    logger.info(f"[Pinjaman] Approve: id={id}")
    try:
        result = pinjaman_service.approve_pinjaman(db, id)
        logger.info(f"[Pinjaman] Approved: id={id}, status={result.status}")
        return result
    except Exception as e:
        logger.error(f"[Pinjaman] Approve failed: {str(e)}")
        raise

@router.put("/{id}/reject", response_model=PinjamanResponse)
async def reject_pinjaman(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Reject a loan application (status: Diajukan -> Ditolak)"""
    logger.info(f"[Pinjaman] Reject: id={id}")
    try:
        result = pinjaman_service.reject_pinjaman(db, id)
        logger.info(f"[Pinjaman] Rejected: id={id}, status={result.status}")
        return result
    except Exception as e:
        logger.error(f"[Pinjaman] Reject failed: {str(e)}")
        raise

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pinjaman(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Delete pinjaman by ID (admin only)"""
    logger.info(f"[Pinjaman] Delete: id={id}")
    try:
        pinjaman_service.delete_pinjaman(db, id)
        logger.info(f"[Pinjaman] Deleted: id={id}")
    except Exception as e:
        logger.error(f"[Pinjaman] Delete failed: {str(e)}")
        raise
