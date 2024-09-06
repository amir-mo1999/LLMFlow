from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException
from .db import db
from .user import username
from fastapi import Depends
from typing import Annotated
from motor.motor_asyncio import AsyncIOMotorClient
from App.models import AIFunctionWithID, AIFunctionList, PromptWithID


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
) -> AIFunctionWithID:
    if not valid_object_id(ai_function_id):
        raise HTTPException(status_code=400, detail="Invalid Object ID for AI Function")

    ai_function_collection = db["ai-functions"]

    ai_function = await ai_function_collection.find_one(
        {"_id": ObjectId(ai_function_id), "username": username}
    )

    if not ai_function:
        raise HTTPException(
            status_code=404,
            detail=f"AI Function with the id {ai_function_id} was not found",
        )

    ai_function = AIFunctionWithID(**ai_function)

    return ai_function


async def ai_functions(
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: Annotated[str, Depends(username)],
) -> AIFunctionList:
    ai_function_collection = db["ai-functions"]
    ai_functions = ai_function_collection.find({"username": username})
    ai_functions = await ai_functions.to_list(10000000000)
    ai_functions = AIFunctionList(ai_function_list=ai_functions)

    return ai_functions


async def prompt(
    prompt_id: str,
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: Annotated[str, Depends(username)],
) -> PromptWithID:
    if not valid_object_id(prompt_id):
        raise HTTPException(status_code=400, detail="Invalid Object ID for Prompt")

    prompt_collection = db["prompts"]

    prompt = await prompt_collection.find_one(
        {"_id": ObjectId(prompt_id), "username": username}
    )

    if not prompt:
        raise HTTPException(
            status_code=404,
            detail=f"Prompt with the id {prompt_id} was not found",
        )

    prompt = PromptWithID(**prompt)

    return prompt
