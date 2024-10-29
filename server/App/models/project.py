import uuid
from typing import Annotated, Dict, Optional

from pydantic import Field, StringConstraints

from .root_model import RootModel


class ProjectRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="My Project"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="This is a project")
    )
    ai_function_mapping: Dict[str, str]


class Project(ProjectRouteInput):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
