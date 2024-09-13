from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, db, username
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import Prompt, PromptNoID, PromptRouteInput, SuccessResponse

PROMPT_ROUTER = APIRouter()


@PROMPT_ROUTER.post("/prompt", response_model=SuccessResponse)
async def post_prompt(
    prompt: PromptRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[DB, Depends(db)],
):
    # get ai function for prompt
    ai_function_collection = db.get_collection("ai-functions")
    ai_function = await ai_function_collection.find_one(
        {"_id": prompt.ai_function_id, "username": username}
    )

    # check if ai function exists
    if ai_function is None:
        raise HTTPException(
            status_code=400,
            detail=f"AI Function {prompt.ai_function_id} does not exist",
        )

    # get time stamp
    now = datetime.now()

    # construct the prompt object
    prompt = PromptNoID(
        **dict(prompt),
        creation_time=now,
        username=username,
    )

    compare_fields = list(
        prompt.model_dump(exclude="creation_time", by_alias=True).keys()
    )

    result = await db.insert(prompt, "prompts", compare_fields=compare_fields)
    if result:
        return SuccessResponse

    raise DuplicateDocument


@PROMPT_ROUTER.get(
    "/prompt/{prompt_id}",
    response_model=Prompt,
    response_model_by_alias=True,
)
async def get_prompt_route(prompt_id: str, db: Annotated[DB, Depends(db)]):
    prompt = await db.get_prompt_by_id(prompt_id)

    if prompt is None:
        raise DocumentNotFound

    return prompt
