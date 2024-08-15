# import python stuff
from typing import Annotated
import os

# import fast api stuff
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

# import other modules
from .utils import create_jwt_token, timedelta, verify_password
from App.models import UserWithAccessToken, User
from App.dependencies import user, db

from motor.motor_asyncio import AsyncIOMotorClient

# define router object
AUTH_ROUTER = APIRouter(prefix="/auth")

# some global variables
ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))


@AUTH_ROUTER.post("/login", response_model=UserWithAccessToken, tags=["Authentication"])
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    """
    Endpoint for the login procedure. Takes username and password as form-data input.
    If credentials match a user in the database return user data and access token else return 401.
    """
    e = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # get user document
    user_collection = db["users"]
    user = await user_collection.find_one({"email": form_data.username})

    # return exception if user was not found
    if not user:
        raise e

    # parse user as user object
    user = User(**user)

    # return exception if password is not correct
    if not verify_password(form_data.password, user.hashed_password):
        raise e

    # if user was found create jwt
    token = create_jwt_token(
        data={"sub": form_data.username}, expires_delta=ACCESS_TOKEN_EXPIRES
    )

    # return user data together with access token
    user_with_access_token = UserWithAccessToken(
        access_token=token.access_token, **user.model_dump(exclude=["id"]), _id=user.id
    )

    return user_with_access_token


@AUTH_ROUTER.get(
    "/refresh-token", response_model=UserWithAccessToken, tags=["Authentication"]
)
async def refresh_token(user: Annotated[User, Depends(user)]):
    # if token is valid create a new one
    token = create_jwt_token(
        data={"sub": user.email}, expires_delta=ACCESS_TOKEN_EXPIRES
    )

    # return user data together with access token
    user_with_access_token = UserWithAccessToken(
        access_token=token.access_token, **user.model_dump(exclude=["id"]), _id=user.id
    )

    return user_with_access_token
