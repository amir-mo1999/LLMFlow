import os
from typing import Annotated, Dict

from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, get_db, user
from App.http_exceptions import DocumentNotFound
from App.models import EvaluateSummary, Provider
from aiohttp.client_exceptions import ServerDisconnectedError

from .utils import eval_prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@EVAL_ROUTER.post(
    "/{prompt_id}",
    response_model=Dict[Provider, EvaluateSummary],
    responses={409: {"detail": "document not found"}},
)
async def evaluate(
    prompt_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[str, Depends(user)],
):
    # get prompt
    prompt = await db.get_prompt_by_id(prompt_id)

    if prompt is None:
        raise DocumentNotFound

    # get ai function
    ai_function = await db.get_ai_function_by_id(prompt.ai_function_id)

    if ai_function is None:
        raise DocumentNotFound

    try:
        evals = await eval_prompt(prompt, ai_function)
    except ValueError as e:
        raise HTTPException(422, str(e))
    except ServerDisconnectedError:
        raise HTTPException(
            500,
            detail="promptfoo-server could not process request",
        )

    # post EvaluateSummary to prompt
    await db.post_eval(evals, prompt.id) # TODO: update

    return evals
