from typing import Annotated

from fastapi import APIRouter, Depends

from App.auth.utils import get_password_hash
from App.dependencies import DB, get_db
from App.http_exceptions import DuplicateDocument
from App.models import SuccessResponse, User, UserRootInput

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
    user_input: UserRootInput,
    db: Annotated[DB, Depends(get_db)],
):
    hashed_password = get_password_hash(user_input.password)

    user = User(**user_input.model_dump(by_alias=True), hashed_password=hashed_password)

    result = await db.insert(
        user,
        collection="users",
        compare_fields=["email"],
    )

    if result:
        return SuccessResponse

    raise DuplicateDocument
