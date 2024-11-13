import uuid
from datetime import datetime
from typing import Annotated, List, Optional

from pydantic import EmailStr, Field, StringConstraints

from .root_model import RootModel


class ProjectAPIRoute(RootModel):
    ai_function_id: str
    path_segment_name: str


class ProjectRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=100)] = Field(
        ..., examples=["My Project"]
    )
    path_segment_name: Annotated[str, StringConstraints(min_length=1, max_length=50)]

    description: Annotated[str, StringConstraints(min_length=1, max_length=2500)] = (
        Field(..., examples=["This is a project"])
    )
    api_routes: List[ProjectAPIRoute]


class ProjectPatchInput(RootModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=100)]] = (
        None
    )
    path_segment_name: Optional[
        Annotated[str, StringConstraints(min_length=1, max_length=50)]
    ] = None

    description: Optional[
        Annotated[str, StringConstraints(min_length=1, max_length=2500)]
    ] = None
    api_routes: Optional[List[ProjectAPIRoute]] = None


class Project(ProjectRouteInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: EmailStr
    creation_time: datetime
    api_key: str
