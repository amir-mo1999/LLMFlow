import os
from typing import Any, AsyncGenerator, Dict, List, Literal, Mapping, Tuple, Union

from fastapi import Depends
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
    AsyncIOMotorCommandCursor,
    AsyncIOMotorCursor,
)

from App.models import (
    AIFunction,
    AIFunctionPatchInput,
    EvaluateSummary,
    Project,
    ProjectPatchInput,
    Prompt,
    PromptMessage,
    PromptTag,
    Provider,
    User,
)

Collection = Literal["ai-functions", "prompts", "users", "projects"]
Object = Union[AIFunction, Prompt, User, Project]
Document = Dict[str, Any]


async def cursor_to_list(
    cursor: AsyncIOMotorCursor[Document] | AsyncIOMotorCommandCursor[Document],
) -> List[Document]:
    docs: List[Document] = []
    async for doc in cursor:
        docs.append(doc)
    return docs


class DB:
    def __init__(self, client: AsyncIOMotorClient[Document]):
        self.db = client["prompt-broker"]
        self.length = 100000000

        self.prompts: AsyncIOMotorCollection[Document] = self.db.get_collection(
            "prompts"
        )
        self.ai_functions: AsyncIOMotorCollection[Document] = self.db.get_collection(
            "ai-functions"
        )
        self.users: AsyncIOMotorCollection[Document] = self.db.get_collection("users")
        self.projects: AsyncIOMotorCollection[Document] = self.db.get_collection(
            "projects"
        )

        self.collection_mapping: Dict[Collection, AsyncIOMotorCollection[Document]] = {
            "prompts": self.prompts,
            "ai-functions": self.ai_functions,
            "users": self.users,
            "projects": self.projects,
        }

    async def count_documents(self, collection: Collection, filter: Mapping[str, Any]):
        col = self.collection_mapping.get(collection)
        assert col
        return await col.count_documents(filter=filter)

    async def get_prompt_max_index(self, ai_function_id: str):
        max_index = 1
        prompt = await self.prompts.find_one(
            {"ai_function_id": ai_function_id}, sort=[("index", -1)]
        )
        if prompt:
            new_index = prompt.get("index")
            assert new_index
            max_index = new_index + 1

        return max_index

    async def get_all_docs_by_username(
        self, collection: Collection, username: str
    ) -> List[Document]:
        docs_cursor: AsyncIOMotorCursor[Document] = self.collection_mapping[
            collection
        ].find({"username": username})
        docs: List[Document] = await cursor_to_list(docs_cursor)
        return docs

    async def get_by_id(self, collection: Collection, object_id: str):
        doc = await self.collection_mapping[collection].find_one({"_id": object_id})
        return doc

    async def insert(
        self,
        document: Object,
        collection: Collection,
        compare_fields: List[str] = [],
        additional_data: Dict[Any, Any] = {},
    ) -> bool:
        coll = self.collection_mapping[collection]
        if len(compare_fields) == 0:
            await coll.insert_one(
                {**document.model_dump(by_alias=True), **additional_data}
            )
            return True
        # always exclude the id field
        if "_id" in compare_fields:
            compare_fields.remove("_id")
        if "id" in compare_fields:
            compare_fields.remove("id")

        # get values of to be inserted items
        query: Dict[str, Any] = {}
        doc_dump = document.model_dump()
        doc_dump_by_alias = document.model_dump(by_alias=True)
        for field in compare_fields:
            try:
                query[field] = doc_dump[field]
            except KeyError:
                query[field] = doc_dump_by_alias[field]

        # check if same item exist
        existing_document = await coll.find_one(query)

        if existing_document is not None:
            return False

        await coll.insert_one({**document.model_dump(by_alias=True), **additional_data})

        return True

    async def update_prompt_messages(
        self,
        prompt: Prompt,
        messages: List[PromptMessage],
    ) -> Prompt | None:
        ai_function = await self.get_ai_function_by_id(
            ai_function_id=prompt.ai_function_id
        )

        if ai_function is None:
            return None

        # validate prompt with new messages
        prompt_new = dict(prompt)
        prompt_new["messages"] = messages
        prompt_new = Prompt.model_validate(
            prompt_new,
            context=[var.name for var in ai_function.input_variables],
        )

        # update prompt
        new_messages = [message.model_dump(by_alias=True) for message in messages]

        await self.prompts.update_one(
            {"_id": prompt.id},
            {
                "$set": {
                    "messages": new_messages,
                    "evals": None,
                    "revision_required": False,
                }
            },
        )

        # return prompt
        prompt_new = await self.get_prompt_by_id(prompt_id=prompt.id)
        return prompt_new

    async def increment_prompt_count(
        self, ai_function_id: str, decrement: bool = False
    ):
        """Increment or decrement the prompt count of an AI function. If number of prompts becomes 0, set implemented to False."""
        increment_value = 1 if not decrement else -1
        update_query = {"$inc": {"number_of_prompts": increment_value}}

        ai_function = await self.get_ai_function_by_id(ai_function_id=ai_function_id)
        if ai_function is None:
            return

        if ai_function.number_of_prompts == 1 and decrement:
            update_query["$set"] = {"implemented": False}
        else:
            update_query["$set"] = {"implemented": True}

        await self.ai_functions.update_one({"_id": ai_function_id}, update_query)

    async def delete(self, document_id: str, collection: Collection) -> bool:
        # get collection
        coll = self.collection_mapping[collection]

        # delete document
        await coll.delete_one({"_id": document_id})

        # if the document was an ai function, also delete all prompts for that ai function and delete the ai function from projects
        if coll.name == "ai-functions":
            await self.prompts.delete_many({"ai_function_id": document_id})
            await self.projects.update_many(
                {"api_routes.ai_function_id": document_id},
                {"$pull": {"api_routes": {"ai_function_id": document_id}}},
            )

        return True

    async def get_all_ai_functions(self, username: str) -> Dict[str, AIFunction]:
        ai_functions = await self.get_all_docs_by_username("ai-functions", username)
        ai_function_objects: Dict[str, AIFunction] = {}

        for ai_function in ai_functions:
            ai_function = AIFunction(**ai_function)
            ai_function_objects[ai_function.id] = ai_function

        return ai_function_objects

    async def get_all_projects(self, username: str) -> Dict[str, Project]:
        projects = await self.get_all_docs_by_username("projects", username)
        project_objects: Dict[str, Project] = {}

        for project in projects:
            project = Project(**project)
            project_objects[project.id] = project

        return project_objects

    async def get_project_by_path_segment_name(
        self, path_segment_name: str, username: str
    ) -> Project | None:
        project = await self.projects.find_one(
            {"path_segment_name": path_segment_name, "username": username}
        )
        if project is None:
            return None
        return Project(**project)

    async def get_project_by_name(self, name: str, username: str) -> Project | None:
        project = await self.projects.find_one({"name": name, "username": username})
        if project is None:
            return None
        return Project(**project)

    async def get_user(self, username: str) -> User | None:
        user = await self.users.find_one({"username": username})
        if user is None:
            return None

        user = User(**user)
        return user

    async def get_ai_function_by_id(
        self,
        ai_function_id: str,
    ) -> AIFunction | None:
        ai_function = await self.get_by_id("ai-functions", ai_function_id)

        if ai_function is None:
            return None

        return AIFunction(**ai_function)

    async def get_project_by_id(self, project_id: str) -> Project | None:
        project = await self.get_by_id("projects", project_id)

        if project is None:
            return None

        return Project(**project)

    async def get_prompt_by_id(self, prompt_id: str) -> Prompt | None:
        prompt = await self.get_by_id("prompts", prompt_id)

        if prompt is None:
            return None

        return Prompt(**prompt)

    async def patch_ai_function(
        self, ai_function: AIFunction, ai_function_patch: AIFunctionPatchInput
    ) -> AIFunction | None:
        # check if an ai function with the new name exists
        if ai_function_patch.name:
            query = await self.ai_functions.find_one(
                {"_id": {"$ne": ai_function.id}, "name": ai_function_patch.name}
            )
            if query:
                return None
            else:
                await self.prompts.update_many(
                    {"ai_function_id": ai_function.id},
                    {"$set": {"ai_function_name": ai_function_patch.name}},
                )

        # update fields in ai function dump
        ai_function_dump = ai_function.model_dump()
        for key in ai_function_patch.model_dump(exclude_none=True):
            ai_function_dump[key] = getattr(ai_function_patch, key)

        ai_function = AIFunction(**ai_function_dump)

        # delete eval for prompts if any of the fields output_schema, assert, test_cases, providers change
        if any(
            [
                ai_function_patch.output_schema is not None,
                ai_function_patch.assertions is not None,
                ai_function_patch.test_cases is not None,
                ai_function_patch.providers is not None,
            ]
        ):
            await self.prompts.update_many(
                {"ai_function_id": ai_function.id}, {"$set": {"evals": None}}
            )

        # set revision_required to true if input variables change
        if ai_function_patch.input_variables is not None:
            ai_function.implemented = False
            await self.prompts.update_many(
                {"ai_function_id": ai_function.id},
                {"$set": {"revision_required": True}},
            )

        # update ai function
        await self.ai_functions.update_one(
            {"_id": ai_function.id},
            {"$set": ai_function_patch.model_dump(exclude_none=True, by_alias=True)},
        )

        return ai_function

    async def patch_project(
        self, project: Project, project_patch: ProjectPatchInput
    ) -> Project | None:
        # check if project with new name exists
        if project.name:
            query = await self.projects.find_one(
                {"_id": {"$ne": project.id}, "name": project_patch.name}
            )
            if query:
                return None

        # check if project with new path segment name
        if project.name:
            query = await self.projects.find_one(
                {
                    "_id": {"$ne": project.id},
                    "path_segment_name": project_patch.path_segment_name,
                }
            )
            if query:
                return None

        project_dump = project.model_dump(by_alias=True)
        for key in project_patch.model_dump(exclude_none=True):
            project_dump[key] = getattr(project_patch, key)

        project = Project(**project_dump)

        # update project
        await self.projects.update_one(
            {"_id": project.id},
            {"$set": project_patch.model_dump(exclude_none=True, by_alias=True)},
        )

        return project

    async def post_eval(
        self, eval_mapping: Dict[Provider, EvaluateSummary], prompt_id: str
    ):
        eval_mapping_dump = {}
        for provider in eval_mapping:
            eval_mapping_dump[provider] = eval_mapping[provider].model_dump(
                by_alias=True
            )
        await self.prompts.update_one(
            {"_id": prompt_id},
            {"$set": {"evals": eval_mapping_dump}},
        )

    async def get_prompts_by_ai_function_id(self, ai_function_id: str) -> List[Prompt]:
        prompt_coll = self.db.get_collection("prompts")

        prompts_cursor = prompt_coll.find({"ai_function_id": ai_function_id})

        prompt_dumps: List[Document] = await cursor_to_list(prompts_cursor)

        prompts: List[Prompt] = []
        for prompt_dump in prompt_dumps:
            prompts.append(Prompt(**prompt_dump))

        return prompts

    async def get_all_prompts(self, username: str) -> List[Prompt]:
        prompt_coll = self.db.get_collection("prompts")
        prompts_cursor = prompt_coll.find({"username": username})

        prompt_dumps: List[Document] = await cursor_to_list(prompts_cursor)

        prompts: List[Prompt] = []
        for prompt_dump in prompt_dumps:
            prompts.append(Prompt(**prompt_dump))

        return prompts

    async def get_sort_query_by_tag(self, tag: PromptTag | None = "highest score") -> Tuple[str, int]:
        if tag == "highest score":
            sort_field = "average_score"
            sort_order = -1
        elif tag == "cheapest":
            sort_field = "average_cost"
            sort_order = 1
        else:
            sort_field = "average_latency"
            sort_order = 1
        return sort_field, sort_order

    async def get_prompt_by_tag_and_provider(
        self,
        ai_function_id: str,
        provider: Provider,
        tag: PromptTag | None = "highest score",
    ) -> Prompt | None:
        match_query = {"$match": {"ai_function_id": ai_function_id}}
        project_query = {
            "$addFields": {
                "results": {
                    "$getField": {
                        "field": "results",
                        "input": {
                            "$getField": {
                                "field": provider.value,  # Dynamically access the provider field
                                "input": "$evals",
                            }
                        },
                    }
                }
            }
        }

        aggregate_query = {
            "$addFields": {
                "average_score": {"$avg": "$results.score"},
                "average_latency": {"$avg": "$results.latencyMs"},
                "average_cost": {"$avg": "$results.cost"},
            }
        }

        if tag == "highest score":
            sort_query = {"$sort": {"average_score": -1}}
        elif tag == "cheapest":
            sort_query = {"$sort": {"average_cost": 1}}
        else:
            sort_query = {"$sort": {"average_latency": 1}}

        pipeline = [
            match_query,
            project_query,
            aggregate_query,
            sort_query,
            {
                # Stage 4: Limit the result to the top document
                "$limit": 1
            },
        ]
        results_cursor: AsyncIOMotorCommandCursor[Document] = self.prompts.aggregate(
            pipeline
        )
        results = await cursor_to_list(results_cursor)
        if len(results) > 0:
            return Prompt(**results[0])
        return None

    async def get_prompt_by_tag(
        self, ai_function_id: str, tag: PromptTag | None = "highest score"
    ) -> Tuple[Prompt, Provider] | None:
        sort_field, sort_order = await self.get_sort_query_by_tag(tag)

        pipeline = [
            # match prompts by ai_function_id
            {"$match": {"ai_function_id": ai_function_id}},
            # unpack evals as array
            {"$addFields": {"evals_array": {"$objectToArray": "$evals"}}},
            {
                "$addFields": {
                    "evals_array": {
                        "$map": {
                            "input": "$evals_array",
                            "as": "provider",
                            "in": {
                                "provider_name": "$$provider.k",
                                "average_score": {"$avg": "$$provider.v.results.score"},
                                "average_latency": {
                                    "$avg": "$$provider.v.results.latencyMs"
                                },
                                "average_cost": {"$avg": "$$provider.v.results.cost"},
                            },
                        }
                    }
                }
            },
            {
                "$addFields": {
                    "sorted_evals": {
                        "$sortArray": {
                            "input": "$evals_array",
                            "sortBy": {sort_field: sort_order},
                        }
                    }
                }
            },
            # Stage 5: Assign 'chosen_provider' as the first element in 'sorted_evals'
            {"$addFields": {"chosen_provider": {"$arrayElemAt": ["$sorted_evals", 0]}}},
            {"$sort": {f"chosen_provider.{sort_field}": sort_order}},
            {"$limit": 1},
        ]
        results_cursor: AsyncIOMotorCommandCursor[Document] = self.prompts.aggregate(
            pipeline
        )
        results = await cursor_to_list(results_cursor)

        if len(results) > 0:
            provider_name = results[0]["chosen_provider"]["provider_name"]
            return Prompt(**results[0]), provider_name

        return None


    async def get_provider_by_tag(self, prompt_id: str, tag: PromptTag | None = "highest score") -> Provider | None:
        sort_field, sort_order = await self.get_sort_query_by_tag(tag)
        pipeline = [
            {"$match": {"_id": prompt_id}},
            # unpack evals as array
            {"$addFields": {"evals_array": {"$objectToArray": "$evals"}}},
            {
                "$addFields": {
                    "evals_array": {
                        "$map": {
                            "input": "$evals_array",
                            "as": "provider",
                            "in": {
                                "provider_name": "$$provider.k",
                                "average_score": {"$avg": "$$provider.v.results.score"},
                                "average_latency": {
                                    "$avg": "$$provider.v.results.latencyMs"
                                },
                                "average_cost": {"$avg": "$$provider.v.results.cost"},
                            },
                        }
                    }
                }
            },
            {
                "$addFields": {
                    "sorted_evals": {
                        "$sortArray": {
                            "input": "$evals_array",
                            "sortBy": {sort_field: sort_order},
                        }
                    }
                }
            },
            # Stage 5: Assign 'chosen_provider' as the first element in 'sorted_evals'
            {"$addFields": {"chosen_provider": {"$arrayElemAt": ["$sorted_evals", 0]}}}]

        results_cursor: AsyncIOMotorCommandCursor[Document] = self.prompts.aggregate(pipeline)
        results = await cursor_to_list(results_cursor)
        if len(results) > 0:
            provider_name = results[0]["chosen_provider"]["provider_name"]
            return provider_name
        return None


async def get_client() -> AsyncGenerator[AsyncIOMotorClient[Document], None]:
    uri = os.environ.get("MONGO_CON_STRING")
    client: AsyncIOMotorClient[Document] = AsyncIOMotorClient(uri)
    try:
        yield client
    finally:
        client.close()


async def get_db(client: AsyncIOMotorClient[Document] = Depends(get_client)):
    db = DB(client)
    return db
