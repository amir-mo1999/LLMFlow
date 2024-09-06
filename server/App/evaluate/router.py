
from fastapi import APIRouter

# define router object
AUTH_ROUTER = APIRouter(prefix="/evaluate")


@AUTH_ROUTER.get("/")
def evaluate():
    return ""
