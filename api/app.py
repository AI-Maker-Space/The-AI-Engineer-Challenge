# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional

import tempfile
import shutil

import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from aimakerspace.text_utils import PDFLoader, CharacterTextSplitter
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.chatmodel import ChatOpenAI
from aimakerspace.openai_utils.embedding import EmbeddingModel


# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the developer/system
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": request.developer_message},
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
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# In-memory storage for the latest PDF's vector DB and chunks
vector_db = None
pdf_chunks = None

@app.post("/api/upload_pdf")
async def upload_pdf(file: UploadFile = File(...), api_key: str = Form(...)):
    print("/api/upload_pdf called")
    print(f"Received file: {file.filename}")
    print(f"Received api_key: {'*' * (len(api_key)-4) + api_key[-4:] if api_key else 'None'}")
    try:
        # Save uploaded PDF to a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        print(f"Saved file to temp path: {tmp_path}")

        # Load and chunk PDF
        loader = PDFLoader(tmp_path)
        documents = loader.load_documents()  # List of extracted text (usually one string)
        print(f"Loaded {len(documents)} documents from PDF")
        splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_texts(documents)
        print(f"Split into {len(chunks)} chunks")

        # Build vector DB asynchronously with correct API key
        print(f"Using api_key for vector DB: {'*' * (len(api_key)-4) + api_key[-4:] if api_key else 'None'}")
        global vector_db, pdf_chunks
        embedding_model = EmbeddingModel(api_key=api_key)
        vector_db = await VectorDatabase(embedding_model=embedding_model).abuild_from_list(chunks, batch_size=250)
        pdf_chunks = chunks
        print("Vector DB built and chunks stored in memory")

        return {"status": "success", "num_chunks": len(chunks)}
    except Exception as e:
        print(f"Exception in /api/upload_pdf: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

class PDFChatRequest(BaseModel):
    user_message: str
    k: int = 4  # Number of relevant chunks to retrieve
    api_key: str

@app.post("/api/chat_with_pdf")
async def chat_with_pdf(request: PDFChatRequest):
    try:
        global vector_db, pdf_chunks
        if vector_db is None or pdf_chunks is None:
            return JSONResponse(status_code=400, content={"error": "No PDF indexed. Please upload a PDF first."})

        # Retrieve top-k relevant chunks
        top_chunks = vector_db.search_by_text(request.user_message, k=request.k, return_as_text=True)
        context = "\n---\n".join(top_chunks)

        # Compose prompt for RAG
        system_prompt = (
            "You are an AI assistant. Use the following PDF context to answer the user's question as accurately as possible.\n"
            "If the answer is not in the context, say you don't know.\n\nContext:\n" + context
        )
        user_prompt = request.user_message

        # Use gpt-4o-mini for chat
        chat_model = ChatOpenAI(model_name="gpt-4o-mini", api_key=request.api_key)
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        async def generate():
            async for chunk in chat_model.astream(messages):
                if chunk:
                    yield chunk
        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
