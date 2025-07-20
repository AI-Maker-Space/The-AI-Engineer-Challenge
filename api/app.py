# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
import io
import tempfile
import uuid
from typing import Optional, Dict, List
import asyncio

# Import aimakerspace components
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from aimakerspace.text_utils import PDFLoader, CharacterTextSplitter
from aimakerspace.vectordatabase import VectorDatabase
from aimakerspace.openai_utils.chatmodel import ChatOpenAI
from aimakerspace.openai_utils.prompts import SystemRolePrompt, UserRolePrompt

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

# Define the data model for RAG chat requests
class RAGChatRequest(BaseModel):
    user_message: str      # Message from the user
    pdf_id: str           # ID of the uploaded PDF to chat with
    api_key: str          # OpenAI API key for authentication
    model: Optional[str] = "gpt-4o-mini"  # Optional model selection with default

# Global storage for PDF documents and their vector databases
pdf_documents: Dict[str, Dict] = {}

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        print('GOT API REQUEST')
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

# Define the PDF upload endpoint for RAG system
@app.post("/api/upload-pdf-rag")
async def upload_pdf_rag(file: UploadFile = File(...)):
    """
    Upload and process a PDF file for RAG system.
    Returns the PDF ID and processing status.
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Generate unique ID for the PDF
        pdf_id = str(uuid.uuid4())
        
        # Read the uploaded file
        content = await file.read()
        
        # Save to temporary file for processing
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Load and process the PDF
            pdf_loader = PDFLoader(temp_file_path)
            documents = pdf_loader.load_documents()
            
            if not documents:
                raise HTTPException(status_code=400, detail="No text content found in PDF")
            
            # Split text into chunks
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = text_splitter.split_texts(documents)
            
            # Create vector database
            vector_db = VectorDatabase()
            await vector_db.abuild_from_list(chunks)
            
            # Store the processed data
            pdf_documents[pdf_id] = {
                "filename": file.filename,
                "chunks": chunks,
                "vector_db": vector_db,
                "document_count": len(chunks)
            }
            
            return JSONResponse(content={
                "pdf_id": pdf_id,
                "filename": file.filename,
                "chunks": len(chunks),
                "message": "PDF processed and indexed successfully"
            })
            
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# Define the RAG chat endpoint
@app.post("/api/chat-rag")
async def chat_rag(request: RAGChatRequest):
    """
    Chat with a PDF using RAG system.
    """
    try:
        # Check if PDF exists
        if request.pdf_id not in pdf_documents:
            raise HTTPException(status_code=404, detail="PDF not found")
        
        pdf_data = pdf_documents[request.pdf_id]
        vector_db = pdf_data["vector_db"]
        
        # Search for relevant chunks
        relevant_chunks = vector_db.search_by_text(
            request.user_message, 
            k=3, 
            return_as_text=True
        )
        
        # Create context from relevant chunks
        context = "\n\n".join(relevant_chunks)
        
        # Create system prompt for RAG
        system_prompt = SystemRolePrompt(
            "You are a helpful job interview AI assistant that helps people best prepare for their interviews. "
            "Use only the information from the context to answer questions. "
            "If the answer cannot be found in the context, say so. "
            "Always cite specific parts of the document when possible.\n\n"
            "Document Context:\n{context}"
        )
        
        # Create user prompt
        user_prompt = UserRolePrompt("Question: {question}")
        
        # Prepare messages for chat
        messages = [
            system_prompt.create_message(context=context),
            user_prompt.create_message(question=request.user_message)
        ]
        
        # Initialize chat model
        chat_model = ChatOpenAI(model_name=request.model or "gpt-4o-mini")
        
        # Create async generator for streaming response
        async def generate():
            async for chunk in chat_model.astream(messages):
                yield chunk

        return StreamingResponse(generate(), media_type="text/plain")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in RAG chat: {str(e)}")

# Define endpoint to list uploaded PDFs
@app.get("/api/pdfs")
async def list_pdfs():
    """
    List all uploaded PDFs with their metadata.
    """
    pdf_list = []
    for pdf_id, data in pdf_documents.items():
        pdf_list.append({
            "pdf_id": pdf_id,
            "filename": data["filename"],
            "chunks": data["document_count"]
        })
    
    return JSONResponse(content={"pdfs": pdf_list})

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
