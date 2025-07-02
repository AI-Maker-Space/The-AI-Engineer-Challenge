from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class DocumentBase(BaseModel):
    filename: str
    size: int
    pages: int


class DocumentCreate(DocumentBase):
    pass


class Document(DocumentBase):
    id: str
    upload_date: datetime
    chunks_count: int
    status: str  # "processing", "ready", "error"

    class Config:
        from_attributes = True


class DocumentList(BaseModel):
    documents: List[Document]


class DocumentDelete(BaseModel):
    success: bool
    message: str


class UploadResponse(BaseModel):
    success: bool
    document_id: Optional[str] = None
    message: str
    status: str