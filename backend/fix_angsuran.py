#!/usr/bin/env python3
"""Fix: Generate angsuran for active loans missing them"""
import sys
sys.path.insert(0, '/home/ardy/koperasi_mini/backend')

from app.db.session import SessionLocal
from app.models.pinjaman import Pinjaman, StatusPinjaman
from app.models.angsuran import Angsuran, StatusAngsuran
from datetime import datetime, timezone, timedelta

def main():
    db = SessionLocal()
    try:
        # Find active loans (not Lunas)
        pinjaman_aktif = db.query(Pinjaman).filter(
            Pinjaman.status != 'Lunas'
        ).all()
        
        print(f"Total pinjaman aktif: {len(pinjaman_aktif)}")
        fixed = 0
        
        for p in pinjaman_aktif:
            # Check if angsuran exists
            angsuran_count = db.query(Angsuran).filter(
                Angsuran.pinjaman_id == p.id
            ).count()
            
            if angsuran_count == 0:
                print(f"FIXING: Pinjaman {p.id} (nominal: {p.nominal}, tenor: {p.tenor_bulan})")
                
                # Generate angsuran
                for bulan_ke in range(1, p.tenor_bulan + 1):
                    jatuh_tempo = datetime.now(timezone.utc) + timedelta(days=30 * bulan_ke)
                    db_angsuran = Angsuran(
                        pinjaman_id=p.id,
                        anggota_id=p.anggota_id,
                        bulan_ke=bulan_ke,
                        nominal_angsuran=p.angsuran_per_bulan,
                        tanggal_jatuh_tempo=jatuh_tempo,
                        status=StatusAngsuran.BELUM_BAYAR
                    )
                    db.add(db_angsuran)
                
                fixed += 1
                print(f"  -> Generated {p.tenor_bulan} angsuran records")
        
        if fixed > 0:
            db.commit()
            print(f"\nSUCCESS: Fixed {fixed} pinjaman - generated angsuran records!")
        else:
            print("\nNo fixes needed - all active loans have angsuran records")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    main()
