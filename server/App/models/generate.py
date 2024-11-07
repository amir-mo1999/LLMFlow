from typing import Dict, List

from pydantic import model_validator

from .root_model import RootModel


class GenerateTestCasesInput(RootModel):
    description: str
    input_variables: List[str]
    test_cases: List[Dict[str, str]]

    @model_validator(mode="after")
    def assert_input_variables_are_unique(self):
        # get variable names of ai function
        variable_names = self.input_variables.copy()
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
        var_names = self.input_variables.copy()
        var_names.sort()

        # assert that all test cases contain each input variable
        for i, test_case in enumerate(self.test_cases):
            keys = list(test_case.keys())
            keys.sort()
            if var_names != keys:
                raise ValueError(
                    f"Missmatch between Input Variables of AI Function: {var_names} and variables of Test Case {i}: {keys}"
                )

        return self
