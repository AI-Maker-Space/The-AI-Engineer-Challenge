# Quick Start Guide - Mental Coach Chat Application

This guide will help you get the full-stack Mental Coach application running in under 5 minutes.

## Prerequisites

- Python 3.12+ (managed by `uv`)
- Node.js 14+ and npm
- OpenAI API key

## Step-by-Step Setup

### 1. Install uv Package Manager

```bash
pip install uv
```

### 2. Clone and Navigate to Project

```bash
cd The-AI-Engineer-Challenge
```

### 3. Install Backend Dependencies

```bash
uv sync
```

### 4. Set OpenAI API Key

```bash
export OPENAI_API_KEY=sk-your-actual-key-here
```

> **Windows (PowerShell):** `$env:OPENAI_API_KEY="sk-your-actual-key-here"`

### 5. Start Backend Server

Open a terminal and run:

```bash
uv run uvicorn api.index:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### 6. Install Frontend Dependencies

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

### 7. Start Frontend Server

```bash
npm start
```

The browser should automatically open to `http://localhost:3000`.

## Testing the Application

1. You should see a chat interface with a welcome message
2. Type a message like "I'm feeling stressed about work"
3. Press Enter or click Send
4. Wait for the AI mental coach to respond

## Troubleshooting

### Backend won't start
- Check that `OPENAI_API_KEY` is set: `echo $OPENAI_API_KEY`
- Verify port 8000 is free: `lsof -ti:8000`

### Frontend can't connect
- Ensure backend is running on port 8000
- Check [`frontend/.env.development`](frontend/.env.development) has correct URL
- Restart frontend after changing `.env` files

### "Address already in use" error
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## What's Next?

- Customize the chat UI in [`frontend/src/components/Chat.css`](frontend/src/components/Chat.css)
- Modify the AI personality in [`api/index.py`](api/index.py)
- Deploy to production (see main README)

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  React Frontend │ ──────> │  FastAPI Backend│ ──────> │   OpenAI API    │
│   Port 3000     │ <────── │   Port 8000     │ <────── │    (GPT-5)      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Full Documentation

- Frontend: [`frontend/README.md`](frontend/README.md)
- Backend: [`api/README.md`](api/README.md)
- Integration Plan: [`plans/frontend-backend-integration.md`](plans/frontend-backend-integration.md)
