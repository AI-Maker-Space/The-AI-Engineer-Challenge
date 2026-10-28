#  LLM Chat API Backend

This is a FastAPI-based backend service that provides a chat interface using either OpenAI or Anthropic through an OpenAI-compatible chat completions client.
The service acts as a supportive mental coach, helping users with stress, motivation, habits, and confidence.

## Prerequisites

- [`uv`](https://github.com/astral-sh/uv) package manager (`pip install uv` if you want to install it via python pip default). Otherwise, [Astral](https://docs.astral.sh/uv/getting-started/installation/) provides comprehensive documentation on how to install it directly on your machine.  
- `uv` will provision Python 3.13.2 automatically for this challenge, as defined in `.python-version` so no separate interpreter installation is required. You can change your python version up to pyhon 3.14.x. At this time, Vercel supports 3.12 | 3.13 | 3.14. `pyproject.toml` defines the accepted python version range for this project.
- This challenge supports either OpenAI / Anthropic as LLM providers. More on how to set up your provider bellow:
  - To set this up:
    - ```bash
      cp .env.example .env
      ```
    - Default values are provided in the `.env` file. Update the respective fields to match your choice. 
    - Specify which LLM provider you want to use in the `LLM_PROVIDER`. Supported values: `openai | anthropic`. Choose one only.
    - If OpenAI: Provide a valid API key: `OPENAI_API_KEY` and the model you want to use in `OPENAI_MODEL`.
    - If Anthropic: Provide a valid API key: `ANTHROPIC_API_KEY` and the model you want to use in `ANTHROPIC_MODEL`.

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

`uv` will create the `.venv` directory automatically on the first sync and download Python 3.13 if it's not already available.

## Running the Server

Start the FastAPI app with the dependencies managed by `uv`:

```bash
uv run uvicorn api.index:app --reload
```

This runs the app with `uvicorn` on `http://localhost:8000` with auto-reload enabled for development. The server will automatically restart when you make changes to the code.

If you encounter an "Address already in use" error, you may need to kill existing processes on port 8000:

```bash
lsof -ti:8000 | xargs kill -9
```

## API Endpoints

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
```json
{
    "message": "string"
}
```
- **Response**: JSON object with the AI's reply:
```json
{
    "reply": "string"
}
```

The chat endpoint uses the configured provider and model from your environment variables, along with a supportive mental coach system prompt.

### Root Endpoint
- **URL**: `/`
- **Method**: GET
- **Response**: `{"status": "ok"}`

### Health Check
- **URL**: `/api/health`
- **Method**: GET
- **Response**: `{"status": "ok"}`

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CORS Configuration

The API is configured to accept requests from any origin (`*`). This can be modified in the `index.py` file if you need to restrict access to specific domains.

## Error Handling

The API includes basic error handling for:

- Missing or invalid provider configuration
- Invalid provider API keys
- Provider rate limits
- Invalid requests sent to the provider
- Provider connection/API errors
- General server errors

Errors return an appropriate HTTP status code with a short message:

| Scenario                             | Status Code |
|--------------------------------------|------------:|
| Invalid provider API key             |       `401` |
| Provider rate limit exceeded         |       `429` |
| Invalid request sent to the provider |       `400` |
| Provider connection/API error        |       `502` |
| Missing provider configuration       |       `500` |
| Unexpected server error              |       `500` |

## Testing the API

Once your server is running, you can test the chat endpoint using curl:

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

You should receive a JSON response with the AI's reply:

```json
{
  "reply": "Hi! It's good to hear from you. What's on your mind today?..."
}
```

You can also test the health check endpoint:

```bash
curl http://127.0.0.1:8000/api/health
```