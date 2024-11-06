import uuid
from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import EmailStr, Field, ValidationInfo, field_validator

from .promptfoo_models import EvaluateSummary, PromptMessage, Provider, RoleEnum
from .root_model import RootModel

PromptTag = Literal["highest score", "cheapest", "fastest"]

# Define the prompt schema
class PromptRouteInput(RootModel):
    messages: List[PromptMessage] = Field(
        ...,
        examples=[
            [
                PromptMessage(
                    role=RoleEnum.user,
                    content="Summarize the following text: {{text}} in {{number_of_sentences}} sentences.",
                )
            ]
        ],
    )
    ai_function_id: str


class Prompt(PromptRouteInput):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: EmailStr
    creation_time: datetime
    evals: Dict[Provider, EvaluateSummary] | None = None
    ai_function_name: str
    revision_required: Optional[bool] = False
    index: int

    @field_validator("messages")
    @classmethod
    def assert_input_variables_are_present_in_prompt(
        cls, messages: List[PromptMessage], info: ValidationInfo
    ):
        # context must be given
        if info.context is None:
            return messages
        # variable names from validation context
        var_names = info.context

        # check that all var names are included in at least one message of the prompt
        messages_joined = "; ".join([message.content for message in messages])
        for name in var_names:
            # a variable is always included between two braces
            name = "{{" + name + "}}"
            if name not in messages_joined:
                raise ValueError(
                    f"Prompt must contain the variables: {list(var_names)}"
                )

        return messages
