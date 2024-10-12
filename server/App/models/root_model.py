from pydantic import BaseModel


class RootModel(BaseModel):
    class Config:
        use_enum_values: True
        str_strip_whitespace: True
        populate_by_name: True
        validate_assignment: True

    def model_dump(self, *args, **kwargs):
        kwargs.setdefault("exclude_none", True)
        return super().model_dump(*args, **kwargs)

    def model_dump_json(self, *args, **kwargs):
        kwargs.setdefault("exclude_none", True)
        return super().model_dump_json(*args, **kwargs)
