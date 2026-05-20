from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import admin_required
from app.db.session import get_db
from app.schemas.settings import SettingsResponse, SettingsUpdate
from app.services.settings import get_settings, update_settings
import os
import subprocess
from app.core.logger import logger

router = APIRouter(tags=["settings"])

@router.get("/", response_model=SettingsResponse)
def read_settings(db: Session = Depends(get_db)):
    """Get public settings (for landing page)"""
    logger.info("[Settings] Read: public settings")
    try:
        return get_settings(db)
    except Exception as e:
        logger.error(f"[Settings] Read failed: {str(e)}")
        raise

@router.get("/admin", response_model=SettingsResponse)
def read_settings_admin(
    db: Session = Depends(get_db),
    _admin=Depends(admin_required)
):
    """Get settings (admin only)"""
    logger.info("[Settings] ReadAdmin: Started")
    try:
        result = get_settings(db)
        logger.info("[Settings] ReadAdmin: success")
        return result
    except Exception as e:
        logger.error(f"[Settings] ReadAdmin failed: {str(e)}")
        raise

@router.put("/admin", response_model=SettingsResponse)
def update_settings_admin(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(admin_required)
):
    """Update settings (admin only)"""
    logger.info("[Settings] UpdateAdmin: Started")
    try:
        result = update_settings(db, 1, settings_data)
        logger.info("[Settings] UpdateAdmin: success")
        return result
    except Exception as e:
        logger.error(f"[Settings] UpdateAdmin failed: {str(e)}")
        raise

@router.post("/admin/reset-db")
def reset_database(
    db: Session = Depends(get_db),
    _admin=Depends(admin_required)
):
    """Reset database: delete SQLite file and recreate with alembic"""
    logger.info("[Settings] ResetDB: Started")
    try:
        # Get SQLite file path from database URL
        db_url = str(db.bind.url)
        if db_url.startswith("sqlite:///"):
            db_path = db_url.replace("sqlite:///", "")
            
            # Close all connections
            db.close()
            
            # Delete SQLite file if exists
            if os.path.exists(db_path):
                os.remove(db_path)
                logger.info(f"[Settings] ResetDB: Deleted database: {db_path}")
            
            # Run alembic upgrade head to recreate schema
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")),
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.info("[Settings] ResetDB: success")
                return {"status": "success", "message": "Database reset successfully"}
            else:
                logger.error(f"[Settings] ResetDB failed: {result.stderr}")
                return {"status": "error", "message": result.stderr}
        
        logger.warning("[Settings] ResetDB: Not a SQLite database")
        return {"status": "error", "message": "Not a SQLite database"}
    except Exception as e:
        logger.error(f"[Settings] ResetDB failed: {str(e)}")
        raise
