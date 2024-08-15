from typing import List
from pydantic import BaseModel, Field
from .prompt import PromptMessage
from .output_assertion import OutputAssertion


class TestCase(BaseModel):
    test_case_vars: dict = Field(..., alias="vars")


class Assert(BaseModel):
    assertions: List[OutputAssertion] = Field(..., alias="assert")


class EvaluateInput(BaseModel):
    prompts: List[PromptMessage]
    providers: List[str]  # TODO: change str with new LLM Providers model
    defaultTest: Assert
    tests: List[TestCase]
