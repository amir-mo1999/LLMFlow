from typing import List, Literal

from .ai_function import OutputAssertions, TestCase
from .prompt import PromptMessage
from .root_model import RootModel


class EvaluateInput(RootModel):
    prompts: List[List[PromptMessage]]
    providers: Literal["openai:gpt-4o-mini"] = (
        "openai:gpt-4o-mini"  # TODO: change with new LLM Providers model
    )
    defaultTest: OutputAssertions
    tests: List[TestCase]
