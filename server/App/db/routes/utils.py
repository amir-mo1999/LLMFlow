from typing import Any, Dict, List, Tuple

from openapi_pydantic import OpenAPI

from App.models import InputVariable


def generate_project_api_docs(
    project_name: str,
    path_segment_name: str,
    route_params: List[Tuple[str, str, str, List[InputVariable]]],
) -> OpenAPI:
    openapi_spec: Dict[str, Any] = {
        "openapi": "3.1.0",
        "info": {
            "title": f"API Documentation for Project: {project_name}",
            "version": "1.0.0",
            "description": f"API documentation for project {project_name}.",
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
        description,
        ai_function_path_segment_name,
        input_variables,
    ) in route_params:
        # Construct the route
        route = f"/execute/{path_segment_name}/{ai_function_path_segment_name}"

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
                "description": description,
                "operationId": ai_function_path_segment_name,
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

    return OpenAPI(**openapi_spec)
