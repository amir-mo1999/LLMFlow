from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

from App.dependencies import ai_function, ai_functions, db, username
from App.models import (
    AIFunctionNoID,
    AIFunctionList,
    AIFunctionRouteInput,
    AIFunction,
)

AI_FUNCTION_ROUTER = APIRouter()


@AI_FUNCTION_ROUTER.post("/ai-function")
async def post_ai_function(
    ai_function_input: AIFunctionRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    # get ai function collection
    ai_function_collection = db["ai-functions"]

    # get user collection
    user_collection = db["users"]

    # check if username (email) exists in user collection
    if not await user_collection.find_one({"email": username}):
        raise HTTPException(
            status_code=400,
            detail=f"User with the E-Mail {username} does not exist",
        )

    # check if a ai function with this name and user id already exists
    if await ai_function_collection.find_one(
        {"name": ai_function_input.name, "username": username}
    ):
        raise HTTPException(
            status_code=409, detail="AI Function with this name already exists"
        )

    # get time stamp
    now = datetime.now()

    # set the number of prompts written for the ai function (at creation this is always zero)
    number_of_prompts = 0

    # create the ai function object
    ai_function = AIFunctionNoID(
        **dict(ai_function_input),
        number_of_prompts=number_of_prompts,
        creation_time=now,
        username=username,
    )

    # insert it to the collection
    await ai_function_collection.insert_one(ai_function.model_dump(by_alias=True))

    return JSONResponse(content={"message": "AI function created"}, status_code=200)


@AI_FUNCTION_ROUTER.get("/ai-function", response_model=AIFunctionList)
async def get_ai_functions(
    ai_functions: Annotated[AIFunctionList, Depends(ai_functions)],
):
    return ai_functions


@AI_FUNCTION_ROUTER.get(
    "/ai-function/{ai_function_id}",
    response_model=AIFunction,
)
async def get_ai_function(
    ai_function: Annotated[str, Depends(ai_function)] = Path(
        ..., alias="ai_function_id"
    ),
):
    return ai_function
