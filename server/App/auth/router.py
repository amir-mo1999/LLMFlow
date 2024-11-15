import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from App.dependencies import DB, get_db
from App.models import User, UserWithAccessToken

from .utils import create_jwt_token, timedelta, get_password_hash, verify_password

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
    email = form_data.username
    password = form_data.password
    user = await db.get_user(email=email)

    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    token = create_jwt_token(user=user, expires_delta=ACCESS_TOKEN_EXPIRES)

    user_with_token = UserWithAccessToken(
        name=user.name, email=user.email, access_token=token
    )
    return user_with_token
