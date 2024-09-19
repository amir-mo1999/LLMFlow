import os
from typing import Any, Dict, List, Literal, Union

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

from App.models import AIFunction, EvaluateSummary, Prompt, User

Collection = Literal["ai-functions", "prompts", "users"]
Object = Union[AIFunction, Prompt, User]


class DB:
    def __init__(self, client: AsyncIOMotorClient):
        self.db = client["prompt-broker"]
        self.length = 100000000

    def get_collection(self, collection: Collection) -> AsyncIOMotorCollection:
        return self.db.get_collection(collection)

    async def get_all(self, collection: Collection, username: str) -> List[Any]:
        docs = self.get_collection(collection).find({"username": username})
        docs = await docs.to_list(self.length)
        return docs

    async def get_by_id_and_username(
        self, collection: Collection, object_id: ObjectId | str, username: str
    ):
        if isinstance(object_id, str):
            try:
                object_id = ObjectId(object_id)
            except InvalidId:
                return None
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

    async def get_all_ai_functions(self, username: str) -> Dict[str, AIFunction]:
        ai_functions = await self.get_all("ai-functions", username)
        ai_function_objects = {}

        for ai_function in ai_functions:
            ai_function = AIFunction(**ai_function)
            ai_function_objects[ai_function.id] = ai_function

        return ai_function_objects

    async def get_user(self, username: str) -> User | None:
        user = await self.get_collection("users").find_one({"username": username})
        if user is None:
            return None

        user = User(**user)
        return user

    async def get_ai_function_by_id(
        self,
        ai_function_id: ObjectId | str,
        username: str,
    ) -> AIFunction | None:
        ai_function = await self.get_by_id_and_username(
            "ai-functions", ai_function_id, username
        )

        if ai_function is None:
            return None

        return AIFunction(**ai_function)

    async def get_prompt_by_id(
        self, prompt_id: ObjectId | str, username: str
    ) -> Prompt | None:
        prompt = await self.get_by_id_and_username("prompts", prompt_id, username)

        if prompt is None:
            return None

        return Prompt(**prompt)

    async def post_eval(self, eval_summary: EvaluateSummary, prompt_id: ObjectId | str):
        prompt_coll = self.get_collection("prompts")

        await prompt_coll.update_one(
            {"_id": prompt_id},
            {"$set": {"last_eval": eval_summary.model_dump(by_alias=True)}},
        )


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
