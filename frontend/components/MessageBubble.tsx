import { User, Bot } from "lucide-react";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`flex max-w-[80%] space-x-3 ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : message.isError
              ? "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 border border-red-200 dark:border-red-800"
              : "bg-card text-card-foreground border border-border"
          }`}
        >
          <div className="message-content">
            {message.content}
            {message.isStreaming && (
              <span className="typing-indicator ml-1"></span>
            )}
          </div>

          <div
            className={`text-xs mt-2 opacity-70 ${
              isUser ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

