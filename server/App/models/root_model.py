from typing import Any

from pydantic import BaseModel, ConfigDict


class RootModel(BaseModel):
    model_config = ConfigDict(
        use_enum_values=True,
        str_strip_whitespace=True,
        populate_by_name=True,
        validate_assignment=True
    )

    # type ignore
    def model_dump(self, *args: Any, **kwargs: Any):
        kwargs.setdefault("exclude_none", True)
        return super().model_dump(*args, **kwargs)

    def model_dump_json(self, *args: Any, **kwargs: Any):
        kwargs.setdefault("exclude_none", True)
        return super().model_dump_json(*args, **kwargs)
