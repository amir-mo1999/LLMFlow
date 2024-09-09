import hashlib

from App.dependencies.objects import DOCUMENT_NOT_FOUND, INVALID_OBJECT_ID

responses = {
    INVALID_OBJECT_ID.status_code: {"detail": INVALID_OBJECT_ID.detail},
    DOCUMENT_NOT_FOUND.status_code: {"detail": DOCUMENT_NOT_FOUND.detail},
}


def calculate_file_hash(file_content):
    hash_obj = hashlib.sha256()
    hash_obj.update(file_content)
    return hash_obj.hexdigest()
