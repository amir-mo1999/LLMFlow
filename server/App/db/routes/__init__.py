from fastapi import APIRouter

from .ai_function import AI_FUNCTION_ROUTER
from .prompt import PROMPT_ROUTER
from .user import USER_ROUTER

tags = ["Database Operations"]
DB_ROUTER = APIRouter(prefix="/db")
DB_ROUTER.include_router(USER_ROUTER, tags=tags)
DB_ROUTER.include_router(AI_FUNCTION_ROUTER, tags=tags)
DB_ROUTER.include_router(PROMPT_ROUTER, tags=tags)
