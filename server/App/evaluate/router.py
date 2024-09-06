from fastapi import APIRouter

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
def evaluate():
    return ""
