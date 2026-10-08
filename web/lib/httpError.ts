/**
 * Formats FastAPI-style `{ "detail": ... }` payloads for display.
 */
export function formatApiErrorBody(raw: unknown, fallback: string): string {
  if (!raw || typeof raw !== "object") return fallback;
  const detail = (raw as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        try {
          return JSON.stringify(item);
        } catch {
          return String(item);
        }
      })
      .join("; ");
  }
  return fallback;
}
