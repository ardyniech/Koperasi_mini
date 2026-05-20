from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.schemas.anggota import AnggotaResponse

class FundingBase(BaseModel):
    anggota_id: int
    nominal: float = Field(..., gt=0)
    tujuan_usaha: str = Field(..., min_length=5)

class FundingCreate(FundingBase):
    pass

class FundingResponse(FundingBase):
    id: int
    status: str
    created_at: datetime
    anggota: Optional[AnggotaResponse] = None

    class Config:
        from_attributes = True

class FundingList(BaseModel):
    funding: List[FundingResponse]
    total: int
