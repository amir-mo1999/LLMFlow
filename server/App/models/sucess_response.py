from .root_model import RootModel


class SuccessResponse(RootModel):
    message: str = "Success"
