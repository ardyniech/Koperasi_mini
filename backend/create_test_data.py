import sys
import random
sys.path.insert(0, '/data/data/com.termux/files/home/koperasi_mini/backend')

from app.db.session import engine
from app.models import Base
from app.db.session import SessionLocal
from app.models.anggota import Anggota
from app.core.security import get_password_hash
from test_data_helpers import create_simpanan_for_member, create_pinjaman_for_member, create_funding_for_member
from datetime import datetime

# Create tables
print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created!")

db = SessionLocal()

# Create 35 test members
created = 0
for i in range(1, 36):
    email = f"anggota{i}@koperasi.com"
    existing = db.query(Anggota).filter(Anggota.email == email).first()
    
    if not existing:
        member = Anggota(
            nama=f"Anggota {i}",
            email=email,
            password_hash=get_password_hash("test123"),
            role="anggota",
            status="aktif"
        )
        db.add(member)
        created += 1

db.commit()
print(f"Created {created} new members")

# Get all members
members = db.query(Anggota).all()
print(f"Total members: {len(members)}")

# Add sample transactions for each member
now = datetime.now()
for member in members:
    if random.choice([True, False]):
        create_simpanan_for_member(db, member, now)
    if random.choice([True, False]):
        create_pinjaman_for_member(db, member, now)
    if random.choice([True, False]):
        create_funding_for_member(db, member, now)

db.commit()
print("Sample transactions added")

# Print summary
from app.models.simpanan import Simpanan
from app.models.pinjaman import Pinjaman
from app.models.angsuran import Angsuran
from app.models.funding import Funding

print(f"\nSummary:")
print(f"Members: {len(members)}")
print(f"Simpanan: {db.query(Simpanan).count()}")
print(f"Pinjaman: {db.query(Pinjaman).count()}")
print(f"Angsuran: {db.query(Angsuran).count()}")
print(f"Funding: {db.query(Funding).count()}")

db.close()
print("\nDone!")
