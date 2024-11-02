from typing import Annotated

from fastapi import APIRouter, Depends

from App.db.routes.ai_function import get_ai_function
from App.db.routes.project import get_project
from App.dependencies import DB, get_db, user
from App.models import User

from .utils import generate_project_api_docs

EXECUTE_ROUTER = APIRouter(tags=["Execute"])


@EXECUTE_ROUTER.post(
    "/execute/{project_id}/{ai_function_id}",
    responses={409: {"detail": "document not found"}},
)
async def execute(
    project_id: str,
    ai_function_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[User, Depends(user)],
):
    ai_function = await get_ai_function(ai_function_id, db, user)
    project = await get_project(project_id, db, user)

    docs = generate_project_api_docs(
        project_id, project.name, [(ai_function.name, ai_function.input_variables)]
    )
    return docs
