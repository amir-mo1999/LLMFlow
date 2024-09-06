from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, confloat


class OutputAssertion(BaseModel):
    assertion_type: Literal["contains", "contains-sql", ""] = Field(..., alias="type")
    value: Optional[str]
    weight: Annotated[float, confloat(ge=0.05, le=1)] = 1

    model_config = ConfigDict(populate_by_name=True)


class OutputAssertions(BaseModel):
    assertions: List[OutputAssertion] = Field(..., alias="assert")
    model_config = ConfigDict(populate_by_name=True)
