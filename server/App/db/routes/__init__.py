from fastapi import APIRouter

from .ai_function import AI_FUNCTION_ROUTER
from .project import PROJECT_ROUTER
from .prompt import PROMPT_ROUTER
from .user import USER_ROUTER

DB_ROUTER = APIRouter()
DB_ROUTER.include_router(USER_ROUTER, tags=["User"])
DB_ROUTER.include_router(AI_FUNCTION_ROUTER, tags=["AI Function"])
DB_ROUTER.include_router(PROMPT_ROUTER, tags=["Prompt"])
DB_ROUTER.include_router(PROJECT_ROUTER, tags=["Project"])
