import uuid
from typing import Annotated, Literal, Optional

from pydantic import EmailStr, Field, StringConstraints

from .root_model import RootModel


class UserRouteInput(RootModel):
    username: EmailStr
    first_name: Annotated[str, StringConstraints(min_length=1)]
    last_name: Annotated[str, StringConstraints(min_length=1)]
    role: Literal["developer", "prompt_engineer", "admin"]
    hashed_password: Annotated[str, Field(exclude=True)]


class User(UserRouteInput):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")

class UserWithAccessToken(RootModel):
    access_token: str
    username: EmailStr
    first_name: Annotated[str, StringConstraints(min_length=1)]
    last_name: Annotated[str, StringConstraints(min_length=1)]
    role: Literal["developer", "prompt_engineer", "admin"]
    id: str = Field(alias="_id")
