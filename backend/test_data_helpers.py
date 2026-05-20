# backend/test_data_helpers.py
from datetime import datetime, timedelta
import random
from app.models.simpanan import Simpanan
from app.models.pinjaman import Pinjaman, StatusPinjaman
from app.models.angsuran import Angsuran, StatusAngsuran
from app.models.funding import Funding, StatusFunding

def create_simpanan_for_member(db, member, now):
    """Create random simpanan for a member."""
    simpanan = Simpanan(
        anggota_id=member.id,
        jenis=random.choice(["Pokok", "Wajib", "Sukarela"]),
        nominal=random.randint(100000, 5000000),
        saldo_setelah=random.randint(100000, 10000000),
        keterangan="Test simpanan",
        created_at=now
    )
    db.add(simpanan)

def create_pinjaman_for_member(db, member, now):
    """Create random pinjaman with angsuran schedule."""
    tenor = random.randint(6, 24)
    margin = random.randint(5, 15)
    nominal = random.randint(5000000, 50000000)
    angsuran_per_bulan = nominal // tenor
    
    pinjaman = Pinjaman(
        anggota_id=member.id,
        nominal=nominal,
        margin_persen=margin,
        tenor_bulan=tenor,
        angsuran_per_bulan=angsuran_per_bulan,
        status=StatusPinjaman.AKTIF,
        created_at=now
    )
    db.add(pinjaman)
    db.flush()  # Get ID
    
    # Create angsuran schedule
    for bulan in range(1, tenor + 1):
        tanggal_jatuh_tempo = now + timedelta(days=30 * bulan)
        angsuran = Angsuran(
            pinjaman_id=pinjaman.id,
            anggota_id=member.id,
            bulan_ke=bulan,
            nominal_angsuran=angsuran_per_bulan,
            tanggal_jatuh_tempo=tanggal_jatuh_tempo,
            status=StatusAngsuran.SUDAH_BAYAR if bulan <= 2 else StatusAngsuran.BELUM_BAYAR
        )
        db.add(angsuran)

def create_funding_for_member(db, member, now):
    """Create random funding for a member."""
    funding = Funding(
        anggota_id=member.id,
        nominal=random.randint(1000000, 20000000),
        tujuan_usaha=random.choice(["Warung Kelontong", "Jasa Laundry", "Bengkel Motor", "Toko Online"]),
        status=StatusFunding.DISETUJUI,
        created_at=now
    )
    db.add(funding)
