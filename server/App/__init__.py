from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .auth import AUTH_ROUTER
from .db import DB_ROUTER
from .evaluate import EVAL_ROUTER
from .http_exceptions import DocumentNotFound, DuplicateDocument

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
app.include_router(EVAL_ROUTER)
app.include_router(DB_ROUTER)


## add exception handlers
@app.exception_handler(DuplicateDocument)
async def duplicate_doc_exc_handler(request: Request, exc: DuplicateDocument):
    return JSONResponse(
        status_code=409,
        content={"status": 409, "message": "Document already exists"},
    )


@app.exception_handler(DocumentNotFound)
def doc_not_found_exc_handler(request: Request, exc: DocumentNotFound):
    return JSONResponse(
        status_code=404,
        content={"status": 404, "message": "Document does not exist"},
    )


@app.exception_handler(RequestValidationError)
def validation_exc_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"status": 422, "message": exc.body})


@app.exception_handler(HTTPException)
async def unauthorized_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 401:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "status": 401,
                "message": "Not authenticated",
            },
            headers=exc.headers,
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
        headers=exc.headers,
    )
