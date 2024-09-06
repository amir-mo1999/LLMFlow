import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status


# define router object
AUTH_ROUTER = APIRouter(prefix="/evaluate")


@AUTH_ROUTER.get("/")
def evaluate():
    return ""
