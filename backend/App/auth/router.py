# import python stuff
from typing import Annotated

# import fast api stuff
from fastapi import Depends, HTTPException, status, APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# jwt stuff
from jose import JWTError

# import other modules
from ..utils.auth_utils import *
from ..utils import get_user
from ..models import User, UserWithAccessToken

# define router object
auth_router = APIRouter(prefix="/auth")

# some global variables
access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
HEADERS = headers = {"content-type": "application/json; charset=utf-8"}

# define oauth2_scheme; to protect an endpoint add this parameter "token: Annotated[str, Depends(oauth2_scheme)]"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


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
async def refresh_token(access_token: Annotated[str, Depends(oauth2_scheme)]):
    # try decoding token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get user data
    user = get_user(decoded_token.sub)

    # if token is valid create a new one
    token = create_jwt_token(
        data={"sub": decoded_token.sub}, expires_delta=access_token_expires
    )

    # return user data together with access token
    user_with_access_token = UserWithAccessToken(
        access_token=token.access_token, **user.model_dump(exclude=["id"]), _id=user.id
    )

    return user_with_access_token


@auth_router.get("/get-current-user", response_model=User, tags=["Authentication"])
async def get_current_user(access_token: Annotated[str, Depends(oauth2_scheme)]):
    """Retrieve user data for user that is associated with the passed auth token."""
    # decode the token; return error message if token is invalid
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get username from decoded token
    username = decoded_token.sub

    # get user data from fake user database and return it
    user_data = get_user(username)
    return user_data
