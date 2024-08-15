import hashlib


def calculate_file_hash(file_content):
    hash_obj = hashlib.sha256()
    hash_obj.update(file_content)
    return hash_obj.hexdigest()
