import sys
import os
from typing import List, Dict, Any, AsyncGenerator
from openai import OpenAI

# Add the aimakerspace library to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'aimakerspace'))

from openai_utils.chatmodel import ChatOpenAI
from utils.vector_store import vector_store


class RAGService:
    def __init__(self):
        self.chat_model = None

    def _initialize_chat_model(self, api_key: str, model: str = "gpt-4o-mini"):
        """Initialize chat model with API key"""
        os.environ["OPENAI_API_KEY"] = api_key
        self.chat_model = ChatOpenAI(model_name=model)

    def _build_rag_prompt(self, user_message: str, context_chunks: List[Dict[str, Any]]) -> str:
        """Build RAG prompt with context"""
        if not context_chunks:
            return f"User question: {user_message}\n\nNo relevant context found in the document."

        context_text = "\n\n".join([
            f"Context {i+1} (Page {chunk.get('page', 'N/A')}):\n{chunk['content']}"
            for i, chunk in enumerate(context_chunks)
        ])

        prompt = f"""You are a helpful assistant that answers questions based on the provided document context.
Use only the information from the context to answer the user's question. If the context doesn't contain enough information to answer the question, say so.

Document Context:
{context_text}

User Question: {user_message}

Please provide a helpful answer based on the document context:"""

        return prompt

    async def chat_with_document(
        self,
        user_message: str,
        document_id: str,
        api_key: str,
        model: str = "gpt-4o-mini",
        k_chunks: int = 3
    ) -> AsyncGenerator[str, None]:
        """Chat with document using RAG"""
        try:
            # Initialize chat model
            self._initialize_chat_model(api_key, model)

            # Search for relevant chunks
            context_chunks = await vector_store.search_document(document_id, user_message, k=k_chunks)

            # Build RAG prompt
            rag_prompt = self._build_rag_prompt(user_message, context_chunks)

            # Create messages for chat
            messages = [
                {"role": "system", "content": "You are a helpful assistant that answers questions based on document context."},
                {"role": "user", "content": rag_prompt}
            ]

            # Stream response
            async for chunk in self.chat_model.astream(messages):
                yield chunk

        except Exception as e:
            yield f"Error: {str(e)}"

    def get_document_context(self, document_id: str, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """Get relevant context from document without generating response"""
        try:
            # This would need to be async in a real implementation
            # For now, we'll return empty list and handle async properly in the main endpoint
            return []
        except Exception as e:
            return []


# Global RAG service instance
rag_service = RAGService()