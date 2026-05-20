from sqlalchemy.orm import Session
from app.models.funding import Funding, StatusFunding
from app.schemas.funding import FundingCreate
from fastapi import HTTPException, status

def create_funding(db: Session, funding_in: FundingCreate) -> Funding:
    db_funding = Funding(
        anggota_id=funding_in.anggota_id,
        nominal=funding_in.nominal,
        tujuan_usaha=funding_in.tujuan_usaha
    )
    db.add(db_funding)
    db.commit()
    db.refresh(db_funding)
    return db_funding

def get_funding(db: Session, id: int):
    return db.query(Funding).filter(Funding.id == id).first()

def get_funding_list(db: Session, anggota_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(Funding)
    if anggota_id:
        query = query.filter(Funding.anggota_id == anggota_id)
    return query.order_by(Funding.created_at.desc()).offset(skip).limit(limit).all()

def update_funding_status(db: Session, id: int, status: StatusFunding):
    db_funding = get_funding(db, id)
    if not db_funding:
        raise HTTPException(status_code=404, detail="Funding not found")
    db_funding.status = status
    db.add(db_funding)
    db.commit()
    db.refresh(db_funding)
    return db_funding

def delete_funding(db: Session, id: int):
    db_funding = get_funding(db, id)
    if not db_funding:
        raise HTTPException(status_code=404, detail="Funding not found")
    db.delete(db_funding)
    db.commit()
    return {"ok": True}
