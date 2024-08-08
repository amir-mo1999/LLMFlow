# import Python stuff
import os

# import FastAPI stuff
from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import JSONResponse

# import mongo client
from pymongo.mongo_client import MongoClient

# import stuff from other modules
from App.models import (
    User,
    UserRouteInput,
)
from App.utils import get_user

user_router = APIRouter()


# set up mongo client
uri = os.environ.get("MONGO_CON_STRING")
client = MongoClient(uri)
db = client["prompt-broker"]


## User routes
@user_router.post("/user", tags=["Database Operations"])
async def post_user(user: UserRouteInput):
    # get user collection
    user_collection = db["users"]

    # check if user with this email exists; if not insert
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=409, detail="User with this email already exists"
        )
    else:
        user_collection.insert_one(dict(user))

        return JSONResponse(content={"message": "User created"}, status_code=200)


@user_router.get("/user/{email}", response_model=User, tags=["Database Operations"])
async def get_user_route(
    email: str = Path(..., description="Email of the user to retrieve")
):
    user_data = get_user(email)

    if user_data:
        return user_data
    else:
        # If the user doesn't exist, raise an HTTPException with a 404 status code
        raise HTTPException(status_code=404, detail="User not found")
