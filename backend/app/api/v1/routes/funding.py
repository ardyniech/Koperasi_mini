from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_anggota, admin_required
from app.schemas.funding import FundingCreate, FundingResponse, FundingList
from app.models.anggota import Anggota
from app.services import funding as funding_service
from app.models.funding import StatusFunding
from app.core.logger import logger

router = APIRouter(tags=["funding"])

@router.post("/", response_model=FundingResponse, status_code=status.HTTP_201_CREATED)
async def create_funding(
    funding_in: FundingCreate,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Create funding contribution (admin only)"""
    logger.info(f"[Funding] Create: anggota_id={funding_in.anggota_id}, nominal={funding_in.nominal}")
    try:
        result = funding_service.create_funding(db, funding_in)
        logger.info(f"[Funding] Created: id={result.id}, status={result.status}")
        return result
    except Exception as e:
        logger.error(f"[Funding] Create failed: {str(e)}")
        raise

@router.get("/", response_model=FundingList)
async def list_funding(
    anggota_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """List all funding contributions (admin only)"""
    logger.info(f"[Funding] List: anggota_id={anggota_id}")
    try:
        funding_list = funding_service.get_funding_list(db, anggota_id, skip, limit)
        total = len(funding_list)
        logger.info(f"[Funding] Listed: count={total}")
        return {"funding": funding_list, "total": total}
    except Exception as e:
        logger.error(f"[Funding] List failed: {str(e)}")
        raise

@router.get("/me", response_model=FundingList)
async def list_my_funding(
    db: Session = Depends(get_db),
    current_anggota: Anggota = Depends(get_current_anggota)
):
    """List my funding contributions"""
    logger.info(f"[Funding] ListMy: user_id={current_anggota.id}")
    try:
        funding_list = funding_service.get_funding_list(db, current_anggota.id)
        total = len(funding_list)
        logger.info(f"[Funding] ListMy: count={total}")
        return {"funding": funding_list, "total": total}
    except Exception as e:
        logger.error(f"[Funding] ListMy failed: {str(e)}")
        raise

@router.put("/{id}/status", response_model=FundingResponse)
async def update_funding_status(
    id: int,
    status: StatusFunding,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Update funding status (admin only)"""
    logger.info(f"[Funding] UpdateStatus: id={id}, new_status={status}")
    try:
        result = funding_service.update_funding_status(db, id, status)
        logger.info(f"[Funding] StatusUpdated: id={id}, status={result.status}")
        return result
    except Exception as e:
        logger.error(f"[Funding] UpdateStatus failed: {str(e)}")
        raise

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_funding(
    id: int,
    db: Session = Depends(get_db),
    admin: Anggota = Depends(admin_required)
):
    """Delete funding contribution (admin only)"""
    logger.info(f"[Funding] Delete: id={id}")
    try:
        funding_service.delete_funding(db, id)
        logger.info(f"[Funding] Deleted: id={id}")
    except Exception as e:
        logger.error(f"[Funding] Delete failed: {str(e)}")
        raise
