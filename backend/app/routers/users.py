from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import GoogleAuthRequest, TokenResponse, UserResponse, UserUpdate
from app.services.auth_service import verify_google_token, create_or_update_user
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
    """
    import os
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
    
    # Create or update user in database
    user = create_or_update_user(db, user_info)
    
    # Create JWT token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
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

