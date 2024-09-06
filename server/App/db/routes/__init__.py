from fastapi import APIRouter

from .ai_function import AI_FUNCTION_ROUTER
from .prompt import PROMPT_ROUTER
from .user import USER_ROUTER

DB_ROUTER = APIRouter(prefix="/db")
DB_ROUTER.include_router(USER_ROUTER)
DB_ROUTER.include_router(AI_FUNCTION_ROUTER)
DB_ROUTER.include_router(PROMPT_ROUTER)
