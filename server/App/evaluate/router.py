from typing import Annotated

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from App.db.routes.prompt import get_prompt_route
from App.dependencies import db, username, valid_object_id

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])


@EVAL_ROUTER.get("/{ai_function_id}/{prompt_id}")
async def evaluate(
    db: Annotated[AsyncIOMotorClient, Depends(db)],
    username: Annotated[str, Depends(username)],
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
    prompt = await get_prompt_route(prompt_id, username, db)
    print(prompt)

    return ""
