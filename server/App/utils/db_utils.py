from ..models import User
from pymongo.mongo_client import MongoClient
import os
from bson import ObjectId
import hashlib

# set up mongo client
uri = os.environ.get("MONGO_CON_STRING")
client = MongoClient(uri)
db = client["prompt-broker"]


def get_user(email: str) -> User | bool:
    """Retrieve a user data for given email from the database.

    Args:
        email (str): user email

    Returns:
        User | bool: user data or False if user is not found
    """
    # get user collection
    user_collection = db["users"]

    # Check if the user with the given email exists
    user_data = user_collection.find_one({"email": email})
    if user_data:
        # If the user exists, create a user instance and return it
        user = User(**user_data)
        return user
    else:
        return False


def calculate_file_hash(file_content):
    hash_obj = hashlib.sha256()
    hash_obj.update(file_content)
    return hash_obj.hexdigest()
