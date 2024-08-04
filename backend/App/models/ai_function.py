from pydantic import (
    BaseModel,
    StringConstraints,
    Field,
    NonNegativeInt,
    EmailStr,
    model_validator,
)
from typing import Annotated, List, Dict, Union, Literal
from .objectID import PydanticObjectId
from datetime import datetime
from .input_variable import InputVariable
from .input_and_output_constraints import (
    StringInputConstraints,
    StringOutputConstraints,
    NumericOutputConstraints,
    AudioFileOutputConstraints,
    ImageFileOutputConstraints,
    OutputConstraints,
)

# import mongo client
from pymongo.mongo_client import MongoClient

import os
from bson import ObjectId


class AIFunctionRouteInput(BaseModel):
    # name of the ai function
    name: Annotated[str, StringConstraints(min_length=1, max_length=40)] = Field(
        ..., example="Summarize Texts"
    )

    # description of the ai function
    description: Annotated[str, StringConstraints(min_length=1, max_length=1000)] = (
        Field(..., example="Summarizes english texts to a given number of sentences.")
    )

    # list of input variables
    input_variables: List[InputVariable] = Field(
        ...,
        example=[
            {
                "name": "text",
                "var_type": "string",
                "constraints": StringInputConstraints(type="string"),
            },
            {
                "name": "number_of_sentences",
                "var_type": "numeric",
                "constraints": StringInputConstraints(type="string"),
            },
        ],
        description="A list of input variables. Each input variable has a name and a type",
    )

    # output type; same type options as for input variables
    output_type: Literal["numeric", "string", "audio_file", "image_file"] = Field(
        ..., example="string"
    )

    output_constraints: OutputConstraints = Field(
        ..., example=StringOutputConstraints(type="string", max_char_length=500)
    )

    # the example dataset works differently depending on what type of input data is used
    # for file inputs such as audio files or image files the object id of this file is saved in the dataset not the content of the file itself
    # for numeric or string inputs the actual value of the input is saved
    example_dataset: List[Dict[str, Union[Union[int, float], str]]] = Field(
        ...,
        example=[
            {"text": "This is an example text.", "number_of_sentences": 1},
            {"text": "This is another example text.", "number_of_sentences": 2},
            {"text": "This is yet another example text.", "number_of_sentences": 3},
        ],
    )

    @model_validator(mode="after")
    def validate_fields(self):
        ## assert that the input variable names are present in the example dataset
        input_variable_names = []
        for input_variable in self.input_variables:
            input_variable_names.append(input_variable.name)

        for input_variable_name in input_variable_names:
            for indx, record in enumerate(self.example_dataset):
                if input_variable_name not in record.keys():
                    raise AssertionError(
                        f"The input variable {input_variable_name} is not present in record {indx} of the example dataset."
                    )

        ## assert that the example dataset does not contain additional keys other than the input variable names
        key_len = len(input_variable_names)
        for indx, record in enumerate(self.example_dataset):
            if len(record.keys()) != key_len:
                raise AssertionError(
                    f"Record {indx} of the dataset contains additional keys other than the input variable names."
                )

        ## assert that the output constraint match the output type
        if self.output_type == "numeric":
            if not isinstance(self.output_constraints, NumericOutputConstraints):
                raise AssertionError(
                    f"The output constraints are not of type NumericOutputConstraints."
                )
        elif self.output_type == "string":
            if not isinstance(self.output_constraints, StringOutputConstraints):
                raise AssertionError(
                    f"The output constraints are not of type StringOutputConstraints."
                )
        elif self.output_type == "audio_file":
            if not isinstance(self.output_constraints, AudioFileOutputConstraints):
                raise AssertionError(
                    f"The output constraints are not of type AudioFileOutputConstraints."
                )
        elif self.output_type == "image_file":
            if not isinstance(self.output_constraints, ImageFileOutputConstraints):
                raise AssertionError(
                    f"The output constraints are not of type ImageFileOutputConstraints."
                )

        ## assert that for file based input variables the file object key is present in the database
        # set up mongo client
        uri = os.environ.get("MONGO_CON_STRING")
        client = MongoClient(uri)
        db = client["prompt-broker"]
        file_collection = db["example-data-files"]

        # loop over the input variables
        for input_variable in self.input_variables:
            # check if we are dealing with a file based input variable
            if (
                input_variable.var_type == "audio_file"
                or input_variable.var_type == "image_file"
            ):
                for indx, record in enumerate(self.example_dataset):
                    # assert that the object id is an actual object id
                    obj_id = record[input_variable.name]
                    if not ObjectId.is_valid(obj_id):
                        raise AssertionError(f"{obj_id} is not a valid object id")

                    # try finding the value which is the object id for the file in the dataset and return an error if its not there
                    file_doc = file_collection.find({"_id": ObjectId(obj_id)})
                    if len(list(file_doc)) == 0:
                        raise AssertionError(
                            f"No file with the object id {obj_id} was found."
                        )

        return self


class AIFunction(AIFunctionRouteInput):
    number_of_prompts: NonNegativeInt
    username: EmailStr
    creation_time: datetime


class AIFunctionWithID(AIFunction):
    id: PydanticObjectId = Field(alias="_id")


class AIFunctionList(BaseModel):
    ai_function_list: List[AIFunctionWithID]
