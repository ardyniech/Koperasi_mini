# backend/app/models/pinjaman.py
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.models.base import Base
import enum

class StatusPinjaman(str, enum.Enum):
    DIAJUKAN = "Diajukan"
    DITERIMA = "Diterima"
    DITOLAK = "Ditolak"
    AKTIF = "Aktif"
    LUNAS = "Lunas"

class Pinjaman(Base):
    __tablename__ = "pinjaman"
    id = Column(Integer, primary_key=True, index=True)
    anggota_id = Column(Integer, ForeignKey("anggota.id"), index=True, nullable=False)
    nominal = Column(Float, nullable=False)
    margin_persen = Column(Float, nullable=False)  # margin per tahun (syariah, bukan bunga)
    tenor_bulan = Column(Integer, nullable=False)
    angsuran_per_bulan = Column(Float, nullable=True)
    status = Column(Enum(StatusPinjaman), default=StatusPinjaman.DIAJUKAN)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    anggota = relationship("Anggota", back_populates="pinjaman")
    angsuran = relationship("Angsuran", back_populates="pinjaman")
