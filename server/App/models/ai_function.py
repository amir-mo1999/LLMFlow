from datetime import datetime
from typing import Annotated, Dict, List, Literal, Optional

from pydantic import (
    ConfigDict,
    EmailStr,
    Field,
    NonNegativeInt,
    StringConstraints,
    confloat,
)

from .objectID import PydanticObjectId
from .root_model import RootModel


class InputVariable(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]


class TestCase(RootModel):
    variables: Dict[str, str] = Field(..., alias="vars")
    model_config = ConfigDict(populate_by_name=True)


class OutputAssertion(RootModel):
    assertion_type: Literal["contains", "contains-sql", ""] = Field(..., alias="type")
    value: Optional[str]
    weight: Annotated[float, confloat(ge=0.05, le=1)] = 1

    model_config = ConfigDict(populate_by_name=True)


class OutputAssertions(RootModel):
    assertions: List[OutputAssertion] = Field(..., alias="assert")
    model_config = ConfigDict(populate_by_name=True)


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

    output_assertions: OutputAssertions = Field(
        ...,
        example={"assert": [{"type": "contains", "value": "sea", "weight": 0.5}]},
    )

    test_cases: List[TestCase] = Field(
        ...,
        example=[
            {
                "variables": {
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
