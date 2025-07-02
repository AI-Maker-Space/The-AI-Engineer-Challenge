from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    developer_message: str
    user_message: str
    model: Optional[str] = "gpt-4o-mini"
    api_key: str
    document_id: Optional[str] = None  # For RAG chat


class RagChatRequest(BaseModel):
    user_message: str
    model: Optional[str] = "gpt-4o-mini"
    api_key: str
    document_id: str
    k_chunks: Optional[int] = 3  # Number of chunks to retrieve


class ChatResponse(BaseModel):
    success: bool
    message: str
    error: Optional[str] = None


class DocumentChunk(BaseModel):
    content: str
    page: int
    chunk_index: int
    similarity_score: float