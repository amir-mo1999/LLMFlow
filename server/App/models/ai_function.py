import uuid
from datetime import datetime
from typing import Annotated, Any, Dict, List, Optional, Set

from pydantic import EmailStr, Field, NonNegativeInt, StringConstraints, model_validator

from .json_schema import JsonSchema
from .prompt import PromptMessage
from .promptfoo_models import Assertion, TestCase, Provider
from .root_model import RootModel


class InputVariable(RootModel):
    name: Annotated[
        str, StringConstraints(min_length=1, max_length=40, pattern=r"^[^\s]+$")
    ]


class AIFunctionRouteInput(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., examples=["Summarize Texts"]
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(
            ..., examples=["Summarizes english texts to a given number_of_sentences."]
        )
    )

    providers: List[Provider] = Field(
        ..., examples=[["openai:gpt-4o-mini", "openai:gpt-4"]]
    )

    input_variables: List[InputVariable] = Field(
        ..., examples=[[{"name": "text"}, {"name": "number_of_sentences"}]]
    )

    output_schema: JsonSchema = Field(..., examples=[{"type": "string"}])

    assertions: List[Assertion] = Field(
        ...,
        examples=[
            [
                {"type": "icontains", "value": "the", "weight": 1},
                {"type": "contains", "value": "thgewgewgewgewge", "weight": 1},
            ]
        ],
        alias="assert",
    )

    test_cases: List[TestCase] = Field(
        ...,
        examples=[
            [
                {
                    "vars": {
                        "text": "The power of serendipity is fascinating. Sometimes, the most unexpected encounters can lead to life-changing experiences. Imagine strolling through a park and stumbling upon a group of musicians, their melodies drawing you in. You pause for a moment, only to realize that this spontaneous moment of joy is exactly what you needed—a break from the routine, a reminder of life's simple pleasures. Serendipity teaches us that not everything needs to be planned. Sometimes, the best moments are the ones that catch us by surprise.",
                        "number_of_sentences": "2",
                    },
                    "assert": [
                        {"type": "icontains", "value": "serendipity", "weight": 5}
                    ],
                },
                {
                    "vars": {
                        "text": "The art of minimalism is more than just decluttering your space—it's about simplifying life. In a world overflowing with choices and distractions, minimalism encourages you to focus on what truly matters. It's about owning fewer things but cherishing each one more deeply. By stripping away the excess, you create room for clarity, intention, and peace. Whether it’s reducing physical possessions or streamlining your daily habits, minimalism can bring a sense of freedom, allowing you to invest time and energy in experiences and relationships that bring genuine joy.",
                        "number_of_sentences": "2",
                    },
                    "assert": [
                        {"type": "icontains", "value": "minimalism", "weight": 5}
                    ],
                },
            ]
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


class AIFunctionPatchInput(RootModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=40)]] = (
        None
    )
    description: Optional[
        Annotated[str, StringConstraints(min_length=1, max_length=1000)]
    ] = None
    providers: Optional[Set[Provider]] = 0

    input_variables: Optional[List[InputVariable]] = None
    output_schema: Optional[JsonSchema] = None
    assertions: Optional[List[Assertion]] = Field(default=None, alias="assert")
    test_cases: Optional[List[TestCase]] = None

    @model_validator(mode="after")
    def validate_vars_and_test_cases(self):
        if self.input_variables is None and self.test_cases is None:
            return self

        if self.input_variables is not None and self.test_cases is None:
            raise ValueError(
                """When patching input variables, test cases must also be patched."""
            )

        if self.input_variables is None and self.test_cases is not None:
            return self

        assert self.input_variables
        assert self.test_cases

        if len(self.input_variables) == 0:
            return self

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

        variable_names.sort()
        # assert that all test cases contain each input variable
        for i, test in enumerate(self.test_cases):
            keys = list(test.variables.keys())
            keys.sort()
            if variable_names != keys:
                raise ValueError(
                    f"Missmatch between Input Variables of AI Function: {variable_names} and variables of Test Case {i}: {keys}"
                )

        return self


class AIFunction(AIFunctionRouteInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    number_of_prompts: NonNegativeInt
    implemented: bool
    username: EmailStr
    creation_time: datetime


class AIFunctionOutput(RootModel):
    prompt: List[PromptMessage] = Field(
        ...,
        examples=[
            {"role": "user", "content": "Hey, AI! What's the weather like today?"}
        ],
    )
    response: str | Dict[str, Any] = Field(
        ..., examples=["The weather is sunny today."]
    )
    score: float = Field(..., examples=[0.9])
    cost: float = Field(..., examples=[0.000001])
    latency: float = Field(..., examples=[1200])
    is_json: bool = Field(..., examples=[False])
