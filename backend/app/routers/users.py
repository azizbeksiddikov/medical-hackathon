from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.schemas.user import GoogleAuthRequest, TokenResponse, UserResponse, UserUpdate
from app.services.auth_service import verify_google_token, create_or_update_user
from app.services.file_service import save_member_image
from app.utils.jwt_utils import create_access_token
from app.middleware.auth_middleware import get_current_user_dependency

router = APIRouter(prefix="/api", tags=["users"])


@router.post("/auth/google", response_model=TokenResponse)
async def google_login(
    request: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """
    Google OAuth login endpoint.
    Verifies Google ID token and returns JWT access token.
    Returns is_new_user=True if user needs onboarding.
    """
    from app.services.auth_service import GOOGLE_CLIENT_ID
    
    # Log request details for debugging
    print(f"=== Google OAuth Login Request ===")
    print(f"Token received: {len(request.token) if request.token else 0} characters")
    print(f"Backend GOOGLE_CLIENT_ID configured: {bool(GOOGLE_CLIENT_ID)}")
    if GOOGLE_CLIENT_ID:
        print(f"Backend GOOGLE_CLIENT_ID: {GOOGLE_CLIENT_ID[:30]}...")
    
    # Verify Google token
    user_info = verify_google_token(request.token)
    
    if not user_info:
        print("ERROR: Token verification failed - user_info is None")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token. Please check the backend logs for details."
        )
    
    print(f"Token verified successfully for user: {user_info.get('email')}")
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.google_id == user_info['google_id']).first()
    is_new_user = existing_user is None or not existing_user.onboarding_completed
    
    # Create or update user in database
    user = create_or_update_user(db, user_info)
    
    # Create JWT token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        is_new_user=is_new_user,
        user=UserResponse.model_validate(user)
    )


@router.post("/auth/register", response_model=TokenResponse)
async def register_with_onboarding(
    google_token: str = Form(...),
    language: str = Form(...),
    phone: str = Form(...),
    nickname: str = Form(...),
    birth_year: str = Form(...),
    birth_month: str = Form(...),
    birth_day: str = Form(...),
    gender: str = Form(...),
    visit_purpose: str = Form(...),
    profile_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Complete registration with Google auth + onboarding data.
    """
    # Verify Google token
    user_info = verify_google_token(google_token)
    
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    # Create or get user
    user = create_or_update_user(db, user_info)
    
    # Update with onboarding data
    user.language = language
    user.phone = phone
    user.nickname = nickname
    user.birth_year = birth_year
    user.birth_month = birth_month
    user.birth_day = birth_day
    user.gender = gender
    user.visit_purpose = visit_purpose
    user.onboarding_completed = True
    
    # Save profile image if provided
    if profile_image and profile_image.filename:
        image_url = await save_member_image(profile_image, user.id)
        if image_url:
            user.picture_url = image_url
    
    db.commit()
    db.refresh(user)
    
    # Create JWT token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        is_new_user=False,
        user=UserResponse.model_validate(user)
    )


@router.get("/users/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user_dependency)
):
    """Get current authenticated user's profile."""
    return UserResponse.model_validate(current_user)


@router.put("/users/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Update current authenticated user's profile."""
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)


@router.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Delete current authenticated user's account."""
    db.delete(current_user)
    db.commit()
    return None

