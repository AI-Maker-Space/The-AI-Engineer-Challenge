# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Engineer Challenge project featuring a full-stack LLM application with RAG (Retrieval-Augmented Generation) capabilities. The system consists of a FastAPI backend and a Next.js frontend, designed to be deployed on Vercel.

## Key Commands

### Backend (Python/FastAPI)

The project uses `uv` for Python package management (Python 3.12):

```bash
# Install dependencies
uv sync

# Start backend server (from project root)
uv run uvicorn api.app:app --reload

# Alternative: Start from api directory
cd api && python app.py
```

Environment setup:
```bash
export OPENAI_API_KEY=sk-...
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

### Deployment

```bash
# Deploy to Vercel
npm install -g vercel
vercel
```

## Architecture

### Backend Structure (`api/`)

The FastAPI application (`api/app.py`) provides three main endpoint groups:

1. **Basic Chat** (`/api/chat`): Streaming chat completions using OpenAI API
   - Accepts developer and user messages
   - Returns streaming text responses

2. **RAG System** (`/api/upload-pdf-rag`, `/api/chat-rag`, `/api/pdfs`):
   - Upload PDF documents for processing
   - Documents are chunked, embedded, and stored in an in-memory vector database
   - Chat interface retrieves relevant context from uploaded PDFs
   - Global `pdf_documents` dict stores PDF metadata and vector databases in memory

3. **Health Check** (`/api/health`): Simple health check endpoint

### AImakerspace Library (`aimakerspace/`)

Custom utilities for RAG functionality:

- **`text_utils.py`**: Document loaders and text splitters
  - `PDFLoader`: Loads and extracts text from PDFs using PyPDF2
  - `TextFileLoader`: Loads text from .txt files
  - `CharacterTextSplitter`: Splits text into overlapping chunks

- **`vectordatabase.py`**: In-memory vector database
  - Stores embeddings with cosine similarity search
  - `abuild_from_list()`: Async method to build database from text chunks
  - `search_by_text()`: Retrieves k-most similar chunks

- **`openai_utils/`**:
  - `chatmodel.py`: `ChatOpenAI` class with streaming support via `astream()`
  - `embedding.py`: `EmbeddingModel` class for text embeddings (uses `text-embedding-3-small`)
  - `prompts.py`: Prompt templates with role-based message formatting (`SystemRolePrompt`, `UserRolePrompt`)

### Frontend Structure (`frontend/`)

Next.js 14 application with TypeScript and Tailwind CSS:
- App Router structure (`src/app/`)
- Components directory for UI elements
- Integrates with FastAPI backend via streaming API calls

### Deployment Configuration

- **`vercel.json`**: Root configuration routing `/api/*` to FastAPI and `/*` to Next.js frontend
- **`api/vercel.json`**: Python runtime configuration for serverless deployment
- CORS enabled on backend for cross-origin requests

## Development Guidelines

From `.cursor/rules/general-rule.mdc`:
- Always commit changes when updating code
- Write well-documented code (self-documenting or commented)
- Work on a single feature at a time
- Explain decisions thoroughly to the user

From `.cursor/rules/frontend-rule.mdc`:
- Use Next.js for frontend development (optimized for Vercel)
- Ensure visual clarity and proper contrast
- Use password-style inputs for sensitive information (API keys)
- Provide instructions for running UI locally

## Important Notes

### RAG System Behavior

- Vector databases are stored in memory and will be lost on server restart
- PDF processing happens synchronously on upload
- Each PDF gets a unique UUID identifier
- Relevant chunks (k=3) are retrieved using cosine similarity
- System prompt is specifically tuned for job interview assistance

### OpenAI Integration

- Backend requires `OPENAI_API_KEY` environment variable
- Default model for basic chat: `gpt-4.1-mini`
- Default model for RAG chat: `gpt-4o-mini`
- Embeddings use `text-embedding-3-small`

### Text Processing

- Default chunk size: 1000 characters
- Default chunk overlap: 200 characters
- PDFs are processed page-by-page with PyPDF2
