import os
from typing import Annotated

from fastapi import APIRouter, Depends, Path  #

from App.dependencies import ai_function, prompt
from App.models import AIFunction, EvaluateInput, Prompt

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
    defaultTest = ai_function["output_assertions"]
    tests = ai_function["test_cases"]

    evaluate_input = EvaluateInput(
        prompts=prompts, defaultTest=defaultTest, tests=tests
    )

    return evaluate_input
