from typing import Annotated

from fastapi import APIRouter, Depends

from App.dependencies import DB, get_db, user

EXECUTE_ROUTER = APIRouter(tags=["Execute"])


@EXECUTE_ROUTER.post(
    "/execute/{project_id}/{ai_function_id}",
    responses={409: {"detail": "document not found"}},
)
async def execute(
    project_id: str,
    ai_function_id: str,
    db: Annotated[DB, Depends(get_db)],
    user: Annotated[str, Depends(user)],
):
    summary = "gewgew"
    return summary
