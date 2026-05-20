# backend/app/services/angsuran_helpers.py
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from app.models.angsuran import Angsuran, StatusAngsuran
from app.schemas.angsuran import AngsuranUpdate
from app.services import simpanan as simpanan_service
from app.schemas.simpanan import SimpananCreate

def process_payment(db, db_angsuran, update_data):
    """Process angsuran payment (Syariah: no denda/late fees)."""
    # Set tanggal bayar to now if not provided
    db_angsuran.tanggal_bayar = update_data.tanggal_bayar or datetime.now(timezone.utc)
    
    # Syariah: NO denda/late fees!
    db_angsuran.denda = 0.0
    
    # Integasi saldo: Potong saldo simpanan untuk bayar angsuran
    anggota_id = db_angsuran.anggota_id
    nominal_bayar = db_angsuran.nominal_angsuran  # No denda in Syariah!
    saldo_sekarang = simpanan_service.calculate_saldo(db, anggota_id)
    
    if saldo_sekarang >= nominal_bayar:
        # Saldo cukup, buat record simpanan keluar (pengeluaran) untuk pembayaran angsuran
        simpanan_out = SimpananCreate(
            anggota_id=anggota_id,
            jenis="angsuran",  # kategori khusus untuk pembayaran angsuran
            nominal=-nominal_bayar,  # NEGATIVE untuk kurangin saldo
            keterangan=f"Pembayaran angsuran ke-{db_angsuran.ke} dari pinjaman #{db_angsuran.pinjaman_id}"
        )
        simpanan_service.create_simpanan(db, simpanan_out)
        db_angsuran.status = StatusAngsuran.SUDAH_BAYAR  # BARU set status SUDAH_BAYAR kalau saldo cukup!
    else:
        # Saldo kurang, jangan set status jadi SUDAH_BAYAR!
        db_angsuran.keterangan = (db_angsuran.keterangan or "") + f" | GAGAL BAYAR: Saldo kurang: Rp {nominal_bayar - saldo_sekarang:,.0f}"
        raise HTTPException(
            status_code=400,
            detail=f"Saldo tidak cukup! Kurang: Rp {nominal_bayar - saldo_sekarang:,.0f}"
        )

def check_and_set_status(db_angsuran, update_data):
    """Update angsuran status based on update_data."""
    if update_data.status:
        if update_data.status == StatusAngsuran.SUDAH_BAYAR:
            process_payment(db_angsuran, update_data)
        else:
            db_angsuran.status = update_data.status  # Status selain SUDAH_BAYAR (misal: BELUM_BAYAR)
    
    if update_data.tanggal_bayar:
        db_angsuran.tanggal_bayar = update_data.tanggal_bayar
    if update_data.denda is not None:
        db_angsuran.denda = update_data.denda
