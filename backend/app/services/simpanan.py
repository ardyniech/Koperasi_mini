from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.simpanan import Simpanan
from app.schemas.simpanan import SimpananCreate
from fastapi import HTTPException, status

def calculate_saldo(db: Session, anggota_id: int) -> float:
    # Hitung saldo langsung dari DB pakai sum(nominal)
    result = db.query(func.sum(Simpanan.nominal)).filter(Simpanan.anggota_id == anggota_id).scalar()
    return float(result or 0.0)

def create_simpanan(db: Session, simpanan_in: SimpananCreate) -> Simpanan:
    # Calculate current saldo
    current_saldo = calculate_saldo(db, simpanan_in.anggota_id)
    
    # Check saldo for angsuran (withdrawal) to prevent negative saldo
    if simpanan_in.jenis == 'angsuran':
        new_saldo = current_saldo + simpanan_in.nominal  # nominal is negative for angsuran
        if new_saldo < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Saldo tidak cukup! Saldo saat ini: {current_saldo}, Pengeluaran: {-simpanan_in.nominal}"
            )
    
    # Calculate saldo_setelah
    saldo_setelah = current_saldo + simpanan_in.nominal
    
    db_simpanan = Simpanan(
        anggota_id=simpanan_in.anggota_id,
        jenis=simpanan_in.jenis,
        nominal=simpanan_in.nominal,
        saldo_setelah=saldo_setelah,
        keterangan=simpanan_in.keterangan
    )
    db.add(db_simpanan)
    db.commit()
    db.refresh(db_simpanan)
    return db_simpanan

def get_simpanan(db: Session, id: int):
    return db.query(Simpanan).filter(Simpanan.id == id).first()

def get_simpanan_list(db: Session, anggota_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(Simpanan)
    if anggota_id:
        query = query.filter(Simpanan.anggota_id == anggota_id)
    return query.order_by(Simpanan.created_at.desc()).offset(skip).limit(limit).all()

def update_simpanan(db: Session, id: int, simpanan_in: SimpananCreate):
    db_simpanan = get_simpanan(db, id)
    if not db_simpanan:
        raise HTTPException(status_code=404, detail="Simpanan not found")
    
    update_data = simpanan_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_simpanan, field, value)
    
    # Recalculate saldo_setelah if nominal or anggota_id changed
    if 'nominal' in update_data or 'anggota_id' in update_data:
        current_saldo = calculate_saldo(db, db_simpanan.anggota_id)
        db_simpanan.saldo_setelah = current_saldo
    
    db.add(db_simpanan)
    db.commit()
    db.refresh(db_simpanan)
    return db_simpanan

def delete_simpanan(db: Session, id: int):
    db_simpanan = get_simpanan(db, id)
    if not db_simpanan:
        raise HTTPException(status_code=404, detail="Simpanan not found")
    db.delete(db_simpanan)
    db.commit()
    return {"ok": True}
