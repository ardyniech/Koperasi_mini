# backend/app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.logger import logger
from app.exceptions import register_exception_handlers

app = FastAPI(title="Koperasi Mini API", version="1.0")

# Prometheus metrics
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentor = Instrumentator()
Instrumentor.instrument(app).expose(app)

# Register global exception handlers
register_exception_handlers(app)

# Request logging middleware (for debugging - SOUL.md Rule 9)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"[Request] {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"[Response] {request.method} {request.url.path} - Status: {response.status_code}")
    return response

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.1.7:1985", "http://127.0.0.1:1985", "http://localhost:1985", 
                   "http://192.168.1.7:5173", "http://127.0.0.1:5173", "http://localhost:5173",
                   "http://100.117.176.41:1985"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/test")
def test_route():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "Koperasi Mini API is running"}
