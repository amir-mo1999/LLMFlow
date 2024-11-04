import os
from typing import Dict, List, Literal

import aiohttp

from App.models import (
    AIFunction,
    AIFunctionOutput,
    Assertion,
    EvaluateInput,
    EvaluateSummary,
    Prompt,
    TestCase,
)

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL") or ""


async def execute_ai_function(
    prompt: Prompt, ai_function: AIFunction, input: TestCase
) -> AIFunctionOutput:
    prompts = [prompt.messages]
    defaultTest: Dict[Literal["assert"], List[Assertion]] = {
        "assert": ai_function.assertions
    }
    tests = ai_function.test_cases

    # parse as EvaluateInpiut for validation
    evaluate_input = EvaluateInput(
        prompts=prompts, defaultTest=defaultTest, tests=tests
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
            and result.score
            and result.cost
            and result.latencyMs
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

        # parse as AIFunctionOutput
        output = AIFunctionOutput(
            prompt=result.prompt.raw,
            response=result.response.output,
            score=result.score,
            cost=result.cost,
            latency=result.latencyMs,
            is_json=is_json,
        )

        return output
