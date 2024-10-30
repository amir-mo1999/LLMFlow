from typing import Annotated

from fastapi import Depends

from App.models import DecodedToken, User

from .db import DB, get_db
from .decoded_token import decoded_token


async def username(
    decoded_token: Annotated[DecodedToken, Depends(decoded_token)],
) -> str:
    username = decoded_token.sub
    return username


async def user(
    username: Annotated[str, Depends(username)],
    db: Annotated[DB, Depends(get_db)],
) -> User | None:
    return await db.get_user(username)
