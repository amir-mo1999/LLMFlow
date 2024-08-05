from pydantic import BaseModel, confloat
from typing import Optional, Literal

class OutputAssertion(BaseModel):
    type: Literal["contains", "contains-sql", ""]
    value: Optional[str]
    weight: confloat(ge=0.05, le=1)