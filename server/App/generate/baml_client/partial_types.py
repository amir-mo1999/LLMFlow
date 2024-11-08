###############################################################################
#
#  Welcome to Baml! To use this generated code, please run the following:
#
#  $ pip install baml
#
###############################################################################

# This file was generated by BAML: please do not edit it. Instead, edit the
# BAML files and re-generate this code.
#
# ruff: noqa: E501,F401
# flake8: noqa: E501,F401
# pylint: disable=unused-import,line-too-long
# fmt: off
from enum import Enum
from typing import Dict, List, Literal, Optional, Union

import baml_py
from pydantic import BaseModel, ConfigDict

from . import types
from .types import Check, Checked

###############################################################################
#
#  These types are used for streaming, for when an instance of a type
#  is still being built up and any of its fields is not yet fully available.
#
###############################################################################


class GenParams(BaseModel):


    name: Optional[str] = None
    description: Optional[str] = None
    test_case: List[Dict[str, Optional[str]]]
    variables: List[Optional[str]]

class GenPromptMessage(BaseModel):


    role: Optional[types.GenRole] = None
    content: Optional[str] = None

class GenTestCase(BaseModel):


    variables: Dict[str, Optional[str]]
