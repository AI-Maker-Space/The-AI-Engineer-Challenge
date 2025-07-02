import sys
import os
import numpy as np
from typing import List, Tuple, Dict, Any
import asyncio

# Add the aimakerspace library to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'aimakerspace'))

from vectordatabase import VectorDatabase
from openai_utils.embedding import EmbeddingModel


class DocumentVectorStore:
    def __init__(self):
        self.embedding_model = EmbeddingModel()
        self.vector_db = VectorDatabase(self.embedding_model)
        self.document_chunks: Dict[str, List[Dict[str, Any]]] = {}
        self.document_metadata: Dict[str, Dict[str, Any]] = {}

    def add_document(self, document_id: str, chunks: List[str], metadata: Dict[str, Any]):
        """Add document chunks to the vector store"""
        # Store metadata
        self.document_metadata[document_id] = metadata

        # Create chunk metadata
        chunk_metadata = []
        for i, chunk in enumerate(chunks):
            chunk_key = f"{document_id}_chunk_{i}"
            chunk_metadata.append({
                "document_id": document_id,
                "chunk_index": i,
                "content": chunk,
                "page": metadata.get("page", 1)
            })

        # Store chunks
        self.document_chunks[document_id] = chunk_metadata

        # Add to vector database
        for i, chunk in enumerate(chunks):
            chunk_key = f"{document_id}_chunk_{i}"
            embedding = self.embedding_model.get_embedding(chunk)
            self.vector_db.insert(chunk_key, np.array(embedding))

    async def search_document(self, document_id: str, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """Search for relevant chunks in a specific document"""
        if document_id not in self.document_chunks:
            return []

        # Get all chunk keys for this document
        document_chunk_keys = [f"{document_id}_chunk_{i}" for i in range(len(self.document_chunks[document_id]))]

        # Search in vector database
        results = self.vector_db.search_by_text(query, k=k)

        # Filter results to only include chunks from this document
        filtered_results = []
        for chunk_key, score in results:
            if chunk_key in document_chunk_keys:
                # Extract chunk index from key
                chunk_index = int(chunk_key.split("_")[-1])
                chunk_data = self.document_chunks[document_id][chunk_index]
                chunk_data["similarity_score"] = score
                filtered_results.append(chunk_data)

        return filtered_results

    def remove_document(self, document_id: str):
        """Remove document from vector store"""
        if document_id in self.document_chunks:
            # Remove chunks from vector database
            for i in range(len(self.document_chunks[document_id])):
                chunk_key = f"{document_id}_chunk_{i}"
                if chunk_key in self.vector_db.vectors:
                    del self.vector_db.vectors[chunk_key]

            # Remove from local storage
            del self.document_chunks[document_id]
            del self.document_metadata[document_id]

    def get_document_metadata(self, document_id: str) -> Dict[str, Any]:
        """Get document metadata"""
        return self.document_metadata.get(document_id, {})

    def list_documents(self) -> List[str]:
        """List all document IDs"""
        return list(self.document_metadata.keys())

    def get_document_chunks_count(self, document_id: str) -> int:
        """Get number of chunks for a document"""
        return len(self.document_chunks.get(document_id, []))


# Global vector store instance
vector_store = DocumentVectorStore()