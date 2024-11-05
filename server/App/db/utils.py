import json
import os
from pathlib import Path
from typing import Dict, List, Tuple

from openapi_pydantic import (
    Info,
    MediaType,
    OpenAPI,
    Operation,
    PathItem,
    RequestBody,
    Schema,
    Server,
)

from App.models import InputVariable, TestCase

BACKEND_URL = os.getenv("BACKEND_URL") or "/"


async def get_app_api_docs() -> OpenAPI:
    root_dir = Path(__file__).resolve().parent.parent.parent
    open_api_json_path = os.path.join(root_dir, "openapi.json")
    with open(open_api_json_path, "r", encoding="utf-8") as f:
        openapi_data = json.load(f)
        openapi = OpenAPI(**openapi_data)
        return openapi


async def generate_project_api_docs(
    project_name: str,
    project_description: str,
    path_segment_name: str,
    route_params: List[Tuple[str, str, str, List[InputVariable], List[TestCase]]],
) -> OpenAPI:
    """
    Generates an OpenAPI specification for the given project using openapi_pydantic models.

    Args:
        project_name (str): The name of the project.
        project_description (str): A description of the project.
        path_segment_name (str): The base path segment for all routes.
        route_params (List[Tuple[str, str, str, List[InputVariable]]]):
            A list of tuples containing:
                - AI function name
                - Description of the AI function
                - Path segment name for the AI function
                - List of input variables required by the AI function
                - List of test cases for the AI function

    Returns:
        OpenAPI: The constructed OpenAPI specification.
    """

    # get responses from default execute endpoint
    app_openapi = await get_app_api_docs()
    path_name = ""
    for path in app_openapi.paths:
        if path.startswith("/execute"):
            path_name = path

    # get responses for default execute
    responses = app_openapi.paths[path_name].post.responses

    # extract relevant schemas from components
    schemas_to_select = [
        "AIFunctionOutput",
        "PromptMessage",
        "RoleEnum",
        "HttpExceptionModel",
    ]
    components = app_openapi.components
    components.schemas = {
        schema_name: app_openapi.components.schemas.get(schema_name)
        for schema_name in schemas_to_select
    }

    # Define the basic Info object
    info = Info(title=project_name, version="1.0.0", description=project_description)

    # Initialize an empty Paths object
    paths: Dict[str, PathItem] = {}

    # Iterate over each route parameter to construct paths
    for (
        ai_function_name,
        description,
        ai_function_path_segment_name,
        input_variables,
        test_cases,
    ) in route_params:
        # Construct the full route path
        route = f"/execute/{path_segment_name}/{ai_function_path_segment_name}"

        # define properties including examples extracted from test cases
        properties: Dict[str, Schema] = {}
        # add the test cases as examples to the params
        for var in input_variables:
            schema = Schema(type="string")
            schema.examples = []
            for test_case in test_cases:
                schema.examples.append(test_case.variables[var.name])
            properties[var.name] = schema
        required = [var.name for var in input_variables]

        request_schema = Schema(type="object", properties=properties, required=required)

        # Define the media type for the request body
        request_media = MediaType(media_type_schema=request_schema)

        # Define the RequestBody object
        request_body = RequestBody(
            required=True, content={"application/json": request_media}
        )

        # Define the Operation object for the POST method
        operation = Operation(
            summary=f"Execute AI function '{ai_function_name}'",
            description=description,
            operation_id=ai_function_path_segment_name,
            requestBody=request_body,
            responses=responses,
        )

        # Define the PathItem with the POST operation
        path_item = PathItem(post=operation)

        # Add the PathItem to the Paths object
        paths[route] = path_item

    # Define the Server object
    servers = [Server(url=BACKEND_URL)]

    # Construct the OpenAPI object
    openapi = OpenAPI(
        openapi="3.1.0", info=info, paths=paths, servers=servers, components=components
    )

    return openapi
