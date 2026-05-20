from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.schemas.anggota import AnggotaResponse

class AngsuranBase(BaseModel):
    pinjaman_id: int
    anggota_id: int
    bulan_ke: int = Field(..., gt=0)
    nominal_angsuran: float = Field(..., gt=0)
    tanggal_jatuh_tempo: Optional[datetime] = None
    tanggal_bayar: Optional[datetime] = None
    denda: float = Field(default=0.0, ge=0)

class AngsuranCreate(AngsuranBase):
    pass

class AngsuranUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(Belum Bayar|Sudah Bayar)$")
    tanggal_bayar: Optional[datetime] = None
    denda: Optional[float] = Field(None, ge=0)

class AngsuranResponse(AngsuranBase):
    id: int
    status: str
    created_at: Optional[datetime] = None
    anggota: Optional[AnggotaResponse] = None

    class Config:
        from_attributes = True

class AngsuranList(BaseModel):
    angsuran: List[AngsuranResponse]
    total: int
