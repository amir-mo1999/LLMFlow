from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import DB_ROUTER
from .evaluate import EVAL_ROUTER

app = FastAPI(
    title="Backend",
    debug=True,
    openapi_version="3.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add routers to application
app.include_router(EVAL_ROUTER)
app.include_router(DB_ROUTER)
