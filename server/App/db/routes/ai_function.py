from typing import Annotated
from datetime import datetime
from bson import ObjectId

# import FastAPI stuff
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse


# import stuff from other modules
from App.models import (
    AIFunction,
    AIFunctionRouteInput,
    AIFunctionList,
    AIFunctionWithID,
)

# import from other files
from App.dependencies import username, db

from motor.motor_asyncio import AsyncIOMotorClient

AI_FUNCTION_ROUTER = APIRouter()


@AI_FUNCTION_ROUTER.post("/ai-function", tags=["Database Operations"])
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
    ai_function = AIFunction(
        **dict(ai_function_input),
        number_of_prompts=number_of_prompts,
        creation_time=now,
        username=username,
    )

    # insert it to the collection
    await ai_function_collection.insert_one(ai_function.model_dump(by_alias=True))

    return JSONResponse(content={"message": "AI function created"}, status_code=200)


@AI_FUNCTION_ROUTER.get(
    "/ai-function", tags=["Database Operations"], response_model=AIFunctionList
)
async def get_ai_functions(
    username: Annotated[str, Depends(username)],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    # get ai function collection
    ai_function_collection = db["ai-functions"]

    # get all ai functions for user
    ai_functions = ai_function_collection.find({"username": username})
    ai_functions = await ai_functions.to_list(10000000000)
    ai_functions = AIFunctionList(ai_function_list=ai_functions)

    return ai_functions


@AI_FUNCTION_ROUTER.get(
    "/ai-function/{ai_function_id}",
    tags=["Database Operations"],
    response_model=AIFunctionWithID,
)
async def get_ai_function(
    ai_function_id: str,
    username: Annotated[str, Depends(username)],
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    # get ai function collection
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
