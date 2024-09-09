from pydantic import BaseModel


class RootModel(BaseModel):
    class Config:
        use_enum_values: True
        str_strip_whitespace: True
        populate_by_name: True
        validate_assignment: True
