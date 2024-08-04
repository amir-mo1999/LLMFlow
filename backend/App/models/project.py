from pydantic import (
    BaseModel,
    StringConstraints,
    Field,
    NonNegativeInt,
    EmailStr,
)
from typing import Annotated, List
from .objectID import PydanticObjectId
from datetime import datetime


class ProjectRouteInput(BaseModel):
    title: Annotated[str, StringConstraints(min_length=1, max_length=30)]
    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)]


class Project(ProjectRouteInput):
    number_of_functions: NonNegativeInt
    creation_time: datetime
    username: EmailStr


class ProjectWithID(Project):
    id: PydanticObjectId = Field(alias="_id")


class ProjectList(BaseModel):
    project_list: List[ProjectWithID]
