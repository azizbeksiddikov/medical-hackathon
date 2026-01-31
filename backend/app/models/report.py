from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Extracted medical data
    disease_name = Column(String(255), nullable=True)
    disease_icd_code = Column(String(50), nullable=True)
    medicine_name = Column(String(255), nullable=True)
    full_description = Column(Text, nullable=True)
    
    # Translation data
    translated_text = Column(Text, nullable=True)
    original_language = Column(String(10), nullable=True)
    target_language = Column(String(10), nullable=True)
    
    # Image URL (if stored)
    image_url = Column(String(512), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", backref="reports")
