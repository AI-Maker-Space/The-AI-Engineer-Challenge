# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
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
import asyncio
import json
import logging
import time
import uuid

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("api")

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


@app.middleware("http")
async def add_request_id_and_log(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.time()
    # Attach to state for downstream use
    request.state.request_id = request_id
    logger.info(
        "request_start method=%s path=%s request_id=%s",
        request.method,
        request.url.path,
        request_id,
    )
    try:
        response = await call_next(request)
        duration_ms = int((time.time() - start) * 1000)
        logger.info(
            "request_end status=%s duration_ms=%s request_id=%s",
            getattr(response, "status_code", "n/a"),
            duration_ms,
            request_id,
        )
        return response
    except Exception as e:
        duration_ms = int((time.time() - start) * 1000)
        logger.exception(
            "request_error duration_ms=%s request_id=%s error=%s",
            duration_ms,
            request_id,
            str(e),
        )
        raise

# App state for vector database instance and in-memory topics set
# Using app.state avoids module-level globals and is concurrency-safe for a single-process app
app.state.vector_db = None
app.state.topics_set = set()

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


def _extract_topics_sync(chunk_text: str, client: OpenAI) -> List[str]:
    """Blocking helper that calls OpenAI to extract topics for a single chunk.

    Returns a list of concise topic labels (strings). Falls back to an empty list
    if the model output cannot be parsed as JSON.
    """
    system_msg = (
        "You extract concise topic labels from provided text. "
        "Return ONLY a JSON array of 1-5 short noun-phrase topics."
    )
    user_msg = (
        "Text chunk:\n" + chunk_text[:6000]
    )
    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        temperature=0,
    )
    content = resp.choices[0].message.content if resp.choices else "[]"
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            # Normalize topics: strip, lowercase, and remove empties
            return [t.strip() for t in parsed if isinstance(t, str) and t.strip()]
    except Exception:
        pass
    return []


async def extract_topics_for_chunks(chunks: List[str], client: OpenAI, concurrency_limit: int = 5) -> List[str]:
    """Extract topics for each chunk concurrently with a semaphore limit.

    Aggregates topics into a unique, sorted list.
    """
    semaphore = asyncio.Semaphore(concurrency_limit)

    async def run_for_chunk(chunk: str) -> List[str]:
        async with semaphore:
            return await asyncio.to_thread(_extract_topics_sync, chunk, client)

    tasks = [run_for_chunk(chunk) for chunk in chunks]
    all_results = await asyncio.gather(*tasks)

    unique_topics: Set[str] = set()
    for topic_list in all_results:
        for topic in topic_list:
            normalized = topic.strip()
            if normalized:
                unique_topics.add(normalized)

    return sorted(unique_topics)

@app.post("/api/upload-pdf")
async def upload_pdf(request: Request, file: UploadFile = File(...), api_key: str = None):
    if not api_key:
        raise HTTPException(status_code=400, detail="API key is required")
    
    try:
        # Read the PDF file
        logger.info("upload_pdf_read_file request_id=%s filename=%s", request.state.request_id, file.filename)
        contents = await file.read()
        
        # Extract text from PDF
        text_chunks = extract_text_from_pdf(contents)
        logger.info(
            "upload_pdf_extracted_chunks request_id=%s chunks=%s",
            request.state.request_id,
            len(text_chunks),
        )
        
        if not text_chunks:
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Initialize vector database with the chunks
        os.environ["OPENAI_API_KEY"] = api_key
        app.state.vector_db = VectorDatabase()
        await app.state.vector_db.abuild_from_list(text_chunks)
        logger.info(
            "upload_pdf_built_vector_db request_id=%s vectors=%s",
            request.state.request_id,
            len(getattr(app.state.vector_db, "vectors", [])),
        )
        
        # Extract hierarchical topics from each chunk and aggregate
        client = OpenAI(api_key=api_key)
        topics_list = await extract_topics_for_chunks(text_chunks, client)
        app.state.topics_set = set(topics_list)
        logger.info(
            "upload_pdf_extracted_topics request_id=%s topics=%s",
            request.state.request_id,
            len(topics_list),
        )
        
        return {
            "message": "PDF processed successfully",
            "chunk_count": len(text_chunks),
            "topics": topics_list,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if not app.state.vector_db or not app.state.vector_db.vectors:
            raise HTTPException(status_code=400, detail="No PDF has been uploaded yet. Please upload a PDF first.")

        # Get relevant chunks from the vector database
        relevant_chunks = app.state.vector_db.search_by_text(
            request.user_message,
            k=3,
            return_as_text=True
        )
        logger.info("chat_retrieved_chunks k=%s retrieved=%s", 3, len(relevant_chunks))

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
