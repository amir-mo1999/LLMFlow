from datetime import datetime
from typing import Annotated, List

from pydantic import (
    EmailStr,
    Field,
    NonNegativeInt,
    StringConstraints,
)

from .objectID import PydanticObjectId
from .promptfoo_models import OutputAssertions, TestCase
from .root_model import RootModel


class InputVariable(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]


class AIFunctionRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="Summarize Texts"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="Summarizes english texts to a given number of sentences.")
    )

    input_variables: List[InputVariable] = Field(
        ..., example=[{"name": "text"}, {"name": "number_of_sentences"}]
    )

    assertions: OutputAssertions = Field(
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


class AIFunctionNoID(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime


class AIFunction(AIFunctionNoID):
    id: PydanticObjectId = Field(alias="_id")


class AIFunctionList(RootModel):
    ai_functions: List[AIFunction]
