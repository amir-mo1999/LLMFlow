from datetime import datetime
from typing import Annotated, Dict, List

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    NonNegativeInt,
    StringConstraints,
)

from .objectID import PydanticObjectId
from .output_assertion import OutputAssertions


class InputVariable(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]


class TestCase(BaseModel):
    _vars: Dict[str, str]

    class Config:
        fields = {"_vars": "vars"}


class AIFunctionRouteInput(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="Summarize Texts"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="Summarizes english texts to a given number of sentences.")
    )

    input_variables: List[InputVariable] = Field(
        ..., example=[{"name": "text"}, {"name": "number_of_sentences"}]
    )

    output_assertions: OutputAssertions = Field(
        ...,
        example={"assert": [{"type": "contains", "value": "sea", "weight": 0.5}]},
    )

    test_cases: List[TestCase] = Field(
        ...,
        example=[
            {
                "vars": {
                    "text": "The sea is blue and full of fish. It is the home to many species. It spans over more than two thirds of the world",
                    "number_of_sentences": "1",
                }
            }
        ],
    )


class AIFunction(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime


class AIFunctionWithID(AIFunction):
    id: PydanticObjectId = Field(alias="_id")


class AIFunctionList(BaseModel):
    ai_function_list: List[AIFunctionWithID]
