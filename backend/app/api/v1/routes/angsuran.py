from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.core.deps import get_current_anggota, admin_required
from app.schemas.angsuran import AngsuranUpdate, AngsuranResponse, AngsuranList
from app.models.anggota import Anggota
from app.services import angsuran as angsuran_service
from app.models.angsuran import StatusAngsuran
from app.core.logger import logger

router = APIRouter(tags=["angsuran"])

@router.get("/", response_model=AngsuranList)
async def list_angsuran(
    pinjaman_id: int = None,
    anggota_id: int = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """List all angsuran (admin only)"""
    logger.info(f"[Angsuran] List: pinjaman_id={pinjaman_id}, anggota_id={anggota_id}, status={status}")
    try:
        angsuran_list = angsuran_service.get_angsuran_list(db, pinjaman_id, anggota_id, status, skip, limit)
        total = len(angsuran_list)
        logger.info(f"[Angsuran] Listed: count={total}")
        return {"angsuran": angsuran_list, "total": total}
    except Exception as e:
        logger.error(f"[Angsuran] List failed: {str(e)}")
        raise

@router.get("/me", response_model=AngsuranList)
async def list_my_angsuran(
    status: str = None,
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """List my angsuran payments"""
    logger.info(f"[Angsuran] ListMy: user_id={current_anggota.id}, status={status}")
    try:
        angsuran_list = angsuran_service.get_angsuran_list(db, anggota_id=current_anggota.id, status=status)
        total = len(angsuran_list)
        logger.info(f"[Angsuran] ListMy: count={total}")
        return {"angsuran": angsuran_list, "total": total}
    except Exception as e:
        logger.error(f"[Angsuran] ListMy failed: {str(e)}")
        raise

@router.get("/upcoming", response_model=AngsuranList)
async def list_upcoming_angsuran(
    days: int = 7,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """List upcoming angsuran payments (admin only)"""
    logger.info(f"[Angsuran] ListUpcoming: days={days}")
    try:
        angsuran_list = angsuran_service.get_upcoming_angsuran(db, days)
        total = len(angsuran_list)
        logger.info(f"[Angsuran] ListedUpcoming: count={total}")
        return {"angsuran": angsuran_list, "total": total}
    except Exception as e:
        logger.error(f"[Angsuran] ListUpcoming failed: {str(e)}")
        raise

@router.get("/overdue", response_model=AngsuranList)
async def list_overdue_angsuran(
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """List overdue angsuran payments (admin only)"""
    logger.info("[Angsuran] ListOverdue: Started")
    try:
        angsuran_list = angsuran_service.get_overdue_angsuran(db)
        total = len(angsuran_list)
        logger.info(f"[Angsuran] ListedOverdue: count={total}")
        return {"angsuran": angsuran_list, "total": total}
    except Exception as e:
        logger.error(f"[Angsuran] ListOverdue failed: {str(e)}")
        raise

@router.put("/{id}", response_model=AngsuranResponse)
async def update_angsuran(
    id: int,
    update_data: AngsuranUpdate,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Update angsuran by ID (admin only)"""
    logger.info(f"[Angsuran] Update: id={id}")
    try:
        result = angsuran_service.update_angsuran(db, id, update_data)
        logger.info(f"[Angsuran] Updated: id={id}")
        return result
    except Exception as e:
        logger.error(f"[Angsuran] Update failed: {str(e)}")
        raise

@router.post("/{id}/pay", response_model=AngsuranResponse)
async def pay_angsuran(
    id: int,
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """Bayar angsuran pakai saldo."""
    logger.info(f"[Angsuran] Pay: id={id}, user_id={current_anggota.id}")
    try:
        result = angsuran_service.pay_angsuran(db, id, current_anggota)
        logger.info(f"[Angsuran] Paid: id={id}, status={result.status}")
        return result
    except Exception as e:
        logger.error(f"[Angsuran] Pay failed: {str(e)}")
        raise

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_angsuran(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Delete angsuran by ID (admin only)"""
    logger.info(f"[Angsuran] Delete: id={id}")
    try:
        angsuran_service.delete_angsuran(db, id)
        logger.info(f"[Angsuran] Deleted: id={id}")
    except Exception as e:
        logger.error(f"[Angsuran] Delete failed: {str(e)}")
        raise
