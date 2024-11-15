import json
import os
from copy import deepcopy
from pathlib import Path
from typing import Dict

from jose import jwt
from openapi_pydantic import (
    Info,
    MediaType,
    OpenAPI,
    Operation,
    ParameterLocation,
    PathItem,
    RequestBody,
    Schema,
    Server,
)
from passlib.context import CryptContext

from App.models import AIFunction, User

PROJECT_SECRET = os.getenv("PROJECT_SECRET")
SERVER_URL = os.getenv("SERVER_URL")

assert PROJECT_SECRET
assert SERVER_URL

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
    route_mapping: Dict[str, AIFunction],
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
                - List of providers supported by the AI function
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

    # get responses and query params for default execute
    execute_operation = app_openapi.paths[path_name].post
    responses = execute_operation.responses
    query_params = []
    for param in execute_operation.parameters:
        if param.param_in == ParameterLocation.QUERY:
            query_params.append(param)

    # get security schema for default execute endpoint
    security = execute_operation.security

    # extract relevant schemas from components
    schemas_to_select = [
        "AIFunctionOutput",
        "PromptMessage",
        "RoleEnum",
        "HttpExceptionModel",
        "Provider",
    ]
    components = app_openapi.components
    components.schemas = {
        schema_name: app_openapi.components.schemas.get(schema_name)
        for schema_name in schemas_to_select
    }
    components.securitySchemes = {
        "APIKeyHeader": app_openapi.components.securitySchemes["APIKeyHeader"]
    }

    # Define the basic Info object
    info = Info(title=project_name, version="1.0.0", description=project_description)

    # Initialize an empty Paths object
    paths: Dict[str, PathItem] = {}

    # Iterate over each route parameter to construct paths
    for path_name in route_mapping:
        ai_function = route_mapping[path_name]
        # Construct the full route path
        route = f"/execute/{path_segment_name}/{path_name}"

        # define properties including examples extracted from test cases
        properties: Dict[str, Schema] = {}
        # add the test cases as examples to the params
        for var in ai_function.input_variables:
            schema = Schema(type="string")
            schema.examples = []
            for test_case in ai_function.test_cases:
                schema.examples.append(test_case.variables[var.name])
            properties[var.name] = schema
        required = [var.name for var in ai_function.input_variables]

        request_schema = Schema(type="object", properties=properties, required=required)

        # Define the media type for the request body
        request_media = MediaType(media_type_schema=request_schema)

        # Define the RequestBody object
        request_body = RequestBody(
            required=True, content={"application/json": request_media}
        )

        # set available providers for "provider" query param
        query_params_copy = deepcopy(query_params)
        for param in query_params_copy:
            if param.name == "provider":
                param.param_schema = Schema(
                    type="string",
                    enum=ai_function.providers,
                )

        # Define the Operation object for the POST method
        operation = Operation(
            summary=f"Execute AI function '{ai_function.name}'",
            description=ai_function.description,
            operation_id=path_name,
            requestBody=request_body,
            responses=responses,
            parameters=query_params_copy,
            tags=[ai_function.name],
            security=security
        )

        # Define the PathItem with the POST operation
        path_item = PathItem(post=operation)

        # Add the PathItem to the Paths object
        paths[route] = path_item

    # Construct the OpenAPI object
    openapi = OpenAPI(
        openapi="3.1.0",
        servers=[Server(url=SERVER_URL)],
        info=info,
        paths=paths,
        components=components,
    )

    return openapi


# encryption context
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("PROJECT_SECRET")
ALGORITHM = "HS256"


async def generate_api_key(user: User) -> str:
    to_encode = {"user": user.model_dump()}
    api_key = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return api_key


async def get_user_from_api_key(api_key: str) -> User:
    data = jwt.decode(api_key, SECRET_KEY, ALGORITHM)
    user = User(**data["user"])
    return user
