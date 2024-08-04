# import Python stuff
import os
from typing import Annotated
from bson import ObjectId

# import FastAPI stuff
from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.responses import JSONResponse

# import mongo client
from pymongo.mongo_client import MongoClient

# jwt stuff
from jose import JWTError

# import from other files
from App.utils import calculate_file_hash, decode_token
from App.auth import oauth2_scheme

# set up mongo client
uri = os.environ.get("MONGO_CON_STRING")
client = MongoClient(uri)
db = client["prompt-broker"]

file_router = APIRouter()


@file_router.post("/upload-file", tags=["Database Operations"])
async def upload_file(
    access_token: Annotated[str, Depends(oauth2_scheme)], file: UploadFile = File(...)
):
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the collection for saving the files
    collection = db["example-data-files"]

    try:
        # Read the file content
        file_content = await file.read()

        # Calculate the hash of the file content
        file_hash = calculate_file_hash(file_content)

        # check if the file already exists in the collection
        # if so just return its object id without creating a new document
        document = collection.find_one(
            {"hash": file_hash, "username": decoded_token.sub}
        )
        if document:
            return JSONResponse(
                content={"object_id": str(document["_id"])}, status_code=200
            )

        # Create a document with the file content, hash, and metadata
        document = {
            "filename": file.filename,
            "username": decoded_token.sub,
            "content_type": file.content_type,
            "content": file_content,
            "file_size": len(file_content),
            "hash": file_hash,
        }

        # Insert the document into the collection
        result = collection.insert_one(document)

        # Return the object ID of the inserted document
        return JSONResponse(
            content={"object_id": str(result.inserted_id)}, status_code=200
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@file_router.get("/get-file-meta-data/{object_id}", tags=["Database Operations"])
async def get_file_meta_data(
    access_token: Annotated[str, Depends(oauth2_scheme)],
    object_id: str,
):
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # check if object id is valid
    if not ObjectId.is_valid(object_id):
        raise HTTPException(status_code=400, detail="invalid object id")

    # get the collection for saving the files
    collection = db["example-data-files"]

    # get the file document
    document = collection.find_one(
        {"_id": ObjectId(object_id)},
        {
            "_id": 0,
            "username": 0,
            "content_type": 0,
            "content": 0,
            "hash": 0,
        },
    )
    if not document:
        raise HTTPException(status_code=404, detail="file not found")

    return JSONResponse(content=document, status_code=200)
