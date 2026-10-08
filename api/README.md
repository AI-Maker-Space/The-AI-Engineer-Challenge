# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a chat interface using OpenAI's API. The service acts as a supportive mental coach, helping users with stress, motivation, habits, and confidence.

## Prerequisites

- [`uv`](https://github.com/astral-sh/uv) package manager (`pip install uv`)
- `uv` will provision Python 3.12 automatically for this project, so no separate interpreter installation is required
- An OpenAI API key available as the `OPENAI_API_KEY` environment variable when you run the server

## Setup to run the backend API locally

All commands below assume you are running them from the repository root.

1. Install dependencies into a local virtual environment managed by `uv`:

```bash
uv sync
```

2. (Optional) Activate the virtual environment if you prefer to run commands manually:

```bash
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

`uv` will create the `.venv` directory automatically on first sync and download Python 3.12 if it's not already available.

## Running the Server

Start the FastAPI app with the dependencies managed by `uv`:

```bash
uv run uvicorn api.index:app --reload
```

This runs the app with `uvicorn` on `http://localhost:8000` with auto-reload enabled for development. The server will automatically restart when you make changes to the code.

**Note:** Make sure the `OPENAI_API_KEY` environment variable is set in your shell before launching the server. You can set it with:

```bash
export OPENAI_API_KEY=sk-your-key-here
```

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

The chat endpoint uses OpenAI's GPT-5 model with a supportive mental coach system prompt to provide helpful responses.

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
- Invalid API keys
- OpenAI API errors
- General server errors

All errors will return a 500 status code with an error message.

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


## Deploying the Backend to Vercel (Production)

The backend is already wired for Vercel using the `vercel.json` file in the repository root. To deploy it:

1. **Deploy from your IDE**:
   - Install the Vercel CLI if you have not already:
     ```bash
     npm install -g vercel
     ```
   - From the repository root, run:
     ```bash
     vercel
     ```
   - Follow the prompts to link the project and create the first deployment.

Once configured, every push to the selected branch will trigger a new deployment of the backend API.

## Configuring `OPENAI_API_KEY` in Production (Vercel)

In production, the backend reads the OpenAI API key from the `OPENAI_API_KEY` environment variable. To configure this on Vercel, you can use either the dashboard or the CLI:

**Option A: Using Vercel CLI (Command Line)**

Set the environment variable directly from the command line:

```bash
# Set for production environment
vercel env add OPENAI_API_KEY production
```
**Option B: Using Vercel Dashboard**

1. Open your project in the Vercel dashboard.
2. Go to **Settings → Environment Variables**.
3. Click **Add New** and configure:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: your actual OpenAI API key (e.g., `sk-...`)
   - **Environment**: typically **Production**, **Preview**, and **Development**.
4. Save the variable and **redeploy** the project so the new value is available to the backend functions.

**Important:** Without this variable set in Vercel, the `/api/chat` endpoint will return a 500 error indicating that `OPENAI_API_KEY` is not configured.
