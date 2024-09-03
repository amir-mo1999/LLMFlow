from fastapi import APIRouter

from .ai_function import AI_FUNCTION_ROUTER
from .prompt import PROMPT_ROUTER
from .user import user_router

db_router = APIRouter(prefix="/db")
db_router.include_router(user_router)
db_router.include_router(AI_FUNCTION_ROUTER)
db_router.include_router(PROMPT_ROUTER)
