import os
from typing import Annotated, List

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, user

from .baml_client.async_client import b
from .baml_client.types import GenParams, GenPromptMessage, GenTestCase

GENERATE_ROUTER = APIRouter(prefix="/generate", tags=["Generate"])


PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@GENERATE_ROUTER.post(
    "/test-cases",
    response_model=List[GenTestCase],
    responses={400: {"detail": "Failed"}},
)
async def generate_test_cases(
    params: GenParams,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[str, Depends(user)],
):
    res = await b.GenerateTestCases(params=params)
    return res

@GENERATE_ROUTER.post(
    "/prompt-messages",
    response_model=List[GenPromptMessage],
    responses={400: {"detail": "Failed"}},
)
async def generate_prompt_messages(
    params: GenParams,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[str, Depends(user)],
):
    res = await b.GeneratePromptMessages(params=params)
    return res
