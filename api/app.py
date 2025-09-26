# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional, List, Set
import PyPDF2
import io
from aimakerspace.vectordatabase import VectorDatabase
import json

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=False,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Global vector database instance and in-memory topics store
vector_db = None
extracted_topics: Set[str] = set()

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication

def extract_text_from_pdf(pdf_file: bytes) -> List[str]:
    """Extract text from PDF and split it into chunks."""
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
    chunks = []
    
    for page in pdf_reader.pages:
        text = page.extract_text()
        # Split text into smaller chunks (simple approach - split by paragraphs)
        paragraphs = text.split('\n\n')
        chunks.extend([p.strip() for p in paragraphs if p.strip()])
    
    return chunks

async def extract_topics_for_chunk(text: str, client: OpenAI, model: str = "gpt-4.1-mini") -> List[str]:
    """Use the LLM to extract a concise list of topics from a chunk of text.

    Returns a list of topic strings. If extraction fails, returns an empty list.
    """
    try:
        system_message = (
            "You extract concise, high-signal topics."
            " Return ONLY a JSON array of 1-5 short topic strings."
            " Topics should be general (e.g., 'vector databases', 'tokenization') not quotes."
        )
        user_message = (
            "Extract up to 5 hierarchical topics that summarize the text."
            " Return only a JSON array of strings, no extra text.\n\nText:\n" + text[:4000]
        )

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            stream=False,
        )

        content = response.choices[0].message.content if response.choices else "[]"
        # Guard against non-JSON responses
        content = content.strip()
        if not content.startswith("["):
            # Try to salvage by finding the first JSON array in the string
            start_idx = content.find("[")
            end_idx = content.rfind("]")
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                content = content[start_idx : end_idx + 1]
            else:
                return []

        topics = json.loads(content)
        if isinstance(topics, list):
            # Normalize and filter
            normalized: List[str] = []
            for t in topics:
                if not isinstance(t, str):
                    continue
                topic = t.strip()
                if topic:
                    normalized.append(topic)
            return normalized
        return []
    except Exception:
        return []

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), api_key: str = None):
    if not api_key:
        raise HTTPException(status_code=400, detail="API key is required")
    
    try:
        # Read the PDF file
        contents = await file.read()
        
        # Extract text from PDF
        text_chunks = extract_text_from_pdf(contents)
        
        if not text_chunks:
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Initialize vector database with the chunks
        global vector_db, extracted_topics
        os.environ["OPENAI_API_KEY"] = api_key
        vector_db = VectorDatabase()
        await vector_db.abuild_from_list(text_chunks)
        # Reset topics for this upload
        extracted_topics = set()

        # Initialize OpenAI client for topic extraction
        client = OpenAI(api_key=api_key)

        # Extract topics per chunk (sequential to keep rate low)
        for chunk in text_chunks:
            topics = await extract_topics_for_chunk(chunk, client)
            # Deduplicate case-insensitively while preserving original
            lowercase_seen = {t.lower() for t in extracted_topics}
            for t in topics:
                if t.lower() not in lowercase_seen:
                    extracted_topics.add(t)
                    lowercase_seen.add(t.lower())
        
        return {
            "message": "PDF processed successfully",
            "chunk_count": len(text_chunks),
            "topics": sorted(extracted_topics),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if not vector_db.vectors:
            raise HTTPException(status_code=400, detail="No PDF has been uploaded yet. Please upload a PDF first.")

        # Get relevant chunks from the vector database
        relevant_chunks = vector_db.search_by_text(
            request.user_message,
            k=3,
            return_as_text=True
        )

        print(relevant_chunks)

        # Create the system message with context
        system_message = f"""You are a helpful AI assistant that answers questions based ONLY on the provided context. 
If the question cannot be answered using the context, say that you cannot answer the question with the available information.
Do not make up or infer information that is not in the context.

Context from the PDF:
{' '.join(relevant_chunks)}"""

        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": request.user_message}
                ],
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e)) from e

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
