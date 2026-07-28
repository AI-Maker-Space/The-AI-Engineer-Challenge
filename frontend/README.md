# NEURAL_COACH // Blade Runner Console

A Next.js frontend dressed like a rainy neo-noir night — amber neon, cyan uplink glow, film grain — talking to the FastAPI coach backend in `/api`.

Less green code rain. More Los Angeles after dark.

## Prerequisites

- Node.js 18+ (Homebrew: `brew install node`)
- The FastAPI backend running locally (see root README / `api/README.md`)
- An OpenAI API key — either as `OPENAI_API_KEY` on the backend, or pasted into the console **CONFIG** panel (password field)

## Setup

From the `frontend/` directory:

```bash
cd frontend
npm install
```

Optional: point the UI at a custom backend URL (defaults to `http://localhost:8000`):

```bash
cp .env.local.example .env.local
# edit NEXT_PUBLIC_API_URL if needed
```

## Run locally

**Terminal 1 — backend** (from the repo root):

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

**Terminal 2 — frontend**:

```bash
cd frontend
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and step into the rain.

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## How it talks to the backend

The console POSTs to `{NEXT_PUBLIC_API_URL}/api/chat` with:

```json
{ "message": "your text", "api_key": "optional override" }
```

and expects:

```json
{ "reply": "coach response" }
```

Hit **CONFIG** in the title bar to paste an API key (masked as a password). Leave it blank to use the server env var.

## Deploying on Vercel

This repo's `vercel.json` builds the Next.js app and the Python API together. Set `OPENAI_API_KEY` in your Vercel project environment variables, then deploy from the repo root with `vercel`.
