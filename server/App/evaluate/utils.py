import os

import aiohttp
from fastapi import APIRouter

from App.models import AIFunction, EvaluateInput, EvaluateSummary, Prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")

async def eval_prompt(prompt: Prompt, ai_function: AIFunction) -> EvaluateSummary:
    # extract needed data
    prompts = [prompt.messages]
    defaultTest = {"assert": ai_function.assertions}
    tests = ai_function.test_cases

    # parse as EvaluateInpiut for validation
    evaluate_input = EvaluateInput(
        prompts=prompts, defaultTest=defaultTest, tests=tests
    )

    # send request to promptfoo-server
    dump = evaluate_input.model_dump(by_alias=True)
    async with aiohttp.ClientSession() as session:
        res = await session.post(
            PROMPTFOO_SERVER_URL,
            json=dump,
            headers={"Content-Type": "application/json"},
        )

        # create EvaluateSummary
        data = await res.json()
        summary = EvaluateSummary(
            timestamp=data["timestamp"], results=data["results"], stats=data["stats"]
        )

        return summary
