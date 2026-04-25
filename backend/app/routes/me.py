"""Current user route."""

from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.models import User
from app.schemas.user import UserResponse


router = APIRouter(prefix="/me", tags=["me"])


@router.get("", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return user
