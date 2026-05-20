# backend/app/models/anggota.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base

class Anggota(Base):
    __tablename__ = "anggota"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(10), default="anggota")  # admin / anggota
    no_wa = Column(String(15), nullable=True)
    status = Column(String(10), default="Aktif")  # Aktif / Nonaktif

    simpanan = relationship("Simpanan", back_populates="anggota")
    pinjaman = relationship("Pinjaman", back_populates="anggota")
    angsuran = relationship("Angsuran", back_populates="anggota")
    funding = relationship("Funding", back_populates="anggota")
