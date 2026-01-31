from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    google_id = Column(String(255), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    picture_url = Column(String(512), nullable=True)
    
    # Onboarding data
    language = Column(String(10), nullable=True)
    phone = Column(String(50), nullable=True)
    nickname = Column(String(100), nullable=True)
    birth_year = Column(String(4), nullable=True)
    birth_month = Column(String(2), nullable=True)
    birth_day = Column(String(2), nullable=True)
    gender = Column(String(20), nullable=True)
    visit_purpose = Column(String(100), nullable=True)
    
    # Flags
    onboarding_completed = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
