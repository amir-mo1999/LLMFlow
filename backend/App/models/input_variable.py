from pydantic import BaseModel, StringConstraints
from typing import Annotated



class InputVariable(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]

