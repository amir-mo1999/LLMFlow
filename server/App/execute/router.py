from typing import Annotated, Any, Dict, Optional

from aiohttp.client_exceptions import ServerDisconnectedError
from fastapi import APIRouter, Depends, HTTPException, Query

from App.db.routes.ai_function import get_ai_function
from App.db.routes.prompt import get_prompt
from App.dependencies import DB, get_db, user
from App.http_exceptions import DocumentNotFound
from App.models import AIFunctionOutput, Body, PromptTag, Provider, TestCase, User

from .utils import execute_ai_function

EXECUTE_ROUTER = APIRouter(tags=["Execute"])


@EXECUTE_ROUTER.post(
    "/execute/{project_path_name}/{ai_function_path_name}",
    response_model=AIFunctionOutput,
    responses={
        409: {"detail": "document not found"},
        400: {"detail": "No prompts defined for AI Function"},
        422: {
            "detail": "Missmatch between request variables in request body and AI Function variables"
        },
    },
)
async def execute(
    project_path_name: str,
    ai_function_path_name: str,
    body: Body,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
    provider: Optional[Provider] = None,
    prompt_tag: Optional[PromptTag] = Query(
        default="highest score",
        description="Specify by which criteria to select the prompt.",
    ),
    prompt_id: Optional[str | None] = Query(
        default=None,
        description="If specified the prompt with the given id is used. This takes precedence over 'prompt_tag'. If no 'provider' is specified, one is selected based on 'prompt_tag'",
    ),
):
    # get project
    project = await db.get_project_by_path_segment_name(project_path_name, user.email)
    if project is None:
        raise DocumentNotFound

    # get ai function
    ai_function_id = None
    for api_route in project.api_routes:
        if api_route.path_segment_name == ai_function_path_name:
            ai_function_id = api_route.ai_function_id
            break
    if ai_function_id is None:
        raise DocumentNotFound
    ai_function = await get_ai_function(ai_function_id, db, user)

    if provider and provider not in ai_function.providers:
        raise HTTPException(
            status_code=400,
            detail=f"Provider {provider.value} not supported by AI Function {ai_function.name}",
        )

    # create test case with given body and validate
    test_case_dump: Dict[str, Any] = {"vars": body.model_dump(), "assert": []}
    test_case = TestCase(**test_case_dump)  # type ignore
    try:
        ai_function.test_cases = [test_case]
    except ValueError as e:
        raise HTTPException(422, detail=str(e))

    prompt = None

    # get prompt
    if prompt_id:
        prompt = await get_prompt(prompt_id, db, user)
        if provider is None:
            provider = await db.get_provider_by_tag(prompt.id, prompt_tag)

    elif provider:
        prompt = await db.get_prompt_by_tag_and_provider(
            ai_function.id, provider, prompt_tag
        )

    else:
        res = await db.get_prompt_by_tag(ai_function.id, prompt_tag)
        if res:
            prompt, provider = res

    if prompt is None or provider is None:
        raise HTTPException(
            status_code=400,
            detail=f"No prompts defined for AI Function {ai_function.name}",
        )

    if prompt.ai_function_id != ai_function.id:
        raise HTTPException(
            status_code=400,
            detail=f"Prompt {prompt.id} is not defined under the given AI Function",
        )

    # execute
    try:
        result = await execute_ai_function(
            provider, prompt, ai_function.assertions, test_case
        )
    except ServerDisconnectedError:
        raise HTTPException(
            status_code=500,
            detail="promptfoo-server could not process request",
        )
    return result
