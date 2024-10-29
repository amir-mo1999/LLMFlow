from datetime import datetime
from typing import Annotated, Dict

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import Project, ProjectAIFunction, ProjectRouteInput, SuccessResponse

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
        # check that ai function exists
        db.get_ai_function_by_id(ai_function_id)

        ai_function_mapping[ai_function_id] = ProjectAIFunction(
            prompt_id=proj_ai_function.prompt_id,
            strict_assertions=proj_ai_function.strict_assertions,
        )

    project = Project(
        name=project_input.name,
        description=project_input.description,
        ai_function_mapping=ai_function_mapping,
        creation_time=now,
        username=username,
    )

    result = await db.insert(project, "projects", ["username", "name"])

    if result:
        return project

    raise DuplicateDocument


@PROJECT_ROUTER.get(
    "/project/{project_id}",
    response_model=Project,
    response_model_exclude_none=True,
    response_model_by_alias=True,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def get_project(
    project_id: str,
    db: Annotated[DB, Depends(get_db)],
    username: Annotated[str, Depends(username)],
):
    project = await db.get_project_by_id(project_id)

    if project is None:
        raise DocumentNotFound

    return project


@PROJECT_ROUTER.delete(
    "/project/{project_id}",
    response_model=SuccessResponse,
    responses={
        401: {"detail": "Not authenticated"},
        404: {"detail": "document not found"},
    },
)
async def delete_project(
    project_id: str,
    db: Annotated[DB, Depends(get_db)],
    username: Annotated[str, Depends(username)],
):
    await get_project(project_id=project_id, db=db, username=username)

    res = await db.delete(project_id, "projects")

    if res:
        return SuccessResponse
    else:
        raise DocumentNotFound
