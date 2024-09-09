from datetime import datetime
from typing import Annotated, Dict, List, Literal, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    NonNegativeInt,
    confloat,
    StringConstraints,
)

from .objectID import PydanticObjectId


class InputVariable(BaseModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]


class TestCase(BaseModel):
    variables: Dict[str, str] = Field(..., alias="vars")
    model_config = ConfigDict(populate_by_name=True)


class OutputAssertion(BaseModel):
    assertion_type: Literal["contains", "contains-sql", ""] = Field(..., alias="type")
    value: Optional[str]
    weight: Annotated[float, confloat(ge=0.05, le=1)] = 1

    model_config = ConfigDict(populate_by_name=True)


class OutputAssertions(BaseModel):
    assertions: List[OutputAssertion] = Field(..., alias="assert")
    model_config = ConfigDict(populate_by_name=True)


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
        example={
            "assertions": [
                {"assertion_type": "contains", "value": "sea", "weight": 0.5}
            ]
        },
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


class AIFunction(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime


class AIFunctionWithID(AIFunction):
    id: PydanticObjectId = Field(alias="_id")


class AIFunctionList(BaseModel):
    ai_function_list: List[AIFunctionWithID]
