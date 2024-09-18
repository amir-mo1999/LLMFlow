from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import AIFunction, Prompt, PromptNoID, PromptRouteInput, SuccessResponse

PROMPT_ROUTER = APIRouter()


@PROMPT_ROUTER.post("/prompt", response_model=SuccessResponse)
async def post_prompt(
    prompt: PromptRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[DB, Depends(get_db)],
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

    # parse ai function for type hints
    ai_function = AIFunction(**ai_function)

    # get time stamp
    now = datetime.now()

    # try parsing prompt, return validation error if fails
    try:
        prompt = PromptNoID.model_validate(
            {**dict(prompt), "creation_time": now, "username": username},
            context=[var.name for var in ai_function.input_variables],
        )
    except ValueError as e:
        raise HTTPException(422, detail=str(e))

    # insert document if no duplicate exists
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
async def get_prompt_route(
    prompt_id: str,
    db: Annotated[DB, Depends(get_db)],
    username: Annotated[str, Depends(username)],
):
    prompt = await db.get_prompt_by_id(prompt_id, username)

    if prompt is None:
        raise DocumentNotFound

    return prompt
