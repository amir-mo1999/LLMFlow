from enum import Enum
from typing import List, Literal, Union
from pydantic import BaseModel, Field, model_validator, EmailStr
from .objectID import PydanticObjectId
from datetime import datetime


# Define the role enum
class RoleEnum(str, Enum):
    system = "system"
    user = "user"
    assistant = "assistant"


# Define the message schema
class Message(BaseModel):
    role: RoleEnum
    content: str


# Define the prompt schema
class PromptRouteInput(BaseModel):
    prompt_type: Union[Literal["single_shot"], Literal["chat"]] = Field(
        ..., example="single_shot"
    )
    messages: List[Message] = Field(
        ...,
        example=[
            Message(role="user", content="Summarize the following text: {{text}}")
        ],
    )
    ai_function_id: PydanticObjectId

    @model_validator(mode="after")
    def check_messages(cls, values):
        prompt_type = values.prompt_type
        messages = values.messages

        if prompt_type == "single_shot":
            if len(messages) == 0:
                return values
            elif len(messages) == 1 and messages[0].role == "user":
                return values
            else:
                raise ValueError(
                    "When promptType is 'single_shot', messages should contain exactly one message with the role 'user'."
                )
        return values


class Prompt(PromptRouteInput):
    username: EmailStr
    creation_time: datetime


class PromptWithID(Prompt):
    id: PydanticObjectId = Field(alias="_id")
