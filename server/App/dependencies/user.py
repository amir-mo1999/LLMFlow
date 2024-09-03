from typing import Annotated

from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClient

from App.models import DecodedToken, User

from .db import db
from .decoded_token import decoded_token


async def username(decoded_token: Annotated[DecodedToken, Depends(decoded_token)]):
    username = decoded_token.sub
    return username


async def user(
    username: Annotated[str, Depends(username)],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    user_collection = db["users"]
    user_data = await user_collection.find_one({"email": username})
    user_object = User(**user_data)
    return user_object
