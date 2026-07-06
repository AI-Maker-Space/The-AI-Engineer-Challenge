import {
  ChatApiError,
  friendlyMessageForStatus,
  friendlyMessageForUnknownError,
  isAbortError,
  parseApiDetail,
} from "./errors";
import type { ChatResponse, CoachCharacterId } from "./types";

interface SendChatMessageOptions {
  message: string;
  creativity: number;
  character: CoachCharacterId;
  signal?: AbortSignal;
}

/**
 * Sends a user message to the FastAPI /api/chat endpoint.
 * Uses a relative URL so it works with Next.js dev rewrites and Vercel routing.
 */
export async function sendChatMessage({
  message,
  creativity,
  character,
  signal,
}: SendChatMessageOptions): Promise<{ reply: string; responseTimeMs?: number }> {
  let response: Response;

  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, creativity, character }),
      signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    throw new ChatApiError(0, friendlyMessageForUnknownError(error));
  }

  if (!response.ok) {
    let serverDetail: string | null = null;

    try {
      serverDetail = parseApiDetail(await response.json());
    } catch {
      // Response body may not be JSON — use status-based fallback below.
    }

    const userMessage = friendlyMessageForStatus(response.status, serverDetail);
    throw new ChatApiError(response.status, userMessage, serverDetail ?? undefined);
  }

  const data = (await response.json()) as ChatResponse;
  return {
    reply: data.reply,
    ...(data.response_time_ms !== undefined && {
      responseTimeMs: data.response_time_ms,
    }),
  };
}

export { ChatApiError, friendlyMessageForUnknownError, isAbortError };
