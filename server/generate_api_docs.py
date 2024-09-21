import json
import sys

from dotenv import load_dotenv

load_dotenv()

from App import app
from fastapi.routing import APIRoute
from fastapi.utils import create_model_field
from fastapi_camelcase import CamelModel


class HttpExceptionModel(CamelModel):
    message: str
    status: int


def get_openapi_schema():
    # Load .env file
    load_dotenv()

    # Set operation IDs to route names
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name
            route.tags = route.endpoint.__module__.split(".")[1:2]

            for status_code, definition in route.responses.items():
                if status_code >= 400 and "model" not in definition:
                    route.responses[status_code]["model"] = HttpExceptionModel
                    route.response_fields[status_code] = create_model_field(
                        name=f"Response_{status_code}_{route.unique_id}",
                        type_=HttpExceptionModel,
                    )
    # Generate OpenAPI schema
    openapi_schema = app.openapi()
    return openapi_schema


# Write to file
if __name__ == "__main__":
    # Get the output file from the command line or use "openapi.json"
    try:
        output_file = sys.argv[1]
    except IndexError:
        output_file = "openapi.json"
    with open(output_file, "w") as f:
        f.write(json.dumps(get_openapi_schema(), indent=4))
