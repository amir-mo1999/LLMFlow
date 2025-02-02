import json
import os
from typing import Dict, List, Literal

import aiohttp

from App.models import (
    AIFunctionOutput,
    Assertion,
    EvaluateInput,
    EvaluateSummary,
    Prompt,
    PromptMessage,
    Provider,
    TestCase,
)

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL") or ""


async def execute_ai_function(provider: Provider,
    prompt: Prompt, assertions: List[Assertion], test_case: TestCase
) -> AIFunctionOutput:
    prompts = [prompt.messages]
    defaultTest: Dict[Literal["assert"], List[Assertion]] = {"assert": assertions}
    tests = [test_case]

    # parse as EvaluateInpiut for validation
    evaluate_input = EvaluateInput(
        prompts=prompts, defaultTest=defaultTest, tests=tests, providers=provider
    )

    # send request to promptfoo-server
    dump = evaluate_input.model_dump(by_alias=True)
    async with aiohttp.ClientSession() as session:
        res = await session.post(
            PROMPTFOO_SERVER_URL,
            json=dump,
            headers={"Content-Type": "application/json"},
        )

        # create EvaluateSummary
        data = await res.json()
        summary = EvaluateSummary(
            timestamp=data["timestamp"], results=data["results"], stats=data["stats"]
        )

        result = summary.results[0]
        assert (
            result
            and result.gradingResult
            and result.gradingResult.componentResults
            and result.score is not None
            and result.cost is not None
            and result.latencyMs is not None
            and result.response
            and result.prompt
            and result.response.output
            and result.prompt.raw
        )

        is_json = False
        for grading_result in result.gradingResult.componentResults:
            assert grading_result.assertion
            if grading_result.assertion.type == "is-json" and grading_result.passed:
                is_json = True

        response = (
            json.loads(result.response.output) if is_json else result.response.output
        )

        # parse as AIFunctionOutput
        output = AIFunctionOutput(
            prompt_messages=[
                PromptMessage(**data) for data in json.loads(result.prompt.raw)
            ],
            response=response,
            score=result.score,
            cost=result.cost,
            latency=result.latencyMs,
            is_json=is_json,
            provider=provider,
        )

        return output
