# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a streaming chat interface using OpenAI's API.

## Prerequisites

- [`uv`](https://github.com/astral-sh/uv) package manager (`pip install uv`)
- `uv` will provision Python 3.11 automatically for this project, so no separate interpreter installation is required
- An OpenAI API key available as the `OPENAI_API_KEY` environment variable when you run the server

## Setup

All commands below assume you are running them from the repository root.

1. Install dependencies into a local virtual environment managed by `uv`:

```bash
uv sync
```

2. (Optional) Activate the virtual environment if you prefer to run commands manually:

```bash
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

`uv` will create the `.venv` directory automatically on first sync and download Python 3.11 if it's not already available.

## Running the Server

Start the FastAPI app with the dependencies managed by `uv`:

```bash
uv run python api/app.py
```

This runs the app with `uvicorn` on `http://localhost:8000`. To enable autoreload during development, use:

```bash
uv run uvicorn api.app:app --reload
```

Both commands assume the `OPENAI_API_KEY` environment variable is set in the shell that launches the server.

## API Endpoints

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
