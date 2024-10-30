import os
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from App.models import DecodedToken

# define oauth2_scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# set secret key
SECRET_KEY = os.getenv("SECRET_KEY") or ""

# define jwt algorithm
ALGORITHM = "HS256"


def decode_token(access_token: str) -> DecodedToken:
    """Decode a jwt token.

    Args:
        token (str): jwt token

    Returns:
        DecodedToken: the decoded jwt token.
    """
    decoded_token = DecodedToken(
        access_token=access_token,
        token_type="Bearer",
        **jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM]),
    )
    return decoded_token


async def decoded_token(
    access_token: Annotated[str, Depends(oauth2_scheme)],
) -> DecodedToken:
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    return decoded_token
