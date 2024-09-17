from datetime import datetime
from enum import Enum
from typing import List, Literal, Union

from pydantic import EmailStr, Field, ValidationInfo, field_validator, model_validator

from .objectID import PydanticObjectId
from .root_model import RootModel


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


# Define the prompt schema
class PromptRouteInput(RootModel):
    prompt_type: Union[Literal["single_shot"], Literal["chat"]] = Field(
        ..., example="single_shot"
    )
    messages: List[PromptMessage] = Field(
        ...,
        example=[
            PromptMessage(
                role="user",
                content="Summarize the following text: {{text}} in {{number_of_sentences}} sentences.",
            )
        ],
    )
    ai_function_id: PydanticObjectId

    @model_validator(mode="after")
    def check_messages(self):
        prompt_type = self.prompt_type
        messages = self.messages

        if prompt_type == "single_shot":
            if len(messages) == 0:
                return self
            elif len(messages) == 1 and messages[0].role == "user":
                return self
            else:
                raise ValueError(
                    """When promptType is 'single_shot',
                    messages should contain exactly one message with the role 'user'."""
                )
        return self


class PromptNoID(PromptRouteInput):
    username: EmailStr
    creation_time: datetime

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


class Prompt(PromptNoID):
    id: PydanticObjectId = Field(alias="_id")
