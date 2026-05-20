from sqlalchemy.orm import Session
from app.models.settings import Settings
from app.schemas.settings import SettingsUpdate
from datetime import datetime

def get_settings(db: Session, settings_id: int = 1):
    """Get settings (default ID = 1)"""
    settings = db.query(Settings).filter(Settings.id == settings_id).first()
    if not settings:
        # Create default settings if not exists
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, settings_id: int, settings_data: SettingsUpdate):
    """Update settings"""
    settings = db.query(Settings).filter(Settings.id == settings_id).first()
    if not settings:
        settings = Settings()
        db.add(settings)
    
    update_data = settings_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    settings.updated_at = datetime.now().isoformat()
    db.commit()
    db.refresh(settings)
    return settings
