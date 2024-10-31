from typing import Annotated

from fastapi import Depends

from App.models import DecodedToken, User

from .decoded_token import decoded_token


async def user(
    decoded_token: Annotated[DecodedToken, Depends(decoded_token)],
) -> User:
    return decoded_token.user
