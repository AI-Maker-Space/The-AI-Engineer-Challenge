### Frontend - Next.js App

This is a minimal Next.js frontend for the FastAPI backend in `/api`.

It lets you enter an OpenAI API key, a developer (system) message, a user message, and streams responses from the backend's `/api/chat` endpoint.

#### Prerequisites
- Node 18+ and npm
- The FastAPI backend running locally at `http://localhost:8000` (optional if deploying to Vercel)

#### Local Development
1. Install dependencies:
```bash
cd frontend
npm install
```
2. Optionally enable local API proxy (if backend is on localhost:8000):
```bash
echo "NEXT_PUBLIC_LOCAL_API=true" > .env.local
```
3. Start dev server:
```bash
npm run dev
```
Open `http://localhost:3000`.

#### Using the App
- Backend now reads `OPENAI_API_KEY` from environment, so the UI no longer asks for a key.
- Adjust messages and model if desired.
- Click Send. The response will stream into the transcript.

#### Build and Start
```bash
npm run build
npm start
```

#### Deployment (Vercel)
- The repo root `vercel.json` routes `/api/*` requests to `api/app.py` and all other paths to `frontend/`.
- Push your repo to GitHub and import to Vercel.
