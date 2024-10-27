import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound
from App.models import EvaluateSummary

from .utils import eval_prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@EVAL_ROUTER.post(
    "/{prompt_id}",
    response_model=EvaluateSummary,
    responses={409: {"detail": "document not found"}},
)
async def evaluate(
    prompt_id: str,
    db: Annotated[DB, Depends(get_db)],
    username: Annotated[str, Depends(username)],
):
    # get prompt
    prompt = await db.get_prompt_by_id(prompt_id, username)

    if prompt is None:
        raise DocumentNotFound

    # get ai function
    ai_function = await db.get_ai_function_by_id(prompt.ai_function_id, username)

    if ai_function is None:
        raise DocumentNotFound

    try:
        summary = await eval_prompt(prompt, ai_function)
    except ValueError as e:
        raise HTTPException(422, str(e))

    # post EvaluateSummary to prompt
    await db.post_eval(summary, prompt.id)

    return summary
