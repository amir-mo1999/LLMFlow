import os
from typing import Annotated

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, user

from .baml_client.async_client import b
from .baml_client.types import GenTestCases, GenTestCasesParams

GENERATE_ROUTER = APIRouter(prefix="/generate", tags=["Generate"])


PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@GENERATE_ROUTER.post(
    "/test-cases",
    response_model=GenTestCases,
    responses={400: {"detail": "Failed"}},
)
async def generate_test_cases(
    gen_test_cases_params: GenTestCasesParams,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[str, Depends(user)],
):
    res = await b.GenerateTestCases(params=gen_test_cases_params)
    return res
