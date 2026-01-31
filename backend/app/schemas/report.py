from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from enum import Enum


class ReportTypeEnum(str, Enum):
    PRESCRIPTION = "prescription"  # 처방전
    MEDICAL_CERTIFICATE = "medical_certificate"  # 진단서
    EXAMINATION_REPORT = "examination_report"  # 검진서


class ExtractedReport(BaseModel):
    report_type: Optional[str] = None  # Detected report type: prescription, medical_certificate, examination_report
    disease_name: Optional[str] = None
    disease_icd_code: Optional[str] = None
    medicine_name: Optional[str] = None
    full_description: Optional[str] = None
    image_url: Optional[str] = None  # URL where the uploaded image is saved


class ReportCreate(BaseModel):
    report_type: ReportTypeEnum = ReportTypeEnum.PRESCRIPTION
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
    report_type: str = "prescription"
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
