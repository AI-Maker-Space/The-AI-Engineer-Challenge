'use client';
import React, { useState, useEffect } from "react";
import { marked } from "marked";
import { apiClient } from "@/utils/apiClient";
import { SYSTEM_PROMPT, DEFAULT_DEVELOPER_PROMPT, CHAT_HISTORY_KEY } from "../constants";
import ChatPanel, { ChatMessage } from "../components/ChatPanel";
import Sidebar from "../components/Sidebar";
import { useRagChat } from "../hooks/useRagChat";
import { RagChatRequest } from "../types/document";

export default function Home() {
  // State for configuration
  const [apiKey, setApiKey] = useState("");
  const [developerPrompt, setDeveloperPrompt] = useState(DEFAULT_DEVELOPER_PROMPT);

  // State for chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for document management
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // RAG chat hook
  const { chatWithDocument, loading: ragLoading, error: ragError } = useRagChat();

  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        try {
          setChatHistory(JSON.parse(stored));
        } catch {
          setChatHistory([]);
        }
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Handler for sending a message with streaming
  const handleSend = async () => {
    setError(null);
    if (!userInput.trim()) return;
    if (!apiKey) {
      setError("Please enter your OpenAI API key in the Sidebar!");
      return;
    }

    const userMsg = { role: "user" as const, content: userInput.trim() };
    setChatHistory((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);

    try {
      if (selectedDocumentId) {
        // RAG chat mode
        const ragRequest: RagChatRequest = {
          user_message: userMsg.content,
          api_key: apiKey,
          document_id: selectedDocumentId,
          model: "gpt-4o-mini",
          k_chunks: 3
        };

        const assistantMsg: ChatMessage = { role: "assistant", content: "" };

        await chatWithDocument(
          ragRequest,
          (chunk: string) => {
            assistantMsg.content += chunk;
            setChatHistory((prev) => {
              if (prev.length && prev[prev.length - 1].role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { ...prev[prev.length - 1], content: assistantMsg.content },
                ];
              } else {
                return [...prev, { ...assistantMsg }];
              }
            });
          },
          () => {
            setLoading(false);
          }
        );
      } else {
        // Regular chat mode
        const responseBody = await apiClient(
          `${SYSTEM_PROMPT} ${developerPrompt}`,
          userMsg.content,
          apiKey
        );

        const assistantMsg: ChatMessage = { role: "assistant", content: "" };
        const reader = responseBody.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            assistantMsg.content += chunk;
            setChatHistory((prev) => {
              // If last message is assistant, append, else add new
              if (prev.length && prev[prev.length - 1].role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { ...prev[prev.length - 1], content: assistantMsg.content },
                ];
              } else {
                return [...prev, { ...assistantMsg }];
              }
            });
          }
        }
        setLoading(false);
      }
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to get response from backend.");
      }
      setLoading(false);
    }
  };

  // Handler to clear chat
  const handleClearChat = () => {
    setChatHistory([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  };

  // Handler for document selection
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId || null);
  };

  // Handler for document deletion
  const handleDocumentDelete = (documentId: string) => {
    if (selectedDocumentId === documentId) {
      setSelectedDocumentId(null);
    }
  };

  // Clear error when user types or updates API key
  useEffect(() => {
    if (error && (userInput || apiKey)) {
      setError(null);
    }
  }, [userInput, apiKey]);

  // Handle RAG errors
  useEffect(() => {
    if (ragError) {
      setError(ragError);
    }
  }, [ragError]);

  const isLoading = loading || ragLoading;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        developerPrompt={developerPrompt}
        onDeveloperPromptChange={setDeveloperPrompt}
        selectedDocumentId={selectedDocumentId}
        onDocumentSelect={handleDocumentSelect}
        onDocumentDelete={handleDocumentDelete}
      />
      {/* Main chat area */}
      <section>
        <div className="w-screen flex justify-center items-center">
          <div className="flex flex-col w-full max-w-screen">
            {error && (
              <div className="mb-2 text-black text-sm" role="alert">{error}</div>
            )}
            {selectedDocumentId && (
              <div className="mb-2 p-2 bg-olive-100 border border-olive-200 rounded text-sm text-olive-800">
                📄 RAG Mode: Chatting with uploaded document
              </div>
            )}
            <ChatPanel
              // For each message in chatHistory, if the message is from the assistant,
              // convert its content from markdown to HTML using marked.parse, so it can be rendered as HTML.
              // User messages are left unchanged.
              chatHistory={chatHistory.map(message =>
                message.role === "assistant"
                  ? { ...message, content: marked.parse(message.content as string, { async: false }) }
                  : message
              )}
              userInput={userInput}
              onInputChange={setUserInput}
              onSend={handleSend}
              loading={isLoading}
              onClearChat={handleClearChat}
              clearChatDisabled={chatHistory.length === 0}
              renderAssistantHtml={true}
              error={error}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
