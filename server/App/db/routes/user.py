from fastapi import APIRouter, HTTPException, Path, Depends
from fastapi.responses import JSONResponse

# import stuff from other modules
from App.models import (
    User,
    UserRouteInput,
)
from App.dependencies import db

from motor.motor_asyncio import AsyncIOMotorClient

from typing import Annotated

user_router = APIRouter()


## User routes
@user_router.post("/user", tags=["Database Operations"])
async def post_user(
    user: UserRouteInput,
    db: Annotated[AsyncIOMotorClient, Depends(db)],
):
    # get user collection
    user_collection = db["users"]

    # check if user with this email exists; if not insert
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=409, detail="User with this email already exists"
        )
    else:
        await user_collection.insert_one(dict(user))

        return JSONResponse(content={"message": "User created"}, status_code=200)


@user_router.get("/user/{username}", response_model=User, tags=["Database Operations"])
async def get_user_route(
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: str = Path(..., description="Email of the user to retrieve"),
):
    # get user collection
    user_collection = db["users"]

    # Check if the user with the given email exists
    user_data = await user_collection.find_one({"email": username})

    if user_data:
        user = User(**user_data)
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")
