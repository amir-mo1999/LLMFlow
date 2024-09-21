from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import AIFunction, AIFunctionRouteInput, SuccessResponse

AI_FUNCTION_ROUTER = APIRouter()


@AI_FUNCTION_ROUTER.post(
    "/ai-function",
    response_model=SuccessResponse,
    responses={
        401: {"detail": "Not authenticated"},
        409: {"detail": "document already exists"},
    },
)
async def post_ai_function(
    ai_function_input: AIFunctionRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[DB, Depends(get_db)],
):
    # get time stamp
    now = datetime.now()

    # set the number of prompts written for the ai function (at creation this is always zero)
    number_of_prompts = 0

    # create the ai function object
    ai_function = AIFunction(
        **ai_function_input.model_dump(by_alias=True),
        number_of_prompts=number_of_prompts,
        creation_time=now,
        username=username,
    )

    # try posting it
    result = await db.insert(ai_function, "ai-functions", ["username", "name"])

    if result:
        return SuccessResponse()

    raise DuplicateDocument


@AI_FUNCTION_ROUTER.get(
    "/ai-function",
    response_model_by_alias=True,
    response_model=List[AIFunction],
    responses={401: {"detail": "Not authenticated"}},
)
async def get_ai_functions(
    db: Annotated[DB, Depends(get_db)],
    username: Annotated[str, Depends(username)],
):
    ai_functions = await db.get_all_ai_functions(username=username)
    return ai_functions.values()


@AI_FUNCTION_ROUTER.get(
    "/ai-function/{ai_function_id}",
    response_model=AIFunction,
    response_model_by_alias=True,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def get_ai_function(
    ai_function_id: str,
    db: Annotated[DB, Depends(get_db)],
    username: Annotated[str, Depends(username)],
):
    ai_function = await db.get_ai_function_by_id(ai_function_id, username)

    if ai_function is None:
        raise DocumentNotFound

    return ai_function
