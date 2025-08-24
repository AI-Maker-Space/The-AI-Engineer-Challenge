# ChatGPT-Style Frontend

A simple, working ChatGPT-style chat interface that connects to your FastAPI backend.

## Features

- ✅ **Working chat interface** with input box and scrolling responses
- ✅ **Real-time streaming** from your FastAPI backend
- ✅ **Auto-scrolling** to latest messages
- ✅ **API key management** with password input
- ✅ **Customizable system messages**
- ✅ **Responsive design** with dark theme

## How to Run

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```

Your frontend will be available at `http://localhost:3000`

### 3. Start the Backend
In another terminal:
```bash
cd api
python app.py
```

Your backend will run at `http://localhost:8000`

### 4. Use the Chat Interface
1. Enter your OpenAI API key
2. Customize the system message (optional)
3. Start chatting!

## What You Get

- **Simple, focused interface** - no unnecessary complexity
- **Working chat functionality** - connects to your FastAPI backend
- **Streaming responses** - watch AI responses appear in real-time
- **Clean, readable code** - easy to understand and modify

The frontend automatically proxies API calls to your backend at `localhost:8000`.
