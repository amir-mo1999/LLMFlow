from typing import Dict, List, Literal, Optional, Union

from .root_model import RootModel

Type = Literal["string", "number", "integer", "boolean", "object", "array", "null"]


class JsonSchema(RootModel):
    type: Type
    title: Optional[str] = None

    # string + number + integer
    enum: Optional[List[str] | List[float] | List[int]] = None

    # string
    maxLength: Optional[int] = None
    minLength: Optional[int] = None
    pattern: Optional[str] = None

    # number + integer
    multipleOf: Optional[float] = None
    maximum: Optional[float] = None
    exclusiveMaximum: Optional[float] = None
    minimum: Optional[float] = None
    exclusiveMinimum: Optional[float] = None

    # array
    items: Optional["JsonSchema"] = None
    contains: Optional["JsonSchema"] = None
    maxContains: Optional[int] = None
    minContains: Optional[int] = None
    maxItems: Optional[int] = None
    minItems: Optional[int] = None
    uniqueItems: Optional[bool] = None

    # object
    properties: Optional[Dict[str, "JsonSchema"]] = None
    patternProperties: Optional[Dict[str, "JsonSchema"]] = None
    additionalProperties: Optional[Union[bool, "JsonSchema"]] = None
    maxProperties: Optional[int] = None
    minProperties: Optional[int] = None
    required: Optional[List[str]] = None


JsonSchema.model_rebuild()
