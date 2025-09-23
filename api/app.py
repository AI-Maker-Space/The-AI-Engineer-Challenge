# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
import time
import json
from typing import Optional
from fastapi.responses import StreamingResponse
import PyPDF2
import io
import numpy as np
from typing import List, Dict, Any

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Import the PDF auto-loader
# from startup_pdf_loader import initialize_pdf_rag_system  # Commented out - file doesn't exist

# File-based storage for user conversations (persists across serverless function calls)
CONVERSATIONS_FILE = "/tmp/conversations.json"
RAG_INDEX_FILE = "/tmp/rag_index.json"

# RAG Class Definition (inlined to avoid import issues in serverless)
class RAG:
    """Simple RAG implementation using OpenAI embeddings and chat completions"""
    
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.documents = []
        self.embeddings = []
    
    def add_document(self, text: str, metadata: Dict = None):
        """Add a document to the RAG system with optional metadata"""
        # Split text into chunks
        chunks = self._split_text(text)
        
        # Add chunks with metadata
        for chunk in chunks:
            doc_entry = {
                "text": chunk,
                "metadata": metadata or {}
            }
            self.documents.append(doc_entry)
            
            # Generate embeddings for chunks
            embedding = self._get_embedding(chunk)
            self.embeddings.append(embedding)
    
    def _split_text(self, text: str, chunk_size: int = 1000) -> List[str]:
        """Split text into chunks"""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
        return chunks
    
    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using OpenAI"""
        try:
            response = self.client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return [0.0] * 1536  # Default embedding size
    
    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        a = np.array(a)
        b = np.array(b)
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    
    def query(self, question: str) -> str:
        """Query the RAG system"""
        if not self.documents:
            return "No documents have been added to the RAG system yet."
        
        # Get embedding for the question
        question_embedding = self._get_embedding(question)
        
        # Find most similar documents
        similarities = []
        for i, doc_embedding in enumerate(self.embeddings):
            similarity = self._cosine_similarity(question_embedding, doc_embedding)
            similarities.append((i, similarity))
        
        # Sort by similarity and get top 3
        similarities.sort(key=lambda x: x[1], reverse=True)
        top_docs = [self.documents[i] for i, _ in similarities[:3]]
        
        # Create context from top documents (extract text from document entries)
        context_texts = []
        for doc in top_docs:
            if isinstance(doc, dict):
                context_texts.append(doc["text"])
            else:
                context_texts.append(str(doc))
        context = "\n\n".join(context_texts)
        
        # Generate response using OpenAI
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": f"You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the answer cannot be found in the context, say 'I cannot find the answer in the provided documents.'\n\nContext:\n{context}"
                    },
                    {"role": "user", "content": question}
                ],
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating response: {str(e)}"

# Global RAG instance
rag_system = None

@app.on_event("startup")
async def startup_event():
    """Initialize RAG system with Grade-3 PDFs on startup"""
    global rag_system
    
    print("🚀 FastAPI server starting up...")
    print("📚 RAG system will be initialized when first API key is provided")
    print("💡 Grade-3 PDFs will auto-upload on first RAG system use")
    
    # Note: RAG system initialization is deferred until we have an API key
    # This will happen automatically on first /api/rag-chat or /api/upload-pdf request

def load_conversations():
    """Load conversations from file"""
    try:
        if os.path.exists(CONVERSATIONS_FILE):
            with open(CONVERSATIONS_FILE, 'r') as f:
                return json.load(f)
    except Exception:
        pass
    return {}

def save_conversations(conversations):
    """Save conversations to file"""
    try:
        with open(CONVERSATIONS_FILE, 'w') as f:
            json.dump(conversations, f)
    except Exception:
        pass

def extract_text_from_pdf(pdf_file: UploadFile) -> str:
    """Extract text content from uploaded PDF file"""
    try:
        # Read the PDF file content
        pdf_content = pdf_file.file.read()
        pdf_file.file.seek(0)  # Reset file pointer
        
        # Create a PDF reader object
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extract text from all pages
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(e)}")

async def initialize_rag_system(api_key: str):
    """Initialize the RAG system with OpenAI API key and auto-load PDFs"""
    global rag_system
    try:
        if rag_system is None:
            print("🔄 Initializing RAG system...")
            rag_system = RAG(api_key=api_key)
            
            # Try to load existing RAG index
            loaded_rag = load_rag_index(api_key)
            if loaded_rag and len(loaded_rag.documents) > 0:
                rag_system = loaded_rag
                print(f"✅ RAG system loaded from index with {len(rag_system.documents)} documents")
            else:
                # Auto-upload Grade-3 PDFs if no existing index
                print("📚 No existing RAG index found, but auto-initialization is disabled")
                # await initialize_pdf_rag_system(rag_system)  # Commented out - function doesn't exist
                # save_rag_index(rag_system)
                print("ℹ️  RAG system will start empty - upload PDFs manually via /api/upload-pdf")
                
        return rag_system
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing RAG system: {str(e)}")

def load_rag_index():
    """Load RAG index from file"""
    try:
        if os.path.exists(RAG_INDEX_FILE):
            with open(RAG_INDEX_FILE, 'r') as f:
                return json.load(f)
    except Exception:
        pass
    return {}

def save_rag_index(index_data):
    """Save RAG index to file"""
    try:
        with open(RAG_INDEX_FILE, 'w') as f:
            json.dump(index_data, f)
    except Exception:
        pass

# Load existing conversations
user_conversations = load_conversations()

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
    user_id: str          # User identifier for tracking

class RAGChatRequest(BaseModel):
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication
    user_id: str          # User identifier for tracking

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Load fresh conversations (in case another function instance updated them)
        user_conversations = load_conversations()
        
        # Get or create conversation history for this user
        if request.user_id not in user_conversations:
            user_conversations[request.user_id] = []
        
        # Add the new user message to conversation history
        user_conversations[request.user_id].append({
            "role": "user", 
            "content": request.user_message,
            "timestamp": str(time.time())
        })
        
        # Save conversations immediately
        save_conversations(user_conversations)
        
        # Prepare messages for OpenAI (system + conversation history)
        messages = [{"role": "system", "content": "You are a helpful AI assistant. Always provide clear, accurate, and well-structured responses. When explaining concepts, use simple language and relatable examples. When summarizing, capture all key points concisely. When writing creatively, be imaginative and engaging. When solving problems, show your reasoning step-by-step. When rewriting text, maintain professional tone and correct all errors."}]
        messages.extend(user_conversations[request.user_id][-10:])  # Keep last 10 messages
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=messages,
                stream=True  # Enable streaming response
            )
            
            # Collect the full response for storage
            full_response = ""
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content
            
            # Store the AI response in conversation history
            user_conversations[request.user_id].append({
                "role": "assistant", 
                "content": full_response,
                "timestamp": str(time.time())
            })
            
            # Save conversations after AI response
            save_conversations(user_conversations)

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Get user conversation history
@app.get("/api/conversations/{user_id}")
async def get_conversations(user_id: str):
    # Load fresh conversations
    conversations = load_conversations()
    
    if user_id not in conversations:
        return {"conversations": [], "message": "No conversations found for this user"}
    
    return {
        "user_id": user_id,
        "conversations": conversations[user_id],
        "total_messages": len(conversations[user_id])
    }

# PDF Upload endpoint
@app.post("/api/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    api_key: str = Form(...),
    user_id: str = Form(...)
):
    """Upload and index a PDF file for RAG"""
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file)
        
        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="No text content found in PDF")
        
        # Initialize RAG system
        rag = await initialize_rag_system(api_key)
        
        # Index the PDF content
        rag.add_document(pdf_text)
        
        # Save the index
        index_data = load_rag_index()
        index_data[user_id] = {
            "filename": file.filename,
            "upload_time": str(time.time()),
            "text_length": len(pdf_text)
        }
        save_rag_index(index_data)
        
        return {
            "message": "PDF uploaded and indexed successfully",
            "filename": file.filename,
            "text_length": len(pdf_text),
            "user_id": user_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# RAG Chat endpoint
@app.post("/api/rag-chat")
async def rag_chat(request: RAGChatRequest):
    """Chat with the uploaded PDF using RAG"""
    try:
        # Initialize RAG system
        rag = await initialize_rag_system(request.api_key)
        
        # Load fresh conversations
        user_conversations = load_conversations()
        
        # Get or create conversation history for this user
        if request.user_id not in user_conversations:
            user_conversations[request.user_id] = []
        
        # Add the new user message to conversation history
        user_conversations[request.user_id].append({
            "role": "user", 
            "content": request.user_message,
            "timestamp": str(time.time())
        })
        
        # Save conversations immediately
        save_conversations(user_conversations)
        
        # Create an async generator function for streaming responses
        async def generate():
            try:
                # Use RAG to get context-aware response
                response = rag.query(request.user_message)
                
                # Store the AI response in conversation history
                user_conversations[request.user_id].append({
                    "role": "assistant", 
                    "content": response,
                    "timestamp": str(time.time())
                })
                
                # Save conversations after AI response
                save_conversations(user_conversations)
                
                # Yield the response
                yield response
                
            except Exception as e:
                error_msg = f"Error in RAG query: {str(e)}"
                yield error_msg

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get RAG index status
@app.get("/api/rag-status/{user_id}")
async def get_rag_status(user_id: str):
    """Get the status of RAG index for a user"""
    index_data = load_rag_index()
    
    if user_id not in index_data:
        return {
            "user_id": user_id,
            "has_index": False,
            "message": "No PDF uploaded for this user"
        }
    
    return {
        "user_id": user_id,
        "has_index": True,
        "index_info": index_data[user_id]
    }

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
