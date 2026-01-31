from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExtractedReport(BaseModel):
    disease_name: Optional[str] = None
    disease_icd_code: Optional[str] = None
    medicine_name: Optional[str] = None
    full_description: Optional[str] = None
    image_url: Optional[str] = None  # URL where the uploaded image is saved


class ReportCreate(BaseModel):
    disease_name: Optional[str] = None
    disease_icd_code: Optional[str] = None
    medicine_name: Optional[str] = None
    full_description: Optional[str] = None
    translated_text: Optional[str] = None
    original_language: Optional[str] = None
    target_language: Optional[str] = None
    image_url: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    disease_name: Optional[str] = None
    disease_icd_code: Optional[str] = None
    medicine_name: Optional[str] = None
    full_description: Optional[str] = None
    translated_text: Optional[str] = None
    original_language: Optional[str] = None
    target_language: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TranslateRequest(BaseModel):
    text: str
    target_language: str


class TranslateResponse(BaseModel):
    translated_text: str
    source_language: Optional[str] = None
    target_language: str
