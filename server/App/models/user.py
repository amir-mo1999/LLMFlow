import uuid

from pydantic import EmailStr, Field

from .root_model import RootModel


class UserRootInput(RootModel):
    name: str
    email: EmailStr


class User(UserRootInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")


class UserWithAccessToken(User):
    access_token: str
