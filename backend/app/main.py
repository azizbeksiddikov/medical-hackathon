import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from app.services.groq_service import call_groq_vlm
from app.utils.icd_parser import parse_icd_codes

# Load environment variables
load_dotenv()

app = FastAPI(
    title="ASCENT API",
    description="ASCENT Backend API",
    version="0.1.0",
)

# CORS configuration for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/hello")
def hello():
    """Hello endpoint."""
    return {"message": "Hello from ASCENT"}


@app.post("/extract-icd")
async def extract_icd(file: UploadFile = File(...)):
    """
    Extract ICD codes from prescription image.
    
    Args:
        file: Image file (prescription image)
        
    Returns:
        JSON with disease_name, disease_icd_code, medicine_name, full_description
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )
    
    try:
        # Read image file
        image_bytes = await file.read()
        
        # Validate image using Pillow
        try:
            image = Image.open(BytesIO(image_bytes))
            image.verify()  # Verify it's a valid image
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image file: {str(e)}"
            )
        
        # Reopen image after verification (verify() closes it)
        image = Image.open(BytesIO(image_bytes))
        
        # Convert image to base64 data URL
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
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
