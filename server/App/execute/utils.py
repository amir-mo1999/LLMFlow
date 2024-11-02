import re
from typing import Any, Dict, List, Tuple

from App.models import InputVariable


def format_name(name: str) -> str:
    """
    Formats a name to be URL-friendly by replacing whitespaces with hyphens
    and removing any characters that would require URL encoding.

    Parameters:
    - name (str): The original name string to format.

    Returns:
    - str: The formatted, URL-friendly name.
    """
    formatted_name = re.sub(r"\s+", "-", name)
    formatted_name = re.sub(r"[^A-Za-z0-9\-_.~]", "", formatted_name)

    if len(formatted_name) == 0:
        formatted_name = "default-name"
    return formatted_name


def generate_project_api_docs(
    project_id: str,
    project_name: str,
    route_params: List[Tuple[str, List[InputVariable]]],
) -> Dict[str, Any]:
    """
    Generates OpenAPI documentation for a given project and its AI functions.

    Parameters:
    - project_id (str): Unique UUID for the project.
    - project_name (str): Name of the project.
    - route_params (list): List of tuples, each containing:
        - ai_function_name (str): Name of the AI function.
        - input_variables (list): List of input variable names for the AI function.

    Returns:
    - dict: OpenAPI specification as a dictionary.
    """
    formatted_project_name = format_name(project_name)

    # Base structure of the OpenAPI specification
    openapi_spec: Dict[str, Any] = {
        "openapi": "3.0.0",
        "info": {
            "title": f"API Documentation for Project: {project_name}",
            "version": "1.0.0",
            "description": f"API documentation for project '{project_name}' with ID '{project_id}'.",
        },
        "paths": {},
        "components": {
            "securitySchemes": {
                "ApiKeyAuth": {"type": "apiKey", "in": "header", "name": "x-api-key"}
            }
        },
        "security": [{"ApiKeyAuth": []}],
    }

    # Construct endpoints for each AI function
    for (
        ai_function_name,
        input_variables,
    ) in route_params:
        formatted_ai_function_name = format_name(ai_function_name)
        # Format the AI function name
        # Construct the route
        route = f"/{project_id}/{formatted_project_name}/{formatted_ai_function_name}"

        # Define parameters for the input variables
        request_body_content: Dict[str, Any] = {
            "application/json": {
                "schema": {"type": "object", "properties": {}, "required": []}
            }
        }

        for var in input_variables:
            # Add each input variable to the schema
            request_body_content["application/json"]["schema"]["properties"][
                var.name
            ] = {"type": "string"}
            request_body_content["application/json"]["schema"]["required"].append(
                var.name
            )

        # Define the endpoint in the OpenAPI paths
        openapi_spec["paths"][route] = {
            "post": {
                "summary": f"Execute AI function '{ai_function_name}'",
                "description": f"Executes the AI function '{ai_function_name}' in project '{project_name}'.",
                "operationId": f"{project_name}_{ai_function_name}",
                "requestBody": {"required": True, "content": request_body_content},
                "responses": {
                    "200": {
                        "description": "Successful execution",
                        "content": {"application/json": {"schema": {"type": "object"}}},
                    }
                },
                "security": [{"ApiKeyAuth": []}],
            }
        }

    return openapi_spec
