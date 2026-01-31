import os
from typing import Optional, Dict
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session
from app.models.user import User

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")


def verify_google_token(token: str) -> Optional[Dict]:
    """
    Verify Google ID token and return user information.
    
    Args:
        token: Google ID token from client
        
    Returns:
        Dictionary with user info (sub, email, name, picture) or None if invalid
    """
    try:
        if not GOOGLE_CLIENT_ID:
            print("ERROR: GOOGLE_CLIENT_ID not configured")
            raise ValueError("GOOGLE_CLIENT_ID not configured")
        
        print(f"Verifying token with Client ID: {GOOGLE_CLIENT_ID}")
        print(f"Token length: {len(token)}")
        print(f"Token preview: {token[:50]}...")
        
        # Verify the token with clock skew tolerance (60 seconds)
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60
        )
        
        print(f"Token verified successfully. Issuer: {idinfo.get('iss')}, Email: {idinfo.get('email')}")
        
        # Verify the issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            print(f"ERROR: Wrong issuer. Got: {idinfo['iss']}")
            raise ValueError(f'Wrong issuer: {idinfo["iss"]}')
        
        # Verify the audience (client ID)
        if idinfo.get('aud') != GOOGLE_CLIENT_ID:
            print(f"ERROR: Audience mismatch. Expected: {GOOGLE_CLIENT_ID}, Got: {idinfo.get('aud')}")
            raise ValueError(f'Audience mismatch. Expected: {GOOGLE_CLIENT_ID}, Got: {idinfo.get("aud")}')
        
        return {
            'google_id': idinfo['sub'],
            'email': idinfo.get('email'),
            'name': idinfo.get('name'),
            'picture_url': idinfo.get('picture')
        }
    except ValueError as e:
        # Invalid token - log the full error for debugging
        error_msg = str(e)
        print(f"Token verification error (ValueError): {error_msg}")
        print(f"Using Client ID: {GOOGLE_CLIENT_ID}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return None
    except Exception as e:
        # Unexpected error - log full details
        import traceback
        print(f"Unexpected error verifying token: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        print(f"Traceback: {traceback.format_exc()}")
        return None


def get_user_from_token(token: str) -> Optional[Dict]:
    """
    Extract user information from Google token.
    Alias for verify_google_token for clarity.
    """
    return verify_google_token(token)


def is_local_upload(picture_url: Optional[str]) -> bool:
    """
    Check if the picture URL is a locally uploaded image (not from Google).
    """
    if not picture_url:
        return False
    # Local uploads are stored in /uploads/ path
    return '/uploads/' in picture_url or picture_url.startswith('uploads/')


def create_or_update_user(db: Session, user_info: Dict) -> User:
    """
    Create or update user in database based on Google OAuth info.
    
    Args:
        db: Database session
        user_info: Dictionary with google_id, email, name, picture_url
        
    Returns:
        User object (created or updated)
    """
    google_id = user_info['google_id']
    email = user_info.get('email')
    name = user_info.get('name')
    google_picture_url = user_info.get('picture_url')
    
    # Try to find user by google_id first
    user = db.query(User).filter(User.google_id == google_id).first()
    
    if user:
        # Update existing user
        if email and user.email != email:
            user.email = email
        if name and user.name != name:
            user.name = name
        # Only update picture if user doesn't have a local upload
        # (preserve user-uploaded profile images over Google profile pictures)
        if google_picture_url and not is_local_upload(user.picture_url):
            user.picture_url = google_picture_url
    else:
        # Try to find by email if google_id not found
        if email:
            user = db.query(User).filter(User.email == email).first()
        
        if user:
            # Update existing user with google_id
            user.google_id = google_id
            if name:
                user.name = name
            # Only update picture if user doesn't have a local upload
            if google_picture_url and not is_local_upload(user.picture_url):
                user.picture_url = google_picture_url
        else:
            # Create new user
            user = User(
                google_id=google_id,
                email=email or "",
                name=name,
                picture_url=google_picture_url
            )
            db.add(user)
    
    db.commit()
    db.refresh(user)
    return user

