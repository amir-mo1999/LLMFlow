from typing import Union, Any
import uuid
from datetime import timedelta
from passlib.context import CryptContext
from datetime import datetime
from jose import jwt
import os
from ..models import User, Token, DecodedToken
from .db_utils import get_user
import pytz

# create encryption object to hash passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# get environment mode
mode = os.getenv("MODE")

# set secret key
SECRET_KEY = os.getenv("SECRET_KEY")

# define jwt algorithm
ALGORITHM = "HS256"

# set timezone
tz = pytz.timezone("Europe/Berlin")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies an plain password against a hashed one.

    Args:
        plain_password (str): plain password
        hashed_password (str): hashed password

    Returns:
        bool: True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Get hash of for a given password.

    Args:
        password (str): password

    Returns:
        str: hashed password
    """
    return pwd_context.hash(password)


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
        **jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    )
    return decoded_token


def authenticate_user(username: str, password: str) -> User:
    """Authenticates user by username and password.
    Returns user object if credentials match a user in the database.

    Args:
        username (str): username
        password (str): password

    Returns:
        User: user object
    """
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_jwt_token(data: dict, expires_delta: Union[timedelta, None] = None) -> Token:
    """Creates a jwt access token.

    Args:
        data (dict): data to encode in the token
        expires_delta (Union[timedelta, None], optional): Expiration time of the token. Defaults to None.

    Returns:
        Token: A dictionary containing the access token and token type
    """
    # copy to be encoded data
    to_encode = data.copy()

    # add iat to encoded data (issued at time)
    to_encode.update({"iat": datetime.now(tz)})

    # add expiration time to to the encoded data
    if expires_delta:
        expire = datetime.now(tz) + expires_delta
    else:
        expire = datetime.now(tz) + timedelta(minutes=60)
    to_encode.update({"exp": expire})

    # add jti to encoded data
    to_encode.update({"jti": str(uuid.uuid4())})

    # create jwt token and return it in dictionary representation
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    token = Token(access_token=encoded_jwt, token_type="Bearer")
    return token
