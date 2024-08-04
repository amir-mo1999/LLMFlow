from fastapi import APIRouter
from .user import user_router
from .project import project_router
from .ai_function import ai_function_router
from .file import file_router

db_router = APIRouter(prefix="/db")
db_router.include_router(user_router)
db_router.include_router(project_router)
db_router.include_router(ai_function_router)
db_router.include_router(file_router)
