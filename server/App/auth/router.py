# import python stuff
from typing import Annotated
import os

# import fast api stuff
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm

# import other modules
from App.utils import get_user, create_jwt_token, timedelta, authenticate_user
from App.models import UserWithAccessToken
from App.dependencies import username

# define router object
auth_router = APIRouter(prefix="/auth")

# some global variables
access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
HEADERS = headers = {"content-type": "application/json; charset=utf-8"}


@auth_router.post("/login", response_model=UserWithAccessToken, tags=["Authentication"])
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    Endpoint for the login procedure. Takes username and password as form-data input.
    If credentials match a user in the database return user data and access token else return 401.
    """

    # try to authenticate user
    user = authenticate_user(form_data.username, form_data.password)

    # if user was not found raise 401 exception
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # if user was found create a jwt
    token = create_jwt_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )

    # return user data together with access token
    user_with_access_token = UserWithAccessToken(
        access_token=token.access_token, **user.model_dump(exclude=["id"]), _id=user.id
    )

    return user_with_access_token


@auth_router.get(
    "/refresh-token", response_model=UserWithAccessToken, tags=["Authentication"]
)
async def refresh_token(username: Annotated[str, Depends(username)]):
    # get user data
    user = get_user(username)

    # if token is valid create a new one
    token = create_jwt_token(data={"sub": username}, expires_delta=access_token_expires)

    # return user data together with access token
    user_with_access_token = UserWithAccessToken(
        access_token=token.access_token, **user.model_dump(exclude=["id"]), _id=user.id
    )

    return user_with_access_token
