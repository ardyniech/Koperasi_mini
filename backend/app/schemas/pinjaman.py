from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
from app.schemas.anggota import AnggotaResponse

class PinjamanBase(BaseModel):
    anggota_id: int = Field(None, description="Required for admin, auto-set for members")
    nominal: float = Field(..., gt=0)
    tenor_bulan: int = Field(..., gt=0)
    
    @field_validator('nominal')
    @classmethod
    def nominal_max_limit(cls, v):
        if v > 50000000:  # 50M
            raise ValueError('Maksimal pinjaman adalah 50.000.000')
        return v

class PinjamanCreate(PinjamanBase):
    pass

class PinjamanResponse(PinjamanBase):
    id: int
    margin_persen: float  # Ambil dari settings, bukan input member
    angsuran_per_bulan: Optional[float] = None
    status: str
    created_at: datetime
    anggota: Optional[AnggotaResponse] = None

    class Config:
        from_attributes = True

class PinjamanList(BaseModel):
    pinjaman: List[PinjamanResponse]
    total: int
