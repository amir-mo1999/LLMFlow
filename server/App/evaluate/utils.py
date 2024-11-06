import os
from asyncio import TaskGroup
from typing import Dict, List, Literal

import aiohttp
from aiohttp import ClientSession
from fastapi import APIRouter

from App.models import (
    AIFunction,
    Assertion,
    EvaluateInput,
    EvaluateSummary,
    Prompt,
    Provider,
)

EVAL_ROUTER = APIRouter(prefix="/evaluate", tags=["Evaluate"])

PROMPTFOO_SERVER_URL = os.environ.get("PROMPTFOO_SERVER_URL") or ""

async def eval_prompt(
    prompt: Prompt, ai_function: AIFunction
) -> Dict[Provider, EvaluateSummary]:
    # extract needed data
    prompts = [prompt.messages]
    defaultTest: Dict[Literal["assert"], List[Assertion]] = {"assert": ai_function.assertions}
    tests = ai_function.test_cases

    # get set of providers
    providers = set(ai_function.providers)

    # create EvaluateInput for each provider
    evaluate_inputs: Dict[Provider, EvaluateInput] = {}
    for provider in providers:
        evaluate_input = EvaluateInput(
            prompts=prompts, defaultTest=defaultTest, tests=tests, providers=provider
        )
        evaluate_inputs[provider] = evaluate_input

    eval_summary_mapping: Dict[Provider, EvaluateSummary] = {}

    # request eval for each provider
    async with aiohttp.ClientSession() as session:
        async with TaskGroup() as tg:
            for provider in providers:
                tg.create_task(
                    _fetch(
                        session,
                        eval_summary_mapping,
                        provider,
                        evaluate_inputs[provider],
                    )
                )

    return eval_summary_mapping


async def _fetch(
    session: ClientSession,
    eval_summary_mapping: Dict[Provider, EvaluateSummary],
    provider: Provider,
    evaluate_input: EvaluateInput,
) -> None:
    dump = evaluate_input.model_dump(by_alias=True)
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

    eval_summary_mapping[provider] = summary
