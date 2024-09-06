from typing import Annotated

from fastapi import APIRouter, Depends

from App.dependencies import ai_function, prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
async def evaluate(
    ai_function_id: Annotated[str, Depends(ai_function)],
    prompt_id: Annotated[str, Depends(prompt)],
):
    return ""
