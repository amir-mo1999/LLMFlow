from pydantic import (
    BaseModel,
    StringConstraints,
    Field,
    NonNegativeInt,
    EmailStr,
)
from typing import Annotated, List, Dict
from .objectID import PydanticObjectId
from datetime import datetime
from .output_assertion import OutputAssertion


class InputVariable(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]


class AIFunctionRouteInput(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="Summarize Texts"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="Summarizes english texts to a given number of sentences.")
    )

    input_variables: List[InputVariable]

    output_assertions: List[OutputAssertion]

    dataset: List[Dict[str, str]]


class AIFunction(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime


class AIFunctionWithID(AIFunction):
    id: PydanticObjectId = Field(alias="_id")


class AIFunctionList(BaseModel):
    ai_function_list: List[AIFunctionWithID]
