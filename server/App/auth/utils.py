import os
from datetime import datetime, timedelta
from typing import Any, Union

import pytz
from jose import jwt
from passlib.context import CryptContext

from ..models import User

# create encryption object to hash passwords
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

# set secret key
SECRET_KEY = os.getenv("SECRET_KEY") or ""

# define jwt algorithm
ALGORITHM = "HS256"

# set timezone
TZ = pytz.timezone("Europe/Berlin")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies an plain password against a hashed one.

    Args:
        plain_password (str): plain password
        hashed_password (str): hashed password

    Returns:
        bool: True if passwords match, False otherwise
    """
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Get hash of for a given password.

    Args:
        password (str): password

    Returns:
        str: hashed password
    """
    return PWD_CONTEXT.hash(password)


def create_jwt_token(user: User, expires_delta: Union[timedelta, None] = None) -> str:
    """Creates a jwt access token.

    Args:
        data (dict): data to encode in the token
        expires_delta (Union[timedelta, None], optional): Expiration time of the token. Defaults to None.

    Returns:
        Token: A dictionary containing the access token and token type
    """
    # copy to be encoded data
    to_encode: dict[str, Union[dict[str, Any], float]] = {"user": user.model_dump()}

    to_encode["iat"] = datetime.now(TZ).timestamp()

    # add expiration time to to the encoded data
    if expires_delta:
        expire = datetime.now(TZ) + expires_delta
    else:
        expire = datetime.now(TZ) + timedelta(minutes=60)
    to_encode["exp"] = expire.timestamp()

    # create jwt token and return it in dictionary representation
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
