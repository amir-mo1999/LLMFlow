import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from App.dependencies import DB, get_db
from App.models import User, UserWithAccessToken

from .utils import create_jwt_token, timedelta

# define router object
AUTH_ROUTER = APIRouter(prefix="/auth")

# some global variables
ACCESS_TOKEN_EXPIRES = timedelta(
    minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or "60")
)


@AUTH_ROUTER.post(
    "/login",
    response_model=UserWithAccessToken,
    tags=["Authentication"],
    responses={401: {"detail": "Incorrect username or password"}},
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[DB, Depends(get_db)],
):
    if form_data.username == os.getenv(
        "ADMIN_USER"
    ) and form_data.password == os.getenv("ADMIN_PASSWORD"):
        user = User(name="admin", email="admin@admin.com")
        token = create_jwt_token(user=user, expires_delta=ACCESS_TOKEN_EXPIRES)
        user_with_token = UserWithAccessToken(
            name="admin", email="admin@admin.com", access_token=token
        )
        return user_with_token

    else:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
