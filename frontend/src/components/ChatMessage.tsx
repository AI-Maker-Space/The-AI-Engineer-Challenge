import React, { useState, useEffect } from "react";
import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

// Individual chat message bubble component.
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content || message.content.trim() === "";
  const [bufferingText, setBufferingText] = useState("Thinking...");

  // Update buffering text after a delay when message is empty (still loading).
  useEffect(() => {
    if (isEmpty && !isUser) {
      // Initially show "Thinking..."
      setBufferingText("Thinking...");
      
      // After 3 seconds, change to "Generating response..."
      // Only update if message is still empty (content hasn't arrived yet).
      const timer = setTimeout(() => {
        // Double-check that message is still empty before updating text.
        if (!message.content || message.content.trim() === "") {
          setBufferingText("Generating response...");
        }
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Reset buffering text when content arrives or for user messages.
      setBufferingText("Thinking...");
    }
  }, [isEmpty, isUser, message.content]);

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-blue-500 text-white shadow-blue-200/50 dark:bg-blue-500"
            : "bg-white/90 backdrop-blur-sm text-slate-800 shadow-slate-200/50 dark:bg-slate-800 dark:text-slate-100"
        }`}
      >
        {isEmpty && !isUser ? (
          // Show robot symbol with pulsing animation when assistant message is empty (buffering)
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🤖</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 italic">
              {bufferingText}
            </span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}

