from typing import Annotated

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient

from App.models import AIFunction, AIFunctionList, Prompt

from .db import db
from .user import username

INVALID_OBJECT_ID = HTTPException(status_code=400, detail="invalid object id")
DOCUMENT_NOT_FOUND = HTTPException(status_code=404, detail="document not found")


def valid_object_id(object_id: str):
    try:
        ObjectId(object_id)
        return True
    except (InvalidId, TypeError):
        return False


async def ai_function(
    ai_function_id: str,
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: Annotated[str, Depends(username)],
) -> AIFunction:
    if not valid_object_id(ai_function_id):
        raise INVALID_OBJECT_ID

    ai_function_collection = db["ai-functions"]

    ai_function = await ai_function_collection.find_one(
        {"_id": ObjectId(ai_function_id), "username": username}
    )

    if not ai_function:
        raise DOCUMENT_NOT_FOUND

    ai_function = AIFunction(**ai_function)

    return ai_function


async def ai_functions(
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: Annotated[str, Depends(username)],
) -> AIFunctionList:
    ai_function_collection = db["ai-functions"]
    ai_functions = ai_function_collection.find({"username": username})
    ai_functions = await ai_functions.to_list(10000000000)
    ai_functions = AIFunctionList(ai_functions=ai_functions)

    return ai_functions


async def prompt(
    prompt_id: str,
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: Annotated[str, Depends(username)],
) -> Prompt:
    if not valid_object_id(prompt_id):
        raise INVALID_OBJECT_ID

    prompt_collection = db["prompts"]

    prompt = await prompt_collection.find_one(
        {"_id": ObjectId(prompt_id), "username": username}
    )

    if not prompt:
        raise DOCUMENT_NOT_FOUND

    prompt = Prompt(**prompt)

    return prompt
