from pydantic import BaseModel, EmailStr, StringConstraints, Field
from typing import Annotated, Literal
from .objectID import PydanticObjectId


class UserRouteInput(BaseModel):
    email: EmailStr
    first_name: Annotated[str, StringConstraints(min_length=1)]
    last_name: Annotated[str, StringConstraints(min_length=1)]
    role: Literal["developer", "prompt_engineer", "admin"]
    hashed_password: Annotated[str, Field(exclude=True)]


class User(UserRouteInput):
    id: PydanticObjectId = Field(alias="_id")


class UserWithAccessToken(BaseModel):
    access_token: str
    email: EmailStr
    first_name: Annotated[str, StringConstraints(min_length=1)]
    last_name: Annotated[str, StringConstraints(min_length=1)]
    role: Literal["developer", "prompt_engineer", "admin"]
    id: PydanticObjectId = Field(alias="_id")
