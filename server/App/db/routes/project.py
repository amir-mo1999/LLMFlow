from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, user
from App.http_exceptions import DocumentNotFound, DuplicateDocument
from App.models import (
    Project,
    ProjectPatchInput,
    ProjectRouteInput,
    SuccessResponse,
    User,
)

from .ai_function import get_ai_function

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
    user: Annotated[User, Depends(user)],
    db: Annotated[DB, Depends(get_db)],
):
    now = datetime.now()

    # verify that ai functions exist
    for api_route in project_input.api_routes:
        await get_ai_function(api_route.ai_function_id, db, user)

    project = Project(
        **project_input.model_dump(by_alias=True),
        creation_time=now,
        username=user.email,
    )

    result = await db.insert(project, "projects", ["username", "name"])

    if result:
        return project

    raise DuplicateDocument


@PROJECT_ROUTER.get(
    "/project",
    response_model_by_alias=True,
    response_model_exclude_none=True,
    response_model=List[Project],
    responses={401: {"detail": "Not authenticated"}},
)
async def get_projects(
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    projects = await db.get_all_projects(username=user.email)
    return projects.values()


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
    user: Annotated[User, Depends(user)],
) -> Project:
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
    user: Annotated[User, Depends(user)],
):
    await get_project(project_id=project_id, db=db, user=user)

    res = await db.delete(project_id, "projects")

    if res:
        return SuccessResponse
    else:
        raise DocumentNotFound


@PROJECT_ROUTER.patch(
    "/project/{project_id}",
    response_model_exclude_none=True,
    response_model=Project,
    responses={
        401: {"detail": "Not authenticated"},
        409: {"detail": "document already exists"},
    },
)
async def patch_project(
    project_patch: ProjectPatchInput,
    project_id: str,
    user: Annotated[User, Depends(user)],
    db: Annotated[DB, Depends(get_db)],
):
    # verify that project exist
    project = await get_project(project_id=project_id, db=db, user=user)

    project = await db.patch_project(project, project_patch=project_patch)

    if project:
        return project
    else:
        raise DuplicateDocument
