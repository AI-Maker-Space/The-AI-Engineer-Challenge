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
import re
from collections import Counter

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

# Global vector database instance and embedding model
vector_db = None

# Global in-memory set to store unique topics extracted from the latest uploaded PDF
topics_set: Set[str] = set()

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


def extract_topics_from_chunk(chunk: str, max_topics_per_chunk: int = 5) -> List[str]:
    """Extract likely topics from a chunk of text using a simple hierarchical approach.

    This uses a lightweight heuristic with no external dependencies:
    - Tokenize words, remove common stopwords and very short tokens
    - Score bigrams higher than unigrams to capture short phrases
    - Return top N scored terms as topics
    """

    # A compact English stopword list suitable for topic extraction without heavy deps
    STOPWORDS = {
        "the", "and", "for", "but", "not", "you", "your", "with", "from", "that",
        "this", "was", "were", "have", "has", "had", "can", "could", "should", "would",
        "into", "onto", "about", "above", "below", "under", "over", "than", "then",
        "there", "their", "they", "them", "his", "her", "its", "our", "ours", "who",
        "whom", "which", "what", "when", "where", "why", "how", "is", "am", "are",
        "be", "been", "being", "do", "does", "did", "of", "in", "on", "at", "to",
        "as", "by", "an", "a", "or", "if", "it", "we", "I", "me", "my", "mine",
        "yours", "theirs", "he", "she", "also", "may", "might", "via", "per"
    }

    # Normalize and tokenize: words of length >= 3, keep hyphenated words
    tokens = re.findall(r"[A-Za-z][A-Za-z\-']{2,}", chunk.lower())
    content_tokens = [t for t in tokens if t not in STOPWORDS]
    if not content_tokens:
        return []

    # Unigram counts
    unigram_counts = Counter(content_tokens)

    # Bigram counts (score bigrams higher to promote short phrases)
    bigrams = [f"{a} {b}" for a, b in zip(content_tokens, content_tokens[1:])]
    bigram_counts = Counter(bigrams)

    # Combine scores, weighting bigrams over unigrams
    scores = {}
    for term, count in unigram_counts.items():
        scores[term] = scores.get(term, 0) + count
    for term, count in bigram_counts.items():
        scores[term] = scores.get(term, 0) + (count * 2)

    # Sort by score, then length (prefer concise terms if scores tie)
    ranked = sorted(scores.items(), key=lambda kv: (-kv[1], len(kv[0])))

    topics: List[str] = []
    used: Set[str] = set()
    for term, _ in ranked:
        # Basic de-duplication: avoid selecting a unigram when its bigram containing it was chosen
        if any(term in t.split(" ") for t in used) and " " not in term:
            continue
        topics.append(term)
        used.add(term)
        if len(topics) >= max_topics_per_chunk:
            break

    return topics

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
        
        # Extract topics per chunk and aggregate into an in-memory set
        topics_set.clear()
        for chunk in text_chunks:
            chunk_topics = extract_topics_from_chunk(chunk, max_topics_per_chunk=5)
            topics_set.update(chunk_topics)
        
        # Initialize vector database with the chunks
        global vector_db
        os.environ["OPENAI_API_KEY"] = api_key
        vector_db = VectorDatabase()
        await vector_db.abuild_from_list(text_chunks)
        
        return {
            "message": "PDF processed successfully",
            "chunk_count": len(text_chunks),
            "topics": sorted(list(topics_set))
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
