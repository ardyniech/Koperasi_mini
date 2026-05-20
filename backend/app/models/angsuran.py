# backend/app/models/angsuran.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base
import enum

class StatusAngsuran(str, enum.Enum):
    BELUM_BAYAR = "Belum Bayar"
    SUDAH_BAYAR = "Sudah Bayar"

class Angsuran(Base):
    __tablename__ = "angsuran"
    id = Column(Integer, primary_key=True, index=True)
    pinjaman_id = Column(Integer, ForeignKey("pinjaman.id"), index=True, nullable=False)
    anggota_id = Column(Integer, ForeignKey("anggota.id"), index=True, nullable=False)
    bulan_ke = Column(Integer, nullable=False)
    nominal_angsuran = Column(Float, nullable=False)
    tanggal_jatuh_tempo = Column(DateTime, nullable=True)
    tanggal_bayar = Column(DateTime, nullable=True)
    status = Column(Enum(StatusAngsuran), default=StatusAngsuran.BELUM_BAYAR)
    denda = Column(Float, default=0.0)

    pinjaman = relationship("Pinjaman", back_populates="angsuran")
    anggota = relationship("Anggota", back_populates="angsuran")
