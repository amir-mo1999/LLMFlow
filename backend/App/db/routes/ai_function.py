# import Python stuff
import os
from typing import Annotated
from datetime import datetime

# import FastAPI stuff
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse


# import mongo client
from pymongo.mongo_client import MongoClient

# jwt stuff
from jose import JWTError

# import stuff from other modules
from App.models import (
    AIFunction,
    AIFunctionRouteInput,
    AIFunctionList,
)

# import from other files
from App.utils import decode_token
from App.auth import oauth2_scheme

# set up mongo client
uri = os.environ.get("MONGO_CON_STRING")
client = MongoClient(uri)
db = client["prompt-broker"]


ai_function_router = APIRouter()


@ai_function_router.post("/ai-function", tags=["Database Operations"])
async def post_ai_function(
    ai_function_input: AIFunctionRouteInput,
    access_token: Annotated[str, Depends(oauth2_scheme)],
):
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the username from the token
    username = decoded_token.sub

    # get ai function collection
    ai_function_collection = db["ai-functions"]

    # get user collection
    user_collection = db["users"]

    # check if username (email) exists in user collection
    if not user_collection.find_one({"email": username}):
        raise HTTPException(
            status_code=400,
            detail=f"User with the E-Mail {username} does not exist",
        )

    # check if a ai function with this name and user id already exists
    if ai_function_collection.find_one(
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
    ai_function_collection.insert_one(ai_function.model_dump())

    return JSONResponse(content={"message": "AI function created"}, status_code=200)


@ai_function_router.get(
    "/ai-function", tags=["Database Operations"], response_model=AIFunctionList
)
async def get_ai_functions(
    access_token: Annotated[str, Depends(oauth2_scheme)],
):
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the username from the token
    username = decoded_token.sub

    # get ai function collection
    ai_function_collection = db["ai-functions"]

    # get all ai functions for user
    ai_functions = ai_function_collection.find({"username": username})
    ai_functions = list(ai_functions)
    ai_functions = AIFunctionList(ai_function_list=ai_functions)

    return ai_functions
