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
from App.models import Prompt, PromptRouteInput

# import from other files
from App.utils import decode_token
from App.auth import oauth2_scheme

# set up mongo client
uri = os.environ.get("MONGO_CON_STRING")
client = MongoClient(uri)
db = client["prompt-broker"]


prompt_router = APIRouter()


@prompt_router.post("/prompt", tags=["Database Operations"])
async def post_prompt(
    prompt: PromptRouteInput,
    access_token: Annotated[str, Depends(oauth2_scheme)],
):
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the username from the token
    username = decoded_token.sub

    # get collections
    prompt_collection = db["prompts"]
    user_collection = db["users"]
    ai_function_collection = db["ai-functions"]

    # check if username (email) exists in user collection
    if not user_collection.find_one({"email": username}):
        raise HTTPException(
            status_code=400,
            detail=f"User with the E-Mail {username} does not exist",
        )

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
    if prompt_collection.find_one(prompt.model_dump(exclude="creation_time")):
        raise HTTPException(
            status_code=400,
            detail="The same prompt already exists",
        )

    # insert it to the collection
    prompt_collection.insert_one(prompt.model_dump())

    return JSONResponse(content={"message": "Prompt created"}, status_code=200)
