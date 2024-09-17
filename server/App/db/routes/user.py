from typing import Annotated

from fastapi import APIRouter, Depends, Path

from App.dependencies import DB, db
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import (
    SuccessResponse,
    User,
    UserRouteInput,
)

USER_ROUTER = APIRouter()


## User routes
@USER_ROUTER.post("/user", response_model=SuccessResponse)
async def post_user(
    user: UserRouteInput,
    db: Annotated[DB, Depends(db)],
):
    result = await db.insert(
        user,
        collection="users",
        compare_fields=["email"],
        additional_data={"hashed_password": user.hashed_password},
    )

    if result:
        return SuccessResponse

    raise DuplicateDocument


@USER_ROUTER.get("/user/{username}", response_model=User)
async def get_user_route(
    db: Annotated[DB, Depends(db)],
    username: str = Path(..., description="Email of the user to retrieve"),
):
    # get user collection
    user_collection = db.get_collection("users")

    # Check if the user with the given email exists
    user_data = await user_collection.find_one({"email": username})

    if user_data:
        user = User(**user_data)
        return user
    else:
        raise DocumentNotFound
