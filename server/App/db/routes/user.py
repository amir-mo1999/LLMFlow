from typing import Annotated

from fastapi import APIRouter, Depends

from App.dependencies import DB, decoded_token, get_db
from App.http_exceptions import DuplicateDocument
from App.models import DecodedToken, SuccessResponse, User, UserRootInput
from App.auth.utils import get_password_hash

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
    user: UserRootInput,
    db: Annotated[DB, Depends(get_db)],
    decoded_token: Annotated[DecodedToken, Depends(decoded_token)],
):
    hashed_password = get_password_hash(user.password)

    user = User(**user.model_dump(by_alias=True), hashed_password=hashed_password)

    result = await db.insert(
        user,
        collection="users",
        compare_fields=["email"],
    )

    if result:
        return SuccessResponse

    raise DuplicateDocument
