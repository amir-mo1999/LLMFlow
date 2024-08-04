# import Python stuff
import os
from typing import Annotated
from datetime import datetime

# import FastAPI stuff
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse


# import mongo client
from pymongo.mongo_client import MongoClient

# jwt stuff
from jose import JWTError

# import stuff from other modules
from App.models import (
    Project,
    ProjectRouteInput,
    ProjectList,
)

# import from other files
from App.utils import decode_token
from App.auth import oauth2_scheme


# set up mongo client
uri = os.environ.get("MONGO_CON_STRING")
client = MongoClient(uri)
db = client["prompt-broker"]

project_router = APIRouter()


@project_router.post("/project", tags=["Database Operations"])
async def post_project(
    project_input: ProjectRouteInput,
    access_token: Annotated[str, Depends(oauth2_scheme)],
):
    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the username from the token
    username = decoded_token.sub

    # get project collection
    project_collection = db["projects"]

    # get user collection
    user_collection = db["users"]

    # check if username (email) exists in user collection
    if not user_collection.find_one({"email": username}):
        raise HTTPException(
            status_code=400,
            detail=f"User with the E-Mail {username} does not exist",
        )

    # check if a project with this title and user id already exists
    if project_collection.find_one(
        {"title": project_input.title, "username": username}
    ):
        raise HTTPException(
            status_code=409, detail="Project with this title already exists"
        )

    # get time stamp
    now = datetime.now()

    # set the number of functions in the project (at creation this is always zero)
    number_of_functions = 0

    # create the project object
    project = Project(
        **dict(project_input),
        number_of_functions=number_of_functions,
        creation_time=now,
        username=username,
    )

    # insert it to the collection
    project_collection.insert_one(dict(project))

    return JSONResponse(content={"message": "Project created"}, status_code=200)


@project_router.get("/get-all-projects", tags=["Database Operations"])
async def get_all_projects(access_token: Annotated[str, Depends(oauth2_scheme)]):

    # try decoding the token
    try:
        decoded_token = decode_token(access_token)
    except JWTError:
        raise HTTPException(status_code=400, detail="invalid access token")

    # get the username from the token
    username = decoded_token.sub

    # set the project collection
    project_collection = db["projects"]

    # retrieve all projects with the username from the token
    projects = project_collection.find({"username": username})

    # create the project list
    project_list = []
    for project in projects:
        project_list.append(project)
    project_list = ProjectList(project_list=project_list)

    return project_list
