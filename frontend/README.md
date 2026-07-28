# NEURAL_COACH // Blade Runner Console

Welcome to a rainy neon night in Los Angeles.

This Next.js frontend wraps the supportive mental coach API in a **Blade Runner**-inspired console: amber signage, cyan uplink glow, slanted city rain, film grain, and a live chat panel that still talks straight to FastAPI.

Brand first. Atmosphere second. Coach replies when you transmit.

## What's on screen

- Full-bleed neon rain over a dark night sky (not a flat black void)
- `NEURAL_COACH` as the hero signal in the console chrome
- Password-masked **CONFIG** panel for an optional OpenAI API key
- Chat uplink to `POST /api/chat`

## Prerequisites

- Node.js 18+ (`brew install node` works great)
- The FastAPI backend from this repo (`api/README.md`)
- An OpenAI API key — set as `OPENAI_API_KEY` on the backend, **or** paste it into the console CONFIG panel

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

Keep two terminals open — one for the night city, one for the uplink.

**Terminal 1 — backend** (repo root):

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

**Terminal 2 — frontend**:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), watch the rain, and hit **TRANSMIT**.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

> If Next complains that port 3000 is already in use, stop the old process (`kill <PID>`) and run `npm run dev` again so you land on **3000**, not 3001.

## How the console talks to the backend

The UI POSTs to `{NEXT_PUBLIC_API_URL}/api/chat` with:

```json
{
  "message": "your text",
  "api_key": "optional override"
}
```

and expects:

```json
{
  "reply": "coach response"
}
```

Open **CONFIG** in the title bar to paste an API key (password field). Leave it blank to use the server's `OPENAI_API_KEY` env var.

## Deploying on Vercel

Root `vercel.json` builds this Next.js app alongside the Python API. Set `OPENAI_API_KEY` in your Vercel project env, then deploy from the repo root with `vercel`.
