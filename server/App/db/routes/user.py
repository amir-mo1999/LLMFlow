from typing import Annotated

from fastapi import APIRouter, Depends, Path

from App.dependencies import DB, get_db
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import SuccessResponse, User, UserRouteInput

USER_ROUTER = APIRouter()


## User routes
@USER_ROUTER.post(
    "/user",
    response_model=SuccessResponse,
    responses={
        409: {
            "detail": "document already exists",
        },
    },
)
async def post_user(
    user: UserRouteInput,
    db: Annotated[DB, Depends(get_db)],
):
    user = User(**user.model_dump(by_alias=True), hashed_password=user.hashed_password)

    result = await db.insert(
        user,
        collection="users",
        compare_fields=["username"],
        additional_data={"hashed_password": user.hashed_password},
    )

    if result:
        return SuccessResponse

    raise DuplicateDocument


@USER_ROUTER.get(
    "/user/{username}",
    response_model=User,
    responses={404: {"detail": "document not found"}},
)
async def get_user(
    db: Annotated[DB, Depends(get_db)],
    username: str = Path(..., description="Email of the user to retrieve"),
):
    # Check if the user with the given email exists
    user = await db.get_user(username)

    if user:
        return user
    else:
        raise DocumentNotFound
