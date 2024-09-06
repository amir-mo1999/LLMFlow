from typing import Annotated

from fastapi import APIRouter, Depends, Path

from App.dependencies import ai_function, prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
async def evaluate(
    ai_function: Annotated[str, Depends(ai_function)] = Path(
        ..., alias="ai_function_id"
    ),
    prompt: Annotated[str, Depends(prompt)] = Path(..., alias="prompt_id"),
):
    print(ai_function)
    return ""
