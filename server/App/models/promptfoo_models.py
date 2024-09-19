from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Literal, Optional, Union

from pydantic import Field, confloat

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
    contains = "contains"
    contains_all = "contains-all"
    contains_any = "contains-any"
    contains_json = "contains-json"
    contains_sql = "contains-sql"
    contains_xml = "contains-xml"
    cost = "cost"
    equals = "equals"
    icontains = "icontains"
    icontains_all = "icontains-all"
    is_json = "is-json"
    is_sql = "is-sql"
    is_xml = "is-xml"
    javascript = "javascript"
    latency = "latency"
    levenshtein = "levenshtein"
    perplexity_score = "perplexity-score"
    perplexity = "perplexity"
    python = "python"
    regex = "regex"
    rouge_n = "rouge-n"
    starts_with = "starts-with"


AssertionValue = Union[str, List[str], Dict[str, Any]]


class EvaluateStats(RootModel):
    successes: int
    failures: int
    tokenUsage: TokenUsage


class Assertion(RootModel):
    type: BaseAssertionTypes
    value: Optional["AssertionValue"] = None
    threshold: Optional[float] = None
    weight: Optional[confloat(ge=1)] = None  # type: ignore
    metric: Optional[str] = None


class GradingResult(RootModel):
    passed: bool = Field(..., alias="pass")
    score: float | None
    # reason: str
    # namedScores: Optional[Dict[str, float]] = None
    # tokensUsed: Optional[TokenUsage] = None
    componentResults: Optional[List["GradingResult"]] = None
    assertion: Optional[Assertion] = None
    comment: Optional[str] = None


class EvaluateResult(RootModel):
    response: Optional[ProviderResponse] = None
    vars: Dict[str, str] = None
    # error: Optional[str] = None
    # success: bool
    # score: float | None
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
    assertions: Optional[List[Assertion]] = Field(..., alias="assert")


# Define the role enum
class RoleEnum(str, Enum):
    system = "system"
    user = "user"
    assistant = "assistant"


# Define the message schema
class PromptMessage(RootModel):
    role: RoleEnum
    content: str

    class Config:
        use_enum_values = True


class EvaluateInput(RootModel):
    prompts: List[List[PromptMessage]]
    providers: Literal["openai:gpt-4o-mini"] = (
        "openai:gpt-4o-mini"  # TODO: change this with new LLM Providers model
    )
    defaultTest: Dict[Literal["assert"], List[Assertion]]
    tests: List[TestCase]
