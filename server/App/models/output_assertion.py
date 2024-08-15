from pydantic import BaseModel, confloat, Field
from typing import Optional, Literal, Annotated


class OutputAssertion(BaseModel):
    _type: Literal["contains", "contains-sql", ""] = Field(..., alias="type")
    value: Optional[str]
    weight: Annotated[float, confloat(ge=0.05, le=1)]
