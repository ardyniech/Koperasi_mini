from fastapi import APIRouter
from app.api.v1.routes import auth, members, simpanan, pinjaman, angsuran, funding, settings, health

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(members.router, prefix="/anggota")
api_router.include_router(simpanan.router, prefix="/simpanan")
api_router.include_router(pinjaman.router, prefix="/pinjaman")
api_router.include_router(angsuran.router, prefix="/angsuran")
api_router.include_router(funding.router, prefix="/funding")
api_router.include_router(settings.router, prefix="/settings")
api_router.include_router(health.router)
api_router.include_router(__import__('app.api.v1.routes.system_info', fromlist=['router']).router, prefix="")
