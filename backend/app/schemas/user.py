from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GoogleAuthRequest(BaseModel):
    token: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    language: Optional[str] = None
    nickname: Optional[str] = None
    phone: Optional[str] = None
    birth_year: Optional[str] = None
    birth_month: Optional[str] = None
    birth_day: Optional[str] = None
    gender: Optional[str] = None
    visit_purpose: Optional[str] = None
    onboarding_completed: bool = False

    class Config:
        from_attributes = True

    @classmethod
    def model_validate(cls, obj):
        return cls(
            id=obj.id,
            email=obj.email,
            name=obj.name,
            picture=obj.picture_url,
            language=obj.language,
            nickname=obj.nickname,
            phone=obj.phone,
            birth_year=obj.birth_year,
            birth_month=obj.birth_month,
            birth_day=obj.birth_day,
            gender=obj.gender,
            visit_purpose=obj.visit_purpose,
            onboarding_completed=obj.onboarding_completed or False,
        )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_new_user: bool = False
    user: UserResponse


class UserUpdate(BaseModel):
    name: Optional[str] = None
    language: Optional[str] = None
    phone: Optional[str] = None
    nickname: Optional[str] = None
    birth_year: Optional[str] = None
    birth_month: Optional[str] = None
    birth_day: Optional[str] = None
    gender: Optional[str] = None
    visit_purpose: Optional[str] = None
