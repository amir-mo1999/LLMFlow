import os
from typing import Annotated, Dict, List

from aiohttp.client_exceptions import ServerDisconnectedError
from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, get_db, user
from App.http_exceptions import DocumentNotFound
from App.models import EvaluateSummary, Provider

from .utils import eval_prompt

GENERATE_ROUTER = APIRouter(prefix="/evaluate", tags=["Generate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@GENERATE_ROUTER.post(
    "/generate-test-cases",
    response_model=List[Dict[str, str]],
    responses={400: {"Failed"}},
)
async def generate_test_cases(
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[str, Depends(user)],
):
    return []