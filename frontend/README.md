# Next.js Frontend for Python API

This frontend is built with Next.js (App Router, TypeScript) and connects to the backend in `/api/app.py`.

## Local Development

1. Start the Python backend:
   ```sh
   cd api
   # If using a virtual environment:
   $HOME/project_path/.venv/bin/python app.py
   # Or, if not using a virtual environment:
   python app.py
   ```
2. Start the Next.js frontend:
   ```sh
   cd frontend
   npm run dev
   ```
3. The frontend will run on `http://localhost:3000` (or the next available port) and can fetch data from the backend (default: `http://localhost:8000`).

## API Integration

- Use environment variables to configure the backend URL:
  - Create a `.env.local` file in `frontend`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```
- Example fetch usage in a component:
  ```ts
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ developer_message, user_message, model, api_key })
  });
  const data = await res.text();
  ```

## Deployment to Vercel

- Push your code to GitHub and connect the repo to Vercel.
- Set `NEXT_PUBLIC_API_URL` in Vercel project settings to your deployed backend URL.
- Both frontend and backend can be deployed as separate Vercel projects, or you can use Vercel's monorepo support.

## Useful Links
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
