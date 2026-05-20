# backend/app/models/simpanan.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.models.base import Base

class Simpanan(Base):
    __tablename__ = "simpanan"
    id = Column(Integer, primary_key=True, index=True)
    anggota_id = Column(Integer, ForeignKey("anggota.id"), index=True, nullable=False)
    jenis = Column(String(20), nullable=False)  # Pokok, Wajib, Sukarela
    nominal = Column(Float, nullable=False)  # Bisa negatif (pengeluaran)
    saldo_setelah = Column(Float, nullable=False, default=0.0)  # Saldo setelah transaksi
    keterangan = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    anggota = relationship("Anggota", back_populates="simpanan")
