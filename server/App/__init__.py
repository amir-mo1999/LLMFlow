from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import AUTH_ROUTER
from .db import db_router

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
app.include_router(AUTH_ROUTER)
app.include_router(db_router)
