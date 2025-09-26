# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a streaming chat interface using OpenAI's API.

## Prerequisites

- Python 3.13 or higher (matches `pyproject.toml`)
- `uv` package manager (`pipx install uv` or `pip install uv`)
- An OpenAI API key

## Setup

1. From the repository root (NOT this `api` directory), create and activate a root `.venv` with `uv`:

```bash
cd ..  # ensure you're at repo root
uv venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

2. Install dependencies defined in `pyproject.toml` at the root:

```bash
uv sync
```

## Running the Server

1. Ensure your root `.venv` is active and you're at the repository root:

```bash
source .venv/bin/activate
```

2. Start the server (from repo root) using `uv` to respect the root `.venv`:

```bash
uv run python api/app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Chat Endpoint

- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:

```json
{
  "developer_message": "string",
  "user_message": "string",
  "model": "gpt-4.1-mini", // optional
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
