from typing import Dict

from pydantic import RootModel


class Body(RootModel[Dict[str, str]]):
    pass
