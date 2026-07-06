export type { CoachCharacterId } from "@/lib/characters";
import type { CoachCharacterId } from "@/lib/characters";

export type MessageRole = "user" | "assistant";

export interface ChatRequest {
  message: string;
  /** Creativity slider value (0 = focused, 100 = creative). */
  creativity: number;
  /** Coach persona id. */
  character: CoachCharacterId;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** Model generation time in milliseconds (assistant messages only). */
  responseTimeMs?: number;
}

export interface ChatResponse {
  reply: string;
  response_time_ms?: number;
}

export interface ApiError {
  detail: string;
}
