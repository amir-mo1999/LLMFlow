import os
from typing import Annotated

from fastapi import APIRouter, Depends, Path  #

from App.dependencies import ai_function, prompt
from App.models import AIFunctionWithID, PromptWithID

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL")


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
async def evaluate(
    ai_function: Annotated[AIFunctionWithID, Depends(ai_function)] = Path(
        ..., alias="ai_function_id"
    ),
    prompt: Annotated[PromptWithID, Depends(prompt)] = Path(..., alias="prompt_id"),
):
    prompts = [prompt.messages]

    defaultTest = 2

    for output_assertion in ai_function.output_assertions:
        print(output_assertion)

    return ""
