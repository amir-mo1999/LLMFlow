from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, username
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import Project, ProjectRouteInput, SuccessResponse

from .prompt import get_prompt

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
        404: {"detail": "document not found"},
    },
)
async def post_project(
    project_input: ProjectRouteInput,
    username: Annotated[str, Depends(username)],
    db: Annotated[DB, Depends(get_db)],
):
    now = datetime.now()

    # verify that prompts exist
    for prompt_id in project_input.prompt_ids:
        await get_prompt(prompt_id, db, username)

    project = Project(
        **project_input.model_dump(by_alias=True),
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
