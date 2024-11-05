from typing import Annotated, Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from App.db.routes.ai_function import get_ai_function
from App.db.routes.prompt import get_prompt
from App.dependencies import DB, get_db, user
from App.http_exceptions import DocumentNotFound
from App.models import AIFunctionOutput, Body, PromptTag, TestCase, User

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
    prompt_tag: Optional[PromptTag] = Query(
        default="highest score",
        description="Specify by which criteria to select the prompt.",
    ),
    prompt_id: Optional[str | None] = Query(
        default=None,
        description="If specified the prompt with the given id is used. This takes precedence over 'prompt_tag'.",
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

    # create test case with given body and validate
    test_case_dump: Dict[str, Any] = {"vars": body.model_dump(), "assert": []}
    test_case = TestCase(**test_case_dump)  # type ignore
    try:
        ai_function.test_cases = [test_case]
    except ValueError as e:
        raise HTTPException(422, detail=str(e))

    # get prompt
    if prompt_id:
        prompt = await get_prompt(prompt_id, db, user)
    else:
        prompt = await db.get_prompt_by_tag(ai_function.id, prompt_tag)

    print(prompt_tag)
    if prompt is None:
        raise HTTPException(
            status_code=400,
            detail=f"No prompts defined for AI Function {ai_function.name}",
        )

    # execute
    result = await execute_ai_function(prompt, ai_function.assertions, test_case)
    return result
