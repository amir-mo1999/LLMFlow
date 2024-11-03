import uuid
from datetime import datetime
from typing import Annotated, List, Optional

from pydantic import EmailStr, Field, StringConstraints

from .root_model import RootModel


class ProjectAPIRoute(RootModel):
    ai_function_id: str
    prompt_id: str
    route_name: str


class ProjectRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., examples=["My Project"]
    )
    route_name: Annotated[str, StringConstraints(min_length=1, max_length=20)]

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., examples=["This is a project"])
    )
    api_routes: List[ProjectAPIRoute]


class ProjectPatchInput(RootModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=40)]] = (
        None
    )
    route_name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=20)]]

    description: Optional[
        Annotated[str, StringConstraints(min_length=1, max_length=1000)]
    ] = None
    api_routes: Optional[ProjectAPIRoute] = None


class Project(ProjectRouteInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: EmailStr
    creation_time: datetime
