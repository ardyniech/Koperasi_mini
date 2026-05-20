from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List
from app.schemas.anggota import AnggotaResponse

class SimpananBase(BaseModel):
    anggota_id: int
    jenis: str = Field(..., pattern="^(Pokok|Wajib|Sukarela|angsuran)$")  # Tambah "angsuran" untuk pengeluaran
    nominal: float = Field(..., description="Positive untuk pemasukan, negative untuk pengeluaran (angsuran)")
    keterangan: Optional[str] = None
    
    @field_validator('nominal')
    @classmethod
    def nominal_must_be_valid(cls, v, info):
        # Access other field values via info.data
        jenis = info.data.get('jenis') if hasattr(info, 'data') else None
        # For angsuran (pengeluaran), allow negative
        if jenis == 'angsuran':
            if v >= 0:
                raise ValueError('Nominal angsuran harus negative (pengeluaran)')
        # For other types, must be positive
        else:
            if v <= 0:
                raise ValueError('Nominal harus lebih dari 0')
        return v

class SimpananCreate(SimpananBase):
    pass

class SimpananResponse(SimpananBase):
    id: int
    saldo_setelah: float
    created_at: datetime
    anggota: Optional[AnggotaResponse] = None

    class Config:
        from_attributes = True

class SimpananList(BaseModel):
    simpanan: List[SimpananResponse]
    total: int
