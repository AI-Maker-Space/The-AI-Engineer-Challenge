/**
 * Base URL for the FastAPI backend (see `api/index.py`).
 * Set `NEXT_PUBLIC_API_BASE` in `.env.local` for local dev or production.
 */
export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
  if (base) return base;
  return "http://127.0.0.1:8000";
}
