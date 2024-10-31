from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException

from App.dependencies import DB, get_db, user
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import (
    Prompt,
    PromptMessage,
    PromptRouteInput,
    SuccessResponse,
    User,
)

PROMPT_ROUTER = APIRouter()


@PROMPT_ROUTER.post(
    "/prompt",
    response_model=Prompt,
    response_model_exclude_none=True,
    responses={
        401: {"detail": "Not authenticated"},
        400: {"detail": "AI Function does not exist"},
    },
)
async def post_prompt(
    prompt: PromptRouteInput,
    user: Annotated[User, Depends(user)],
    db: Annotated[DB, Depends(get_db)],
):
    # get ai function for prompt
    ai_function = await db.get_ai_function_by_id(prompt.ai_function_id)

    # check if ai function exists
    if ai_function is None:
        raise HTTPException(
            status_code=400,
            detail=f"AI Function {prompt.ai_function_id} does not exist",
        )

    # get time stamp
    now = datetime.now()

    index = await db.get_prompt_max_index(ai_function_id=ai_function.id)

    # try parsing prompt, return validation error if fails
    try:
        prompt = Prompt.model_validate(
            {
                **dict(prompt),
                "creation_time": now,
                "username": user.email,
                "ai_function_name": ai_function.name,
                "index": index,
            },
            context=[var.name for var in ai_function.input_variables],
        )
    except ValueError as e:
        raise HTTPException(422, detail=str(e))

    # insert document if no duplicate exists
    compare_fields = list(
        prompt.model_dump(
            exclude=["creation_time", "last_eval_time", "last_eval"], by_alias=True
        ).keys()
    )

    result = await db.insert(prompt, "prompts", compare_fields=compare_fields)

    if result:
        await db.increment_prompt_count(ai_function_id=ai_function.id)
        return prompt

    raise DuplicateDocument


@PROMPT_ROUTER.get(
    "/prompt/{prompt_id}",
    response_model=Prompt,
    response_model_by_alias=True,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def get_prompt(
    prompt_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    prompt = await db.get_prompt_by_id(prompt_id)

    if prompt is None:
        raise DocumentNotFound

    return prompt


@PROMPT_ROUTER.get(
    "/prompts/{ai_function_id}",
    response_model=List[Prompt],
    response_model_by_alias=True,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def get_prompts(
    ai_function_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    # check if ai function exists
    ai_function = await db.get_ai_function_by_id(ai_function_id)

    if ai_function is None:
        raise DocumentNotFound

    # get all prompts
    prompts = await db.get_prompts_by_ai_function_id(ai_function_id)

    return prompts


@PROMPT_ROUTER.get(
    "/prompts",
    response_model=List[Prompt],
    response_model_by_alias=True,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def get_all_prompts(
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    # get all prompts
    prompts = await db.get_all_prompts(user.email)

    return prompts


@PROMPT_ROUTER.delete(
    "/prompt/{prompt_id}",
    response_model=SuccessResponse,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def delete_prompt(
    prompt_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    # try to get prompt
    prompt = await get_prompt(prompt_id=prompt_id, db=db, user=user)

    res = await db.delete(prompt_id, "prompts")

    if res:
        await db.increment_prompt_count(
            ai_function_id=prompt.ai_function_id, increment_value=-1
        )
        return SuccessResponse
    else:
        raise DocumentNotFound


@PROMPT_ROUTER.patch(
    "/prompt/{prompt_id}",
    response_model=Prompt,
    response_model_exclude_none=True,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def patch_prompt(
    messages: List[PromptMessage],
    prompt_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    prompt = await get_prompt(prompt_id, db, user)

    # patch prompt
    try:
        prompt = await db.update_prompt_messages(prompt, messages)
    except ValueError as e:
        raise HTTPException(422, detail=str(e))

    if prompt:
        return prompt
    else:
        raise DocumentNotFound
