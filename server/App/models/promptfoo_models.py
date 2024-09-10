from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import Field

from .prompt import PromptMessage
from .root_model import RootModel


class TokenUsage(RootModel):
    total: int
    prompt: int
    completion: int
    cached: int


class ProviderResponse(RootModel):
    cached: Optional[bool] = None
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


class TokenUsage(RootModel):
    cached: Optional[int] = None
    completion: Optional[int] = None
    prompt: Optional[int] = None
    total: Optional[int] = None


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
    version: int
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
