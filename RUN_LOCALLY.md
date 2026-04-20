# Running the Application Locally

This guide will help you run both the frontend and backend locally for testing.

## Prerequisites

1. **Python & uv**: Install `uv` package manager (`pip install uv`)
2. **Node.js**: Install Node.js 18+ and npm
3. **OpenAI API Key**: You'll need your OpenAI API key (users enter it in the frontend, but you can also set it as an env var for backend testing)

## Step-by-Step Instructions

### Step 1: Install Backend Dependencies

From the project root directory:

```bash
# Install Python dependencies using uv
uv sync
```

This will:

- Create a virtual environment (`.venv/`)
- Download Python 3.12 if needed
- Install all required packages

### Step 2: Install Frontend Dependencies

Open a new terminal window/tab and navigate to the frontend directory:

```bash
cd frontend
npm install
```

### Step 3: Start the Backend Server

In your first terminal (from project root):

```bash
# Optional: Set OPENAI_API_KEY if you want to test backend directly
# (Note: Frontend users will enter their own API key)
# Windows PowerShell:
$env:OPENAI_API_KEY="sk-your-key-here"

# Windows CMD:
set OPENAI_API_KEY=sk-your-key-here

# Linux/Mac:
export OPENAI_API_KEY=sk-your-key-here

# Start the backend server
uv run uvicorn api.index:app --reload
```

You should see output like:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

The backend is now running on `http://localhost:8000`

### Step 4: Start the Frontend Server

In your second terminal (from the `frontend` directory):

```bash
npm run dev
```

You should see output like:

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

The frontend is now running on `http://localhost:3000`

### Step 5: Open the Application

1. Open your browser and navigate to: `http://localhost:3000`
2. You'll see the API key modal - enter your OpenAI API key
3. Start chatting!

## Quick Start (All Commands)

If you want to see all commands at once:

**Terminal 1 (Backend):**

```bash
# From project root
uv sync
uv run uvicorn api.index:app --reload
```

**Terminal 2 (Frontend):**

```bash
# From frontend directory
cd frontend
npm install  # Only needed first time
npm run dev
```

## Verifying Everything Works

1. **Backend Health Check**: Visit `http://localhost:8000/` - should return `{"status":"ok"}`
2. **Backend API Docs**: Visit `http://localhost:8000/docs` - should show Swagger UI
3. **Frontend**: Visit `http://localhost:3000` - should show the chat interface

## Troubleshooting

### Port Already in Use

If you get "Address already in use" errors:

**Windows:**

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend Can't Connect to Backend

- Make sure the backend is running on `http://localhost:8000`
- Check that you see the backend startup messages
- Try accessing `http://localhost:8000/docs` in your browser

### API Key Issues

- The frontend now requires users to enter their own API key
- You don't need to set `OPENAI_API_KEY` environment variable unless testing the backend directly
- API keys are stored in browser sessionStorage (cleared when browser closes)

## Development Tips

- **Hot Reload**: Both servers support hot reload - changes to code will automatically restart
- **Backend Changes**: FastAPI will auto-reload when you modify `api/index.py`
- **Frontend Changes**: Next.js will hot-reload when you modify frontend files
- **API Testing**: You can test the backend API directly at `http://localhost:8000/docs`

## Stopping the Servers

Press `CTRL+C` in each terminal to stop the servers.
