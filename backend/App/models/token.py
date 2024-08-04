from pydantic import BaseModel


class Token(BaseModel):
    """Token model."""

    access_token: str
    token_type: str


class DecodedToken(Token):
    """Decoded token model."""

    exp: int
    iat: int
    jti: str
    sub: str
