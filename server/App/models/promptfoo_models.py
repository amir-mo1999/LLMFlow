from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import Field, model_validator

from .prompt import PromptMessage
from .root_model import RootModel


class TokenUsage(RootModel):
    total: Optional[int] = 0
    prompt: Optional[int] = 0
    completion: Optional[int] = 0
    cached: Optional[int] = 0


class ProviderResponse(RootModel):
    cached: Optional[int] = None
    cost: Optional[float] = None
    error: Optional[str] = None
    logProbs: Optional[List[float]] = None
    metadata: Optional[Dict[str, Any]] = None
    output: Optional[Union[str, Any]] = None
    tokenUsage: Optional[TokenUsage] = None


class BaseAssertionTypes(str, Enum):
    answer_relevance = "answer-relevance"
    contains_all = "contains-all"
    contains_any = "contains-any"
    contains_json = "contains-json"
    contains_sql = "contains-sql"
    contains_xml = "contains-xml"
    contains = "contains"
    context_faithfulness = "context-faithfulness"
    context_recall = "context-recall"
    context_relevance = "context-relevance"
    cost = "cost"
    equals = "equals"
    factuality = "factuality"
    human = "human"
    icontains_all = "icontains-all"
    icontains_any = "icontains-any"
    icontains = "icontains"
    is_json = "is-json"
    is_sql = "is-sql"
    is_valid_openai_function_call = "is-valid-openai-function-call"
    is_valid_openai_tools_call = "is-valid-openai-tools-call"
    is_xml = "is-xml"
    javascript = "javascript"
    latency = "latency"
    levenshtein = "levenshtein"
    llm_rubric = "llm-rubric"
    model_graded_closedqa = "model-graded-closedqa"
    model_graded_factuality = "model-graded-factuality"
    moderation = "moderation"
    perplexity_score = "perplexity-score"
    perplexity = "perplexity"
    python = "python"
    regex = "regex"
    rouge_l = "rouge-l"
    rouge_n = "rouge-n"
    rouge_s = "rouge-s"
    select_best = "select-best"
    similar = "similar"
    starts_with = "starts-with"
    webhook = "webhook"


AssertionValue = Union[str, List[str], Dict[str, Any]]


class EvaluateStats(RootModel):
    successes: int
    failures: int
    tokenUsage: TokenUsage


class Assertion(RootModel):
    type: BaseAssertionTypes
    value: Optional["AssertionValue"] = None
    threshold: Optional[float] = None
    weight: Optional[float] = None
    metric: Optional[str] = None


class OutputAssertions(RootModel):
    assertions: List[Assertion] = Field(..., alias="assert")


class GradingResult(RootModel):
    passed: bool = Field(..., alias="pass")
    score: float
    reason: str
    namedScores: Optional[Dict[str, float]] = None
    tokensUsed: Optional[TokenUsage] = None
    componentResults: Optional[List["GradingResult"]] = None
    assertion: Optional[Assertion] = None
    comment: Optional[str] = None


class EvaluateResult(RootModel):
    response: Optional[ProviderResponse] = None
    error: Optional[str] = None
    success: bool
    score: float
    latencyMs: int
    gradingResult: Optional[GradingResult] = None
    namedScores: Dict[str, float]
    cost: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class EvaluateSummary(RootModel):
    timestamp: datetime
    results: List[EvaluateResult]
    stats: EvaluateStats


class TestCase(RootModel):
    variables: Dict[str, str] = Field(..., alias="vars")


class EvaluateInput(RootModel):
    prompts: List[List[PromptMessage]]
    providers: Literal["openai:gpt-4o-mini"] = (
        "openai:gpt-4o-mini"  # TODO: change this with new LLM Providers model
    )
    defaultTest: OutputAssertions
    tests: List[TestCase]

    @model_validator(mode="after")
    def assert_input_variables_are_present_in_prompts(self):
        # get input variable names; all test cases have same input variables, this is asserted in the AiFunction Model
        var_names = []
        if len(self.tests) > 0:
            var_names = self.tests[0].variables.keys()

        # check that all var names are included in at least one message of the prompt
        for prompt in self.prompts:
            messages = "; ".join([message.content for message in prompt])
            for name in var_names:
                # a variable is always included between two
                name = "{{" + name + "}}"
                if name not in messages:
                    raise ValueError(
                        f"Prompt: {prompt} must contain the variables: {list(var_names)}"
                    )

        return self
