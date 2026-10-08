// Types for chat messages and chat state.

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

