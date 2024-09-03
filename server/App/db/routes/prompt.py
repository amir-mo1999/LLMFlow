from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

from App.dependencies import db, username
from App.models import Prompt, PromptRouteInput

PROMPT_ROUTER = APIRouter()


@PROMPT_ROUTER.post("/prompt", tags=["Database Operations"])
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
