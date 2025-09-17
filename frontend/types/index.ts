export interface Message {
  id: string;
  role: "user" | "assistant" | "developer";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
}

