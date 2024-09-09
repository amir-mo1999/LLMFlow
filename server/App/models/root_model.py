from pydantic import BaseModel, model_serializer
from typing import Dict, Any


class RootModel(BaseModel):
    class Config:
        use_enum_values: True
        str_strip_whitespace: True
        populate_by_name: True
        validate_assignment: True
