# backend/app/schemas/anggota.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class AnggotaBase(BaseModel):
    nama: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    no_wa: Optional[str] = Field(None, max_length=15)

class AnggotaCreate(AnggotaBase):
    password: str = Field(..., min_length=6)

class AnggotaLogin(BaseModel):
    identifier: str  # Can be email or phone number
    password: str
    
    class Config:
        # Allow either email or phone_number
        pass

class AnggotaResponse(AnggotaBase):
    id: int
    role: str
    status: str

    class Config:
        from_attributes = True

class AnggotaUpdate(BaseModel):
    nama: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    no_wa: Optional[str] = Field(None, max_length=15)
    password: Optional[str] = Field(None, min_length=6)
    role: Optional[str] = None
    status: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
