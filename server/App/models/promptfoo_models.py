from typing import List, Literal

from pydantic import BaseModel

from .ai_function import TestCase, OutputAssertions
from .prompt import PromptMessage


class EvaluateInput(BaseModel):
    prompts: List[List[PromptMessage]]
    providers: Literal["openai:gpt-4o-mini"] = (
        "openai:gpt-4o-mini"  # TODO: change with new LLM Providers model
    )
    defaultTest: OutputAssertions
    tests: List[TestCase]
