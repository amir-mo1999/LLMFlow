import os
from typing import Any, Dict, List, Literal, Union

from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

from App.models import (
    AIFunction,
    AIFunctionPatchInput,
    EvaluateSummary,
    Prompt,
    PromptMessage,
    User,
)

Collection = Literal["ai-functions", "prompts", "users"]
Object = Union[AIFunction, Prompt, User]


class DB:
    def __init__(self, client: AsyncIOMotorClient):
        self.db = client["prompt-broker"]
        self.length = 100000000

        self.prompts = self.get_collection("prompts")
        self.ai_functions = self.get_collection("ai-functions")
        self.users = self.get_collection("users")

    def get_collection(self, collection: Collection) -> AsyncIOMotorCollection:
        return self.db.get_collection(collection)

    async def get_all(self, collection: Collection, username: str) -> List[Any]:
        docs = self.users.find({"username": username})
        docs = await docs.to_list(self.length)
        return docs

    async def get_by_id_and_username(
        self, collection: Collection, object_id: str, username: str
    ):
        doc = await self.get_collection(collection).find_one(
            {"_id": object_id, "username": username}
        )
        return doc

    async def insert(
        self,
        document: Object,
        collection: Collection,
        compare_fields: List[str] = [],
        additional_data: Dict[Any, Any] = {},
    ) -> bool:
        coll = self.get_collection(collection)

        # always exclude the id field
        if "_id" in compare_fields:
            compare_fields.remove("_id")
        if "id" in compare_fields:
            compare_fields.remove("id")

        # get values of to be inserted items
        query = {}
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
        prompt_id: str,
        messages: List[PromptMessage],
    ) -> Prompt | None:
        messages = [message.model_dump(by_alias=True) for message in messages]
        await self.prompts.update_one(
            {"_id": prompt_id}, {"$set": {"messages": messages, "last_eval": None}}
        )

    async def increment_prompt_count(
        self, ai_function_id: str, increment_value: int = 1
    ):
        await self.ai_functions.update_one(
            {"_id": ai_function_id}, {"$inc": {"number_of_prompts": increment_value}}
        )

    async def delete(self, document_id, collection: Collection) -> bool:
        # get collection
        collection = self.get_collection(collection)

        # delete document
        await collection.delete_one({"_id": document_id})

        # if the document was an ai function, also delete all prompts for that ai function
        if collection.name == "ai-functions":
            collection = self.get_collection("prompts")
            await collection.delete_many({"ai_function_id": document_id})

        return True

    async def get_all_ai_functions(self, username: str) -> Dict[str, AIFunction]:
        ai_functions = await self.get_all("ai-functions", username)
        ai_function_objects = {}

        for ai_function in ai_functions:
            ai_function = AIFunction(**ai_function)
            ai_function_objects[ai_function.id] = ai_function

        return ai_function_objects

    async def get_user(self, username: str) -> User | None:
        user = await self.users.find_one({"username": username})
        if user is None:
            return None

        user = User(**user)
        return user

    async def get_ai_function_by_id(
        self,
        ai_function_id: str,
        username: str,
    ) -> AIFunction | None:
        ai_function = await self.get_by_id_and_username(
            "ai-functions", ai_function_id, username
        )

        if ai_function is None:
            return None

        return AIFunction(**ai_function)

    async def get_prompt_by_id(self, prompt_id: str, username: str) -> Prompt | None:
        prompt = await self.get_by_id_and_username("prompts", prompt_id, username)

        if prompt is None:
            return None

        return Prompt(**prompt)

    async def patch_ai_function(
        self, ai_function: AIFunction, ai_function_patch: AIFunctionPatchInput
    ) -> AIFunction:
        ai_function = ai_function.copy(
            update=ai_function_patch.model_dump(exclude_none=True, by_alias=True)
        )

        # delete eval for prompts if any of the fields output_schema, assert, test_cases change
        if any(
            [
                ai_function_patch.output_schema is not None,
                ai_function_patch.assertions is not None,
                ai_function_patch.test_cases is not None,
            ]
        ):
            await self.prompts.update_many(
                {"ai_function_id": ai_function.id}, {"$set": {"last_eval": None}}
            )

        # update ai function
        await self.ai_functions.update_one(
            {"_id": ai_function.id},
            {"$set": ai_function_patch.model_dump(exclude_none=True, by_alias=True)},
        )

        return ai_function

    async def post_eval(self, eval_summary: EvaluateSummary, prompt_id: str):
        prompt_coll = self.get_collection("prompts")

        await self.prompts.update_one(
            {"_id": prompt_id},
            {"$set": {"last_eval": eval_summary.model_dump(by_alias=True)}},
        )

    async def get_prompts_by_ai_function_id(self, ai_function_id: str) -> List[Prompt]:
        prompt_coll = self.db.get_collection("prompts")

        prompts_cursor = prompt_coll.find({"ai_function_id": ai_function_id})

        prompt_dumps = await prompts_cursor.to_list(self.length)

        prompts = []
        for prompt_dump in prompt_dumps:
            prompts.append(Prompt(**prompt_dump))

        return prompts

    async def get_all_prompts(self, username: str) -> List[Prompt]:
        prompt_coll = self.db.get_collection("prompts")
        prompts_cursor = prompt_coll.find({"username": username})

        prompt_dumps = await prompts_cursor.to_list(self.length)

        prompts = []
        for prompt_dump in prompt_dumps:
            prompts.append(Prompt(**prompt_dump))

        return prompts


async def get_client():
    uri = os.environ.get("MONGO_CON_STRING")
    client = AsyncIOMotorClient(uri)
    try:
        yield client
    finally:
        client.close()


async def get_db(client: AsyncIOMotorClient = Depends(get_client)):
    db = DB(client)
    return db
