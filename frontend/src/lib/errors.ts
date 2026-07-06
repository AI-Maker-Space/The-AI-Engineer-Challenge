/** Thrown when the chat API returns a non-success response. */
export class ChatApiError extends Error {
  readonly status: number;
  readonly userMessage: string;

  constructor(status: number, userMessage: string, debugMessage?: string) {
    super(debugMessage ?? userMessage);
    this.name = "ChatApiError";
    this.status = status;
    this.userMessage = userMessage;
  }
}

type FastApiValidationIssue = {
  msg?: string;
};

/** Extracts a message from FastAPI error bodies (`detail` string or validation array). */
export function parseApiDetail(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const detail = (body as { detail?: unknown }).detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          return (item as FastApiValidationIssue).msg ?? "";
        }
        return "";
      })
      .filter(Boolean);

    return messages.length > 0 ? messages.join(" ") : null;
  }

  return null;
}

/** Returns a friendly fallback when the server message is missing or too technical. */
export function friendlyMessageForStatus(
  status: number,
  serverDetail: string | null,
): string {
  // Prefer safe server messages that don't look like internal errors.
  if (
    serverDetail &&
    !serverDetail.startsWith("Error calling") &&
    !serverDetail.includes("Traceback")
  ) {
    return serverDetail;
  }

  switch (status) {
    case 400:
      return "That message couldn't be sent. Please check your input and try again.";
    case 404:
      return "We couldn't reach the coach service. Refresh the page and try again.";
    case 429:
      return "We're receiving a lot of messages right now. Please wait a moment and try again.";
    case 503:
      return "The coach is temporarily unavailable. Please try again in a few minutes.";
    case 504:
      return "That took longer than expected. Please try again.";
    default:
      return "Something went wrong while getting a reply. Please try again.";
  }
}

/** Maps unknown failures (e.g. network) to a user-friendly message. */
export function friendlyMessageForUnknownError(error: unknown): string {
  if (isAbortError(error)) {
    return "";
  }

  if (error instanceof ChatApiError) {
    return error.userMessage;
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Couldn't connect to the coach. Check your internet connection and try again.";
  }

  return "Something went wrong. Please try again.";
}

/** True when the user cancelled an in-flight fetch. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
