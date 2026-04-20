### Frontend (Next.js + Tailwind)

Welcome to the shiny chat UI for your FastAPI OpenAI backend. It streams responses in real time, lets you bring your own API key, and stays out of your way.

## Quickstart

1) Install deps
```bash
cd frontend
npm install
```

2) Configure backend URL (optional)
- The app defaults to `http://localhost:8000`. To change it, set `NEXT_PUBLIC_API_BASE_URL` in your shell before starting dev:
```bash
export NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

3) Run the dev server
```bash
npm run dev
# open http://localhost:3000
```

4) Use your OpenAI API key
- Paste your API key into the input at the top of the page. It’s stored in `localStorage` only on your device for local dev.

## Features
- App Router (Next 14) + TypeScript
- Tailwind for comfy styling
- Streaming UI wired to the backend `/api/chat`
- Model and system prompt inputs for quick experimentation

## How it works
- The UI sends a POST to `${NEXT_PUBLIC_API_BASE_URL}/api/chat` with `{ developer_message, user_message, model, api_key }`.
- It reads the streaming response and renders tokens as they arrive.

## Scripts
```bash
npm run dev     # start dev server on :3000
npm run build   # build for production
npm run start   # run production build on :3000
npm run lint    # run eslint
```

Have fun and ship something delightful. 😎