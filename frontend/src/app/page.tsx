'use client';
import React, { useState, useEffect } from "react";
import Tabs from "../components/Tabs";
import ChatPanel, { ChatMessage } from "../components/ChatPanel";
import ConfigurationPanel from "../components/ConfigurationPanel";
import { DEFAULT_SYSTEM_PROMPT, CHAT_HISTORY_KEY } from "../constants";
import { marked } from "marked";

// Utility to escape HTML for safe rendering
function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function Home() {
  // State for configuration
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Open sidebar if no API key is entered
  useEffect(() => {
    if (!apiKey) {
      setSidebarOpen(true);
    }
  }, [apiKey]);

  // Handler for sending a message with streaming
  const handleSend = async () => {
    setError(null);
    if (!userInput.trim()) return;
    if (!apiKey) {
      setError("Please enter your OpenAI API key in the Configuration tab.");
      return;
    }
    const userMsg = { role: "user" as const, content: userInput.trim() };
    setChatHistory((prev) => [...prev, userMsg]);
    setUserInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: systemPrompt,
          user_message: userMsg.content,
          api_key: apiKey,
        }),
      });
      if (!response.body) throw new Error("No response body");
      const assistantMsg: ChatMessage = { role: "assistant", content: "" };
      const reader = response.body.getReader();
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
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to get response from backend.");
      }
    } finally {
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

  return (
    <div className="flex min-h-screen">
      {/* Collapsible Sidebar for configuration */}
      <aside
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-80" : "w-0"
        } bg-white border-r border-gray-200 p-4 flex flex-col gap-4 overflow-hidden`}
        style={{ minWidth: sidebarOpen ? "22rem" : "0", maxWidth: sidebarOpen ? "22rem" : "0" }}
      >
        {sidebarOpen && (
          <ConfigurationPanel
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
          />
        )}
      </aside>
      {/* Sidebar toggle button */}
      <button
        className="absolute left-0 top-4 z-20 bg-gray-200 text-black px-2 py-1 rounded-r focus:outline-none border border-gray-300"
        style={{
          transform: sidebarOpen ? "translateX(20rem)" : "translateX(0)",
          transition: "transform 0.3s",
        }}
        aria-label={sidebarOpen ? "Close configuration sidebar" : "Open configuration sidebar"}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {sidebarOpen ? "←" : "→"}
      </button>
      {/* Main chat area */}
      <main className="flex-1">
        <div className="relative p-4">
          {error && (
            <div className="mb-2 text-black text-sm" role="alert">{error}</div>
          )}
          <ChatPanel
            chatHistory={chatHistory.map(msg =>
              msg.role === "assistant"
                ? { ...msg, content: marked.parse(msg.content) }
                : msg
            )}
            userInput={userInput}
            onInputChange={setUserInput}
            onSend={handleSend}
            loading={loading}
            onClearChat={handleClearChat}
            clearChatDisabled={chatHistory.length === 0}
            renderAssistantHtml={true}
          />
        </div>
      </main>
    </div>
  );
}
