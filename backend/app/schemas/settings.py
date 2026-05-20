from pydantic import BaseModel, Field
from typing import Optional

class SettingsBase(BaseModel):
    community_name: str = "Koperasi Mini Syariah"
    logo_url: Optional[str] = None
    primary_color: str = "#007aff"
    footer_text: str = "Powered by Ardyniech"
    landing_headline: str = "Koperasi Mini Syariah"
    landing_description: str = "Sistem transparansi koperasi syariah untuk komunitas kecil."
    landing_features: Optional[str] = None
    social_instagram: Optional[str] = None
    social_linkedin: Optional[str] = None
    social_website: Optional[str] = None
    margin_persen: float = 5.0  # Default margin syariah 5% per tahun

class SettingsUpdate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True
