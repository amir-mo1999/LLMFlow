from fastapi import HTTPException, Depends, Path
from bson import ObjectId
from bson.errors import InvalidId


def valid_object_id(object_id: str, message: str = None):
    if message is None:
        message = "Invalid object ID format"
    try:
        return ObjectId(object_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail=message)
