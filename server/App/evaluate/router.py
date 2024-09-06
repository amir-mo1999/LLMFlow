from typing import Annotated

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from App.dependencies import db, valid_object_id

# from App.db.routes.prompt import get_prompt

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
def evaluate(
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    ai_function_id: Annotated[
        str,
        Depends(
            lambda ai_function_id: valid_object_id(
                ai_function_id, message="Invalid Object ID format for AI Function"
            )
        ),
    ],
    prompt_id: Annotated[
        str,
        Depends(
            lambda prompt_id: valid_object_id(
                prompt_id, message="Invalid Object ID format for Prompt"
            )
        ),
    ],
):
    ai_function_collection = db["ai-functions"]
    prompt_collection = db["prompts"]

    return ""
