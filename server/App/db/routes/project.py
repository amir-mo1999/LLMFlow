from datetime import datetime
from typing import Annotated, List, Dict

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import (
    Project,
    ProjectRouteInput,
    ProjectAIFunction,
    SuccessResponse,
)

PROJECT_ROUTER = APIRouter()


class DuplicateDocumentExc(Exception):
    def __init__(self, name: str):
        self.name = name


@PROJECT_ROUTER.post(
    "/project",
    response_model=Project,
    response_model_exclude_none=True,
    responses={
        401: {"detail": "Not authenticated"},
        409: {"detail": "document already exists"},
    },
)
async def post_project(
    project_input: ProjectRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[DB, Depends(get_db)],
):
    now = datetime.now()

    # construct ai function mapping
    ai_function_mapping: Dict[str, ProjectAIFunction] = {}
    for ai_function_id, proj_ai_function in project_input.ai_function_mapping.items():
        ai_function_mapping[ai_function_id] = ProjectAIFunction(
            prompt_id=proj_ai_function.prompt_id,
            strict_assertions=proj_ai_function.strict_assertions,
        )

    # create the ai function object
    project = Project(
        name=project_input.name,
        description=project_input.description,
        ai_function_mapping=ai_function_mapping,
        creation_time=now,
        username=username,
    )

    # try posting it
    result = await db.insert(project, "projects", ["username", "name"])

    if result:
        return project

    raise DuplicateDocument
