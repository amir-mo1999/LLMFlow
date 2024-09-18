import os
from typing import Annotated

import aiohttp
from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, db, username
from App.http_exceptions import DocumentNotFound
from App.models import EvaluateInput, EvaluateSummary

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
async def evaluate(
    ai_function_id: str,
    prompt_id: str,
    db: Annotated[DB, Depends(db)],
    username: Annotated[str, Depends(username)],
):
    # get prompt and ai function
    ai_function = await db.get_ai_function_by_id(ai_function_id, username)
    prompt = await db.get_prompt_by_id(prompt_id, username)

    # raise error if not found
    if ai_function is None or prompt is None:
        raise DocumentNotFound

    prompts = [prompt.messages]
    defaultTest = {"assert": ai_function.assertions}
    tests = ai_function.test_cases

    try:
        evaluate_input = EvaluateInput(
            prompts=prompts, defaultTest=defaultTest, tests=tests
        )
    except ValueError as e:
        raise HTTPException(422, str(e))

    dump = evaluate_input.model_dump(by_alias=True)

    async with aiohttp.ClientSession() as session:
        res = await session.post(
            PROMPTFOO_SERVER_URL,
            json=dump,
            headers={"Content-Type": "application/json"},
        )

        data = await res.json()

        summary = EvaluateSummary(
            timestamp=data["timestamp"], results=data["results"], stats=data["stats"]
        )

        return summary
