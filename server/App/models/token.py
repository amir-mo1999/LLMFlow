from .root_model import RootModel
from .user import User


class Token(RootModel):
    """Token model."""

    access_token: str
    token_type: str


class DecodedToken(RootModel):
    """Decoded token model."""

    user: User
    exp: int | float
    iat: int | float
