import os
from typing import Annotated

import aiohttp
from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound
from App.models import EvaluateInput, EvaluateSummary

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@EVAL_ROUTER.get("/{prompt_id}", response_model=EvaluateSummary)
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
