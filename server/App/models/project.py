import uuid
from datetime import datetime
from typing import Annotated, Dict, List, Optional

from pydantic import EmailStr, Field, StringConstraints

from .ai_function import Assertion
from .root_model import RootModel


class ProjectAIFunction(RootModel):
    prompt_id: str
    n_called: int = Field(default=0)
    n_valid_results: int = Field(default=0)
    n_invalid_results: int = Field(default=0)
    total_cost: int = Field(default=0)
    strict_assertions: List[Assertion]


class ProjectAIFunctionRouteInput(RootModel):
    prompt_id: str
    strict_assertions: List[Assertion]


class ProjectRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="My Project"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="This is a project")
    )
    ai_function_mapping: Dict[str, ProjectAIFunctionRouteInput]


class Project(ProjectRouteInput):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="My Project"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="This is a project")
    )
    ai_function_mapping: Dict[str, ProjectAIFunction]
    username: EmailStr
    creation_time: datetime
