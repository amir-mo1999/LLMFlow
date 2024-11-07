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
    equals = "equals"
    icontains = "icontains"
    icontains_all = "icontains-all"
    icontains_any = "icontains-any"
    is_json = "is-json"
    javascript = "javascript"
    levenshtein = "levenshtein"
    python = "python"
    regex = "regex"
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


class RawPrompt(RootModel):
    raw: Optional[str] = None


class EvaluateResult(RootModel):
    prompt: Optional[RawPrompt] = None
    response: Optional[ProviderResponse] = None
    vars: Optional[Dict[str, str]] = None
    # error: Optional[str] = None
    # success: bool
    score: float | None
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

class Provider(str, Enum):
    gtp_4o_mini = "openai:gpt-4o-mini"
    gpt_4 = "openai:gpt-4"
    gpt_3_5_turbo = "openai:gpt-3.5-turbo"

class EvaluateInput(RootModel):
    prompts: List[List[PromptMessage]]
    providers: Provider = Provider.gtp_4o_mini
    defaultTest: Dict[Literal["assert"], List[Assertion]]
    tests: List[TestCase]
