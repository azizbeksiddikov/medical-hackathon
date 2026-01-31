import os
import uuid
from datetime import datetime
from pathlib import Path
from fastapi import UploadFile
from typing import Optional, Tuple

# Base upload directory
UPLOAD_DIR = Path("/app/uploads")
MEMBERS_DIR = UPLOAD_DIR / "members"
REPORTS_DIR = UPLOAD_DIR / "reports"


def ensure_directories():
    """Create upload directories if they don't exist."""
    MEMBERS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)


def generate_filename(original_filename: str, prefix: str = "") -> str:
    """Generate a unique filename with timestamp and UUID."""
    ext = Path(original_filename).suffix.lower() or ".jpg"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    return f"{prefix}{timestamp}_{unique_id}{ext}"


async def save_member_image(file: UploadFile, user_id: str) -> Optional[str]:
    """
    Save a profile image for a member.
    
    Args:
        file: The uploaded file
        user_id: The user's ID
        
    Returns:
        The URL path to access the saved image, or None if failed
    """
    if not file or not file.filename:
        return None
    
    ensure_directories()
    
    # Generate unique filename
    filename = generate_filename(file.filename, f"member_{user_id}_")
    filepath = MEMBERS_DIR / filename
    
    try:
        # Read and save the file
        contents = await file.read()
        with open(filepath, "wb") as f:
            f.write(contents)
        
        # Return the URL path (will be served by FastAPI static files)
        return f"/uploads/members/{filename}"
    except Exception as e:
        print(f"Error saving member image: {e}")
        return None


async def save_report_image(file: UploadFile, user_id: str = "anonymous") -> Tuple[Optional[str], Optional[bytes]]:
    """
    Save a report/prescription image and return both the URL and bytes.
    
    Args:
        file: The uploaded file
        user_id: The user's ID (optional, defaults to anonymous)
        
    Returns:
        Tuple of (URL path to saved image, image bytes) or (None, None) if failed
    """
    if not file or not file.filename:
        return None, None
    
    ensure_directories()
    
    # Generate unique filename
    filename = generate_filename(file.filename, f"report_{user_id}_")
    filepath = REPORTS_DIR / filename
    
    try:
        # Read the file contents
        contents = await file.read()
        
        # Save to disk
        with open(filepath, "wb") as f:
            f.write(contents)
        
        # Return both URL path and bytes (for processing)
        return f"/uploads/reports/{filename}", contents
    except Exception as e:
        print(f"Error saving report image: {e}")
        return None, None


async def save_report_image_from_bytes(image_bytes: bytes, user_id: str, extension: str = ".jpg") -> Optional[str]:
    """
    Save a report/prescription image from bytes.
    
    Args:
        image_bytes: The image data as bytes
        user_id: The user's ID
        extension: File extension (default .jpg)
        
    Returns:
        The URL path to access the saved image, or None if failed
    """
    ensure_directories()
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"report_{user_id}_{timestamp}_{unique_id}{extension}"
    filepath = REPORTS_DIR / filename
    
    try:
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        
        return f"/uploads/reports/{filename}"
    except Exception as e:
        print(f"Error saving report image: {e}")
        return None


def delete_file(url_path: str) -> bool:
    """
    Delete a file by its URL path.
    
    Args:
        url_path: The URL path (e.g., /uploads/profiles/filename.jpg)
        
    Returns:
        True if deleted, False otherwise
    """
    if not url_path or not url_path.startswith("/uploads/"):
        return False
    
    # Convert URL path to file path
    relative_path = url_path.replace("/uploads/", "")
    filepath = UPLOAD_DIR / relative_path
    
    try:
        if filepath.exists():
            filepath.unlink()
            return True
        return False
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False
