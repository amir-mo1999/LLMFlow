import uuid

from pydantic import EmailStr, Field

from .root_model import RootModel


class UserRootInput(RootModel):
    name: str
    email: EmailStr
    password: str


class User(RootModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    email: EmailStr
    hashed_password: str

class UserWithAccessToken(RootModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    email: EmailStr
    access_token: str
