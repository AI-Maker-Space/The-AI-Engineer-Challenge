# Mindful Coach — Frontend

A Next.js chat interface for the FastAPI mental coach backend.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes `npm`)
- The FastAPI backend running on port 8000 (see `api/README.md`)

## Setup

From the `frontend` directory:

```bash
npm install
```

## Run locally

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — Backend

From the project root:

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

The API will be available at `http://localhost:8000`.

### Terminal 2 — Frontend

From the `frontend` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Next.js dev server proxies `/api/*` requests to the FastAPI backend on port 8000 (configured in `next.config.ts`). You can override the backend URL with:

```bash
BACKEND_URL=http://localhost:8000 npm run dev
```

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

Deploy from the **repository root** (not the `frontend/` folder). The root `vercel.json` defines two **services** — a Next.js frontend and a FastAPI backend — and routes traffic between them.

```bash
cd /path/to/The-AI-Engineer-Challenge   # repo root
npm install -g vercel
vercel
```

### Vercel project settings

In the [Vercel dashboard](https://vercel.com/) → your project → **Settings → General**:

1. **Root Directory** must be empty (repo root). If it is set to `frontend`, the Python backend will not deploy and `/api/chat` returns **404**.
2. **Build & Development Settings** can stay at defaults — the `services` block in `vercel.json` controls how each part builds.
3. Set environment variables under **Settings → Environment Variables** (Production, Preview, and Development):

| Variable | Required | Suggested (public demo) |
|----------|----------|-------------------------|
| `OPENAI_API_KEY` | Yes | — |
| `OPENAI_MODEL` | No | `gpt-4.1-mini` |
| `OPENAI_MAX_TOKENS` | No | `500` |
| `OPENAI_MAX_MESSAGE_CHARS` | No | `2000` |

After changing settings, trigger a **Redeploy** from the Deployments tab.

### Routing

| Path | Service |
|------|---------|
| `/api/*` | FastAPI backend (`api/index.py`) |
| everything else | Next.js frontend (`frontend/`) |

### Verify after deploy

1. Open `https://your-app.vercel.app/api/health` — expect `{"status":"ok"}`
2. Open the app and send a chat message

## Project structure

```
src/
  app/              # Next.js App Router pages & layout
  components/chat/  # Chat UI components
  lib/              # API client & shared types
```
