from typing import Annotated, Literal, Optional

from pydantic import BaseModel, Field, confloat


class OutputAssertion(BaseModel):
    assertion_type: Literal["contains", "contains-sql", ""] = Field(..., alias="type")
    value: Optional[str]
    weight: Annotated[float, confloat(ge=0.05, le=1)]
