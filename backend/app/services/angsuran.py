from sqlalchemy.orm import Session
from app.models.angsuran import Angsuran, StatusAngsuran
from app.schemas.angsuran import AngsuranUpdate
from fastapi import HTTPException, status
from app.services import pinjaman as pinjaman_service
from app.services.angsuran_helpers import check_and_set_status
from app.models.anggota import Anggota

def get_angsuran(db: Session, id: int):
    return db.query(Angsuran).filter(Angsuran.id == id).first()

def get_angsuran_list(
    db: Session, 
    pinjaman_id: int = None, 
    anggota_id: int = None, 
    status: str = None,
    skip: int = 0, 
    limit: int = 0  # 0 means no limit
):
    query = db.query(Angsuran)
    if pinjaman_id:
        query = query.filter(Angsuran.pinjaman_id == pinjaman_id)
    if anggota_id:
        query = query.filter(Angsuran.anggota_id == anggota_id)
    if status:
        query = query.filter(Angsuran.status == status)
    if limit > 0:
        return query.order_by(Angsuran.tanggal_jatuh_tempo.asc()).offset(skip).limit(limit).all()
    return query.order_by(Angsuran.tanggal_jatuh_tempo.asc()).offset(skip).all()

def update_angsuran(db: Session, id: int, update_data: AngsuranUpdate):
    db_angsuran = get_angsuran(db, id)
    if not db_angsuran:
        raise HTTPException(status_code=404, detail="Angsuran not found")
    
    # Use helper to check and set status
    check_and_set_status(db, db_angsuran, update_data)
    
    db.add(db_angsuran)
    db.commit()
    db.refresh(db_angsuran)
    
    # Check if all angsuran for this pinjaman are paid
    if db_angsuran.status == StatusAngsuran.SUDAH_BAYAR:
        pinjaman_service.check_pinjaman_lunas(db, db_angsuran.pinjaman_id)
    
    return db_angsuran

def delete_angsuran(db: Session, id: int):
    db_angsuran = get_angsuran(db, id)
    if not db_angsuran:
        raise HTTPException(status_code=404, detail="Angsuran not found")
    db.delete(db_angsuran)
    db.commit()
    return {"ok": True}

def pay_angsuran(db: Session, id: int, current_anggota: Anggota):
    """Bayar angsuran pakai saldo anggota."""
    from app.services import simpanan as simpanan_service
    
    angsuran = get_angsuran(db, id)
    if not angsuran:
        raise HTTPException(status_code=404, detail="Angsuran not found")
    
    if angsuran.status == StatusAngsuran.SUDAH_BAYAR:
        raise HTTPException(status_code=400, detail="Angsuran sudah dibayar")
    
    # Check if this is the anggota's own angsuran
    if angsuran.anggota_id != current_anggota.id and current_anggota.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check saldo
    from app.services.simpanan import calculate_saldo
    saldo = calculate_saldo(db, current_anggota.id)
    if saldo < angsuran.nominal_angsuran:
        raise HTTPException(status_code=400, detail=f"Saldo tidak cukup. Saldo: {saldo}, Kebutuhan: {angsuran.nominal_angsuran}")
    
    # Deduct saldo (create simpanan with negative nominal = withdrawal)
    from app.schemas.simpanan import SimpananCreate
    simpanan_service.create_simpanan(db, SimpananCreate(
        anggota_id=current_anggota.id,
        jenis='angsuran',  # Gunakan 'angsuran' sesuai check di create_simpanan
        nominal=-angsuran.nominal_angsuran,  # Negative = withdrawal
        keterangan=f"Pembayaran angsuran #{id}"
    ))
    
    # Update status
    angsuran.status = StatusAngsuran.SUDAH_BAYAR
    db.commit()
    db.refresh(angsuran)
    
    # Check if all angsuran for this pinjaman are paid
    pinjaman_service.check_pinjaman_lunas(db, angsuran.pinjaman_id)
    
    return angsuran

def get_upcoming_angsuran(db: Session, days: int = 7):
    """Angsuran yang akan jatuh tempo dalam X hari ke depan."""
    from datetime import datetime, timedelta, timezone
    today = datetime.now(timezone.utc)
    deadline = today + timedelta(days=days)
    return db.query(Angsuran).filter(
        Angsuran.tanggal_jatuh_tempo.between(today, deadline),
        Angsuran.status == StatusAngsuran.BELUM_BAYAR
    ).all()

def get_overdue_angsuran(db: Session):
    """Angsuran yang sudah lewat jatuh tempo (Syariah: no denda!)."""
    from datetime import datetime, timezone
    today = datetime.now(timezone.utc)
    return db.query(Angsuran).filter(
        Angsuran.tanggal_jatuh_tempo < today,
        Angsuran.status == StatusAngsuran.BELUM_BAYAR
    ).all()
