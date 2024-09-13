from datetime import datetime
from typing import Annotated, List

from pydantic import EmailStr, Field, NonNegativeInt, StringConstraints, model_validator

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

    @model_validator(mode="after")
    def assert_input_variables_are_unique(self):
        # get variable names of ai function
        variable_names = [var.name for var in self.input_variables]
        variable_names.sort()

        # create a set from the input variable and cast it to a sorted list
        aux = set(variable_names)
        aux = list(aux)
        aux.sort()

        # these are not equal if there are duplicates
        if variable_names != aux:
            raise ValueError("duplicate input variables are not allowed")
        return self

    @model_validator(mode="after")
    def validate_test_cases(self):
        # get variable names
        var_names = [var.name for var in self.input_variables]
        var_names.sort()

        # assert that all test cases contain each input variable
        for i, test in enumerate(self.test_cases):
            keys = list(test.variables.keys())
            keys.sort()
            if var_names != keys:
                raise ValueError(
                    f"Missmatch between Input Variables of AI Function: {var_names} and variables of Test Case {i}: {keys}"
                )

        return self


class AIFunctionNoID(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime


class AIFunction(AIFunctionNoID):
    id: PydanticObjectId = Field(alias="_id")


class AIFunctionList(RootModel):
    ai_functions: List[AIFunction]
