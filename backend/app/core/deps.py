from fastapi import Depends, HTTPException, status
from app.core.security import get_current_anggota_from_token
from app.models.anggota import Anggota

async def get_current_anggota(anggota: Anggota = Depends(get_current_anggota_from_token)) -> Anggota:
    return anggota

async def admin_required(anggota: Anggota = Depends(get_current_anggota)) -> Anggota:
    if anggota.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return anggota
