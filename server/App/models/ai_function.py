import uuid
from datetime import datetime
from typing import Annotated, List, Optional

from pydantic import EmailStr, Field, NonNegativeInt, StringConstraints, model_validator

from .promptfoo_models import Assertion, TestCase
from .root_model import RootModel


class InputVariable(RootModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)]


class AIFunctionRouteInput(RootModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="Summarize Texts"
    )

    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="Summarizes english texts to a given number of sentences.")
    )

    input_variables: List[InputVariable] = Field(
        ..., example=[{"name": "text"}, {"name": "number_of_sentences"}]
    )

    assertions: List[Assertion] = Field(
        ...,
        example=[
            {"type": "icontains", "value": "the", "weight": 1},
            {"type": "contains", "value": "thgewgewgewgewge", "weight": 1},
        ],
        alias="assert",
    )

    test_cases: List[TestCase] = Field(
        ...,
        example=[
            {
                "vars": {
                    "text": "The power of serendipity is fascinating. Sometimes, the most unexpected encounters can lead to life-changing experiences. Imagine strolling through a park and stumbling upon a group of musicians, their melodies drawing you in. You pause for a moment, only to realize that this spontaneous moment of joy is exactly what you needed—a break from the routine, a reminder of life's simple pleasures. Serendipity teaches us that not everything needs to be planned. Sometimes, the best moments are the ones that catch us by surprise.",
                    "number_of_sentences": "2",
                },
                "assert": [{"type": "icontains", "value": "serendipity", "weight": 5}],
            },
            {
                "vars": {
                    "text": "The art of minimalism is more than just decluttering your space—it's about simplifying life. In a world overflowing with choices and distractions, minimalism encourages you to focus on what truly matters. It's about owning fewer things but cherishing each one more deeply. By stripping away the excess, you create room for clarity, intention, and peace. Whether it’s reducing physical possessions or streamlining your daily habits, minimalism can bring a sense of freedom, allowing you to invest time and energy in experiences and relationships that bring genuine joy.",
                    "number_of_sentences": "2",
                },
                "assert": [{"type": "icontains", "value": "minimalism", "weight": 5}],
            },
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


class AIFunction(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime
