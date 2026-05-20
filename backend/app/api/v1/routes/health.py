"""Health check endpoint for FastAPI service.
Provides:
- basic status (always ok)
- database connectivity test (SQLite for now, replace with PostgreSQL later)
- simple latency measurement (ms) for the DB ping.
"""
import time
from fastapi import APIRouter, Depends
from sqlalchemy.exc import SQLAlchemyError
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/health", tags=["health"])
def health_check(db: Session = Depends(get_db)):
    """Return health information.
    * status: "ok"
    * db_connected: bool
    * db_latency_ms: float (or -1 if failed)
    """
    start = time.time()
    try:
        # simple lightweight query – SELECT 1
        db.execute("SELECT 1")
        db_connected = True
    except SQLAlchemyError:
        db_connected = False
    latency_ms = (time.time() - start) * 1000
    return {
        "status": "ok",
        "db_connected": db_connected,
        "db_latency_ms": round(latency_ms, 2) if db_connected else -1,
    }
