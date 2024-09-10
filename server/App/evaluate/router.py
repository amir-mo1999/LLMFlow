import os
from typing import Annotated

import aiohttp
from fastapi import APIRouter, Depends, Path  #

from App.dependencies import ai_function, prompt
from App.models import AIFunction, EvaluateInput, EvaluateSummary, Prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
async def evaluate(
    ai_function: Annotated[AIFunction, Depends(ai_function)] = Path(
        ..., alias="ai_function_id"
    ),
    prompt: Annotated[Prompt, Depends(prompt)] = Path(..., alias="prompt_id"),
):
    ai_function = ai_function.model_dump(by_alias=True)
    prompt = prompt.model_dump(by_alias=True)

    prompts = [prompt["messages"]]
    defaultTest = ai_function["assertions"]
    tests = ai_function["test_cases"]

    evaluate_input = EvaluateInput(
        prompts=prompts, defaultTest=defaultTest, tests=tests
    )

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
