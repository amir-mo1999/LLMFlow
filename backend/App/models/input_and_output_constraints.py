from pydantic import BaseModel
from typing import Union, Literal


class StringInputConstraints(BaseModel):
    type: Literal["string"]
    max_char_length: int = 1000
    min_char_length: int = 0


class NumericInputConstraints(BaseModel):
    type: Literal["numeric"]
    accept_float: bool = False
    max_value: Union[int, float] = 1000
    min_value: Union[int, float] = 0


class ImageFileInputConstraints(BaseModel):
    type: Literal["image_file"]
    max_file_size: float = 2
    min_width: float = 0
    max_width: float = 1920
    min_height: float = 0
    max_height: float = 1080


class AudioFileInputConstraints(BaseModel):
    type: Literal["audio_file"]
    max_file_size: float = 2
    min_length: float = 0
    max_length: float = 300


InputConstraints = Union[
    StringInputConstraints,
    NumericInputConstraints,
    ImageFileInputConstraints,
    AudioFileInputConstraints,
    AudioFileInputConstraints,
]


class StringOutputConstraints(StringInputConstraints):
    type: Literal["string"]


class NumericOutputConstraints(NumericInputConstraints):
    type: Literal["numeric"]


class ImageFileOutputConstraints(ImageFileInputConstraints):
    type: Literal["image_file"]


class AudioFileOutputConstraints(AudioFileInputConstraints):
    type: Literal["audio_file"]


OutputConstraints = Union[
    StringOutputConstraints,
    NumericOutputConstraints,
    ImageFileOutputConstraints,
    AudioFileOutputConstraints,
    AudioFileOutputConstraints,
]
