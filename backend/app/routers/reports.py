import base64
from io import BytesIO
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from PIL import Image

from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    ExtractedReport,
    TranslateRequest,
    TranslateResponse,
)
from app.services.groq_service import call_groq_vlm
from app.services.file_service import save_report_image, delete_file
from app.utils.icd_parser import parse_icd_codes
from app.middleware.auth_middleware import get_current_user_dependency

router = APIRouter(prefix="/api", tags=["reports"])


@router.post("/extract-icd", response_model=ExtractedReport)
async def extract_icd(file: UploadFile = File(...)):
    """
    Extract ICD codes from prescription image.
    Saves the image first, then processes it.
    
    Args:
        file: Image file (prescription image)
        
    Returns:
        JSON with disease_name, disease_icd_code, medicine_name, full_description, image_url
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )
    
    try:
        # Save image to uploads/reports first and get the bytes
        image_url, image_bytes = await save_report_image(file)
        
        if not image_bytes:
            raise HTTPException(
                status_code=500,
                detail="Failed to save image"
            )
        
        # Validate image using Pillow
        try:
            image = Image.open(BytesIO(image_bytes))
            image.verify()  # Verify it's a valid image
        except Exception as e:
            # Delete the saved file if validation fails
            if image_url:
                delete_file(image_url)
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image file: {str(e)}"
            )
        
        # Reopen image after verification (verify() closes it)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert image to base64 data URL for API
        buffered = BytesIO()
        # Convert to RGB if necessary (for PNG with transparency)
        if image.mode in ('RGBA', 'LA', 'P'):
            rgb_image = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            rgb_image.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = rgb_image
        
        # Determine format
        image_format = image.format or 'JPEG'
        if image_format not in ['JPEG', 'PNG', 'WEBP']:
            image_format = 'JPEG'
        
        image.save(buffered, format=image_format)
        image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Create data URL
        mime_type = f"image/{image_format.lower()}"
        image_data_url = f"data:{mime_type};base64,{image_base64}"
        
        # Call Groq API
        try:
            groq_response = call_groq_vlm(image_data_url)
            if not groq_response:
                raise HTTPException(
                    status_code=500,
                    detail="No response from Groq API"
                )
        except ValueError as e:
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error calling Groq API: {str(e)}"
            )
        
        # Parse ICD codes from response
        result = parse_icd_codes(groq_response)
        
        # Add the image URL to the result
        result["image_url"] = image_url
        
        return ExtractedReport(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """
    Translate text to target language using Groq.
    """
    from app.services.groq_service import translate_with_groq
    
    try:
        translated = translate_with_groq(request.text, request.target_language)
        return TranslateResponse(
            translated_text=translated,
            target_language=request.target_language
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )


@router.get("/reports", response_model=List[ReportResponse])
async def get_reports(
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get all reports for the current user."""
    reports = db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).all()
    return reports


@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Create a new report for the current user."""
    report = Report(
        user_id=current_user.id,
        disease_name=report_data.disease_name,
        disease_icd_code=report_data.disease_icd_code,
        medicine_name=report_data.medicine_name,
        full_description=report_data.full_description,
        translated_text=report_data.translated_text,
        original_language=report_data.original_language,
        target_language=report_data.target_language,
        image_url=report_data.image_url,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/reports/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: str,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Get a specific report by ID."""
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return report


@router.delete("/reports/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: str,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Delete a specific report."""
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    db.delete(report)
    db.commit()
    return None
