import json
import sys

from dotenv import load_dotenv

load_dotenv()

from App import app
from fastapi.routing import APIRoute


def get_openapi_schema():
    # Load .env file
    load_dotenv()

    # Set operation IDs to route names
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = route.name
            route.tags = route.endpoint.__module__.split(".")[1:2]
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
