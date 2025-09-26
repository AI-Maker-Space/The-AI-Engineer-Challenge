# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a streaming chat interface using OpenAI's API.

## Prerequisites

- Python 3.13 (managed via uv)
- uv (Python package and venv manager)
- An OpenAI API key

## Setup

1. From the project ROOT (not in `api/`), create and activate a venv with uv:
```bash
cd ..  # ensure you are at repo root
uv venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
uv pip install -e .[dev]
```

## Running the Server

1. Make sure your root venv is active and then run from the `api` directory:
```bash
cd api
```

2. Start the server:
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Upload PDF Endpoint
- **URL**: `/api/upload-pdf`
- **Method**: POST (multipart/form-data)
- **Form Fields**:
  - `file`: PDF file
  - `api_key`: OpenAI API key
- **Response**:
```json
{
  "message": "PDF processed successfully",
  "chunk_count": 12,
  "topics": ["vector databases", "tokenization", "RAG", "embeddings"]
}
```

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
```json
{
    "developer_message": "string",
    "user_message": "string",
    "model": "gpt-4.1-mini",  // optional
    "api_key": "your-openai-api-key"
}
```
- **Response**: Streaming text response

### Health Check
- **URL**: `/api/health`
- **Method**: GET
- **Response**: `{"status": "ok"}`

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CORS Configuration

The API is configured to accept requests from any origin (`*`). This can be modified in the `app.py` file if you need to restrict access to specific domains.

## Error Handling

The API includes basic error handling for:
- Invalid API keys
- OpenAI API errors
- General server errors

All errors will return a 500 status code with an error message. 