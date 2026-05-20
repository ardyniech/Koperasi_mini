from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from .base import Base

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    community_name = Column(String(100), default="Koperasi Mini Syariah")
    logo_url = Column(String(255), nullable=True)
    primary_color = Column(String(7), default="#007aff")  # Apple-style default
    footer_text = Column(String(255), default="Powered by Ardyniech")
    landing_headline = Column(String(255), default="Koperasi Mini Syariah")
    landing_description = Column(Text, default="Sistem transparansi koperasi syariah untuk komunitas kecil.")
    landing_features = Column(Text, default="")  # JSON string of features
    social_instagram = Column(String(100), nullable=True)
    social_linkedin = Column(String(100), nullable=True)
    social_website = Column(String(100), nullable=True)
    margin_persen = Column(Float, default=5.0)  # Default margin syariah 5% per tahun
    created_at = Column(Text, default=None)  # Will use ISO format
    updated_at = Column(Text, default=None)

    def __repr__(self):
        return f"<Settings(community_name='{self.community_name}')>"
