from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from app.models.pinjaman import Pinjaman, StatusPinjaman
from app.models.angsuran import Angsuran, StatusAngsuran
from app.schemas.pinjaman import PinjamanCreate
from fastapi import HTTPException, status
from app.services import settings as settings_service

def calculate_angsuran(nominal: float, margin_persen: float, tenor_bulan: int):
    # Syariah: margin is total margin over tenor, not compound
    total_margin = (nominal * margin_persen * tenor_bulan) / (12 * 100)
    total_bayar = nominal + total_margin
    angsuran_per_bulan = total_bayar / tenor_bulan
    return angsuran_per_bulan, total_margin

def create_pinjaman(db: Session, pinjaman_in: PinjamanCreate, anggota_id: int = None, is_admin: bool = False) -> Pinjaman:
    # Get margin_persen from settings (NOT from request)
    settings = settings_service.get_settings(db)
    margin_persen = settings.margin_persen if settings else 5.0  # Default 5% if settings not found
    
    # Calculate angsuran per bulan
    angsuran_per_bulan, total_margin = calculate_angsuran(
        pinjaman_in.nominal, margin_persen, pinjaman_in.tenor_bulan
    )
    
    # Determine status: Diajukan for members, Diterima for admin
    status = StatusPinjaman.DIAJUKAN if not is_admin else StatusPinjaman.DITERIMA
    
    # Use provided anggota_id (for members) or from input (for admin)
    final_anggota_id = anggota_id if anggota_id else pinjaman_in.anggota_id
    
    db_pinjaman = Pinjaman(
        anggota_id=final_anggota_id,
        nominal=pinjaman_in.nominal,
        margin_persen=margin_persen,  # From settings, not request
        tenor_bulan=pinjaman_in.tenor_bulan,
        angsuran_per_bulan=angsuran_per_bulan if status == StatusPinjaman.DITERIMA else None,
        status=status
    )
    db.add(db_pinjaman)
    db.commit()
    db.refresh(db_pinjaman)
    
    # Generate angsuran entries only if approved (admin) or auto-approved
    if status == StatusPinjaman.DITERIMA:
        for bulan_ke in range(1, pinjaman_in.tenor_bulan + 1):
            jatuh_tempo = datetime.now(timezone.utc) + timedelta(days=30 * bulan_ke)
            db_angsuran = Angsuran(
                pinjaman_id=db_pinjaman.id,
                anggota_id=final_anggota_id,
                bulan_ke=bulan_ke,
                nominal_angsuran=angsuran_per_bulan,
                tanggal_jatuh_tempo=jatuh_tempo,
                status=StatusAngsuran.BELUM_BAYAR
            )
            db.add(db_angsuran)
        db.commit()
    
    return db_pinjaman

def get_pinjaman(db: Session, id: int):
    return db.query(Pinjaman).filter(Pinjaman.id == id).first()

def get_pinjaman_list(db: Session, anggota_id: int = None, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(Pinjaman)
    if anggota_id:
        query = query.filter(Pinjaman.anggota_id == anggota_id)
    if status:
        query = query.filter(Pinjaman.status == status)
    return query.order_by(Pinjaman.created_at.desc()).offset(skip).limit(limit).all()

def update_pinjaman(db: Session, id: int, pinjaman_in: PinjamanCreate):
    db_pinjaman = get_pinjaman(db, id)
    if not db_pinjaman:
        raise HTTPException(status_code=404, detail="Pinjaman not found")
    
    update_data = pinjaman_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_pinjaman, field, value)
    
    # Recalculate angsuran if nominal/tenor changed (margin_persen from settings, not request)
    if any(field in update_data for field in ['nominal', 'tenor_bulan']):
        settings = settings_service.get_settings(db)
        margin_persen = db_pinjaman.margin_persen  # Keep existing margin from settings
        db_pinjaman.angsuran_per_bulan, _ = calculate_angsuran(
            db_pinjaman.nominal, margin_persen, db_pinjaman.tenor_bulan
        )
        # TODO: Update existing angsuran entries if needed
    
    db.add(db_pinjaman)
    db.commit()
    db.refresh(db_pinjaman)
    return db_pinjaman

def delete_pinjaman(db: Session, id: int):
    db_pinjaman = get_pinjaman(db, id)
    if not db_pinjaman:
        raise HTTPException(status_code=404, detail="Pinjaman not found")
    # Delete related angsuran first
    db.query(Angsuran).filter(Angsuran.pinjaman_id == id).delete()
    db.delete(db_pinjaman)
    db.commit()
    return {"ok": True}

def check_pinjaman_lunas(db: Session, pinjaman_id: int):
    pinjaman = get_pinjaman(db, pinjaman_id)
    if not pinjaman:
        return False
    angsuran_list = db.query(Angsuran).filter(Angsuran.pinjaman_id == pinjaman_id).all()
    if all(a.status == StatusAngsuran.SUDAH_BAYAR for a in angsuran_list):
        pinjaman.status = StatusPinjaman.LUNAS
        db.add(pinjaman)
        db.commit()
        return True
    return False

def approve_pinjaman(db: Session, pinjaman_id: int):
    """Approve a loan application: change status to Diterima and generate angsuran entries"""
    pinjaman = get_pinjaman(db, pinjaman_id)
    if not pinjaman:
        raise HTTPException(status_code=404, detail="Pinjaman not found")
    if pinjaman.status != StatusPinjaman.DIAJUKAN:
        raise HTTPException(status_code=400, detail="Pinjaman is not in Diajukan status")
    
    # Update status
    pinjaman.status = StatusPinjaman.DITERIMA
    pinjaman.angsuran_per_bulan = pinjaman.angsuran_per_bulan or (
        (pinjaman.nominal + (pinjaman.nominal * pinjaman.margin_persen * pinjaman.tenor_bulan) / (12 * 100)) / pinjaman.tenor_bulan
    )
    db.add(pinjaman)
    db.commit()
    
    # Generate angsuran entries
    for bulan_ke in range(1, pinjaman.tenor_bulan + 1):
        jatuh_tempo = datetime.now(timezone.utc) + timedelta(days=30 * bulan_ke)
        db_angsuran = Angsuran(
            pinjaman_id=pinjaman.id,
            anggota_id=pinjaman.anggota_id,
            bulan_ke=bulan_ke,
            nominal_angsuran=pinjaman.angsuran_per_bulan,
            tanggal_jatuh_tempo=jatuh_tempo,
            status=StatusAngsuran.BELUM_BAYAR
        )
        db.add(db_angsuran)
    db.commit()
    return pinjaman

def reject_pinjaman(db: Session, pinjaman_id: int):
    """Reject a loan application: change status to Ditolak"""
    pinjaman = get_pinjaman(db, pinjaman_id)
    if not pinjaman:
        raise HTTPException(status_code=404, detail="Pinjaman not found")
    if pinjaman.status != StatusPinjaman.DIAJUKAN:
        raise HTTPException(status_code=400, detail="Pinjaman is not in Diajukan status")
    
    pinjaman.status = StatusPinjaman.DITOLAK
    db.add(pinjaman)
    db.commit()
    return pinjaman
