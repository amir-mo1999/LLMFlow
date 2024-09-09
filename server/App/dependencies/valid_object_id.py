from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException


def valid_object_id(object_id: str, message: str | None = None):
    if message is None:
        message = "Invalid object ID format"
    try:
        return ObjectId(object_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail=message)
