from fastapi import HTTPException


class DocumentNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="document not found")


class DuplicateDocument(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="the same document already exists")
