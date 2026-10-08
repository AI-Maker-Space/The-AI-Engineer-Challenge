import { useState, useCallback } from "react";
import type { ChatMessage, ChatState } from "../types/chat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() ?? "http://localhost:8000";

// Hook for managing chat state and sending messages to the backend.
export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    loading: false,
    error: null
  });

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately.
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date()
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true,
      error: null
    }));

    try {
      // Append "-keep it brief" to the message sent to backend
      const messageToSend = `${content} -keep it brief`;
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) {
        let errorText = await response.text();
        let parsedError = errorText;
        
        // Try to parse JSON error response
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail) {
            parsedError = errorJson.detail;
            // Extract user-friendly message from OpenAI errors
            if (parsedError.includes("insufficient_quota")) {
              parsedError = "OpenAI API quota exceeded. Please check your billing and plan at https://platform.openai.com/account/billing";
            } else if (parsedError.includes("429")) {
              parsedError = "Rate limit exceeded. Please try again in a moment.";
            } else if (parsedError.includes("401") || parsedError.includes("Invalid API key")) {
              parsedError = "Invalid OpenAI API key. Please check your backend configuration.";
            }
          }
        } catch {
          // If not JSON, use the text as is
        }
        
        throw new Error(parsedError || `Request failed (${response.status})`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "No response received.",
        timestamp: new Date()
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        loading: false,
        error: null
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please check your backend connection.";

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      loading: false,
      error: null
    });
  }, []);

  return {
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    sendMessage,
    clearMessages
  };
}

