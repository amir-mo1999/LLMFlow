import uuid
from datetime import datetime
from typing import Annotated, List

from pydantic import EmailStr, Field, StringConstraints

from .root_model import RootModel


class ProjectRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., examples=["My Project"]
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., examples=["This is a project"])
    )
    prompt_ids: List[str] = Field(
        ...,
        examples=[[]],
    )


class Project(ProjectRouteInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: EmailStr
    creation_time: datetime