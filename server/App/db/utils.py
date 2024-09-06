import hashlib

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient


async def get_prompt(prompt_id: str, username: str, db: AsyncIOMotorClient):
    prompt_collection = db["prompts"]

    prompt = await prompt_collection.find_one(
        {"_id": ObjectId(prompt_id), "username": username}
    )

    return prompt


async def get_ai_function(ai_function_id: str, username: str, db: AsyncIOMotorClient):
    ai_function_collection = db["ai-functions"]

    ai_function = await ai_function_collection.find_one(
        {"_id": ObjectId(ai_function_id), "username": username}
    )

    return ai_function


def calculate_file_hash(file_content):
    hash_obj = hashlib.sha256()
    hash_obj.update(file_content)
    return hash_obj.hexdigest()
