import os
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClient


async def client():
    uri = os.environ.get("MONGO_CON_STRING")
    client = AsyncIOMotorClient(uri)
    try:
        yield client
    finally:
        client.close()


async def db(client: AsyncIOMotorClient = Depends(client)):
    db = client["prompt-broker"]
    return db
