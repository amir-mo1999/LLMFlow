from typing import Annotated
from fastapi import Depends, HTTPException
from App.utils import decode_token
from jose import JWTError
from fastapi.security import OAuth2PasswordBearer

# define oauth2_scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def username(access_token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the username from the token
    username = decoded_token.sub
    return username
