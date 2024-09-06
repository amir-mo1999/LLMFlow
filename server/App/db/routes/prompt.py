from datetime import datetime
from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

from App.dependencies import db, username, valid_object_id
from App.models import Prompt, PromptRouteInput, PromptWithID

PROMPT_ROUTER = APIRouter()


@PROMPT_ROUTER.post("/prompt")
async def post_prompt(
    prompt: PromptRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    # get collections
    prompt_collection = db["prompts"]
    ai_function_collection = db["ai-functions"]

    # check if ai function exists
    if not ai_function_collection.find_one(
        {"_id": prompt.ai_function_id, "username": username}
    ):
        raise HTTPException(
            status_code=400,
            detail=f"AI Function {prompt.ai_function_id} does not exist",
        )

    # get time stamp
    now = datetime.now()

    # construct the prompt object
    prompt = Prompt(
        **dict(prompt),
        creation_time=now,
        username=username,
    )

    # check if the same prompt already exists
    if await prompt_collection.find_one(prompt.model_dump(exclude="creation_time")):
        raise HTTPException(
            status_code=400,
            detail="The same prompt already exists",
        )

    # insert it to the collection
    prompt_collection.insert_one(prompt.model_dump())

    return JSONResponse(content={"message": "Prompt created"}, status_code=200)


@PROMPT_ROUTER.get("/prompt/{prompt_id}")
async def get_prompt(
    prompt_id: Annotated[str, Depends(lambda prompt_id: valid_object_id(prompt_id))],
    username: Annotated[str, Depends(username)],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    # get collections
    prompt_collection = db["prompts"]
    ai_function_collection = db["ai-functions"]

    # get prompt
    prompt = await prompt_collection.find_one(
        {"_id": ObjectId(prompt_id), "username": username}
    )

    # check if prompt exists
    if not prompt:
        raise HTTPException(
            status_code=400,
            detail=f"Prompt {prompt_collection} does not exist",
        )

    # construct the prompt object
    prompt = PromptWithID(
        **dict(prompt),
    )

    # get ai function
    ai_function = await ai_function_collection.find_one(
        {"_id": prompt.ai_function_id, "username": username}
    )

    # check if ai function exists
    if not ai_function:
        raise HTTPException(
            status_code=400,
            detail=f"AI Function {prompt.ai_function_id} does not exist",
        )

    return prompt
