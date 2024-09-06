from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, Field, confloat


class OutputAssertion(BaseModel):
    assertion_type: Literal["contains", "contains-sql", ""] = Field(..., alias="type")
    value: Optional[str]
    weight: Annotated[float, confloat(ge=0.05, le=1)] = 1

    class Config:
        fields = {"assertion_type": "type"}


class OutputAssertions(BaseModel):
    assertions: List[OutputAssertion] = Field(..., alias="assert")

    class Config:
        fields = {"assertions": "assert"}
