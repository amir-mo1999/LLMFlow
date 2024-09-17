from typing import Annotated, Literal

from pydantic import EmailStr, Field, StringConstraints

from .objectID import PydanticObjectId
from .root_model import RootModel


class UserRouteInput(RootModel):
    username: EmailStr
    first_name: Annotated[str, StringConstraints(min_length=1)]
    last_name: Annotated[str, StringConstraints(min_length=1)]
    role: Literal["developer", "prompt_engineer", "admin"]
    hashed_password: Annotated[str, Field(exclude=True)]


class User(UserRouteInput):
    id: PydanticObjectId = Field(alias="_id")


class UserWithAccessToken(RootModel):
    access_token: str
    username: EmailStr
    first_name: Annotated[str, StringConstraints(min_length=1)]
    last_name: Annotated[str, StringConstraints(min_length=1)]
    role: Literal["developer", "prompt_engineer", "admin"]
    id: PydanticObjectId = Field(alias="_id")
