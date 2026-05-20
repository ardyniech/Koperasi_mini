from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.models.base import Base
import enum

class StatusFunding(str, enum.Enum):
    DIAJUKAN = "Diajukan"
    DISETUJUI = "Disetujui"
    DICAIRKAN = "Dicairkan"

class Funding(Base):
    __tablename__ = "funding"
    id = Column(Integer, primary_key=True, index=True)
    anggota_id = Column(Integer, ForeignKey("anggota.id"), index=True, nullable=False)
    nominal = Column(Float, nullable=False)
    tujuan_usaha = Column(String(200), nullable=False)
    status = Column(Enum(StatusFunding), default=StatusFunding.DIAJUKAN)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    anggota = relationship("Anggota", back_populates="funding")
