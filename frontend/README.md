# Mental Coach Frontend

Next.js chat UI for the FastAPI backend in `/api`.

## Prerequisites

- Node.js 18+ and npm
- Backend running at `http://localhost:8000` (see project root `README.md`)

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # optional — defaults to http://localhost:8000
```

## Run locally

**Terminal 1 — backend** (from project root):

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

**Terminal 2 — frontend**:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API integration

| Frontend action | Backend endpoint |
|-----------------|------------------|
| Health indicator | `GET /` → `{ "status": "ok" }` |
| Send message | `POST /api/chat` → `{ "reply": "..." }` |

Set `NEXT_PUBLIC_API_URL` in `.env.local` if the backend is not on port 8000.

## Production build

```bash
npm run build
npm start
```

## Vercel deployment (Option A)

| Project | URL |
|---------|-----|
| **Frontend** (share this) | https://ai-engineer-frontend-eight.vercel.app |
| **Backend API** | https://ai-engineer-api-nine.vercel.app |

The frontend project has `NEXT_PUBLIC_API_URL` set to the backend URL.

**Required:** In the [ai-engineer-api](https://vercel.com/tambiasawos-projects/ai-engineer-api/settings/environment-variables) project settings, add `OPENAI_API_KEY` for Production (then redeploy the API):

```bash
cd ..   # project root
vercel deploy --prod --yes
```

Without `OPENAI_API_KEY`, health checks work but chat returns an error.
