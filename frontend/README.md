### Front End: Bouncing Balls + AI Coach

This frontend is a Next.js app that renders a screensaver-style animation of colorful balls bouncing around the viewport, and it integrates with the backend endpoint at `/api/chat`.

### Run Locally (Frontend + Backend)

1. Start the backend first from the repo root:
   - `uv sync`
   - `export OPENAI_API_KEY=your_key_here`
   - `uv run uvicorn api.index:app --reload`
2. In a separate terminal, open this folder:
   - `cd frontend`
3. Install dependencies:
   - `npm install`
4. Set frontend API base URL:
   - `echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local`
5. Start the development server:
   - `npm run dev`
6. Open:
   - [http://localhost:3000](http://localhost:3000)

You can now send a prompt in the **AI Coach** panel and receive backend-generated responses.

### Production Build Check

- `npm run build`
- `npm run start`

The app is built with Next.js and is compatible with Vercel deployment.