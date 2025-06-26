'use client';
import React, { useState, useEffect } from "react";
import ChatPanel, { ChatMessage } from "../components/ChatPanel";
import ConfigurationPanel from "../components/ConfigurationPanel";
import { SYSTEM_PROMPT, DEFAULT_DEVELOPER_PROMPT, CHAT_HISTORY_KEY } from "../constants";
import Sidebar from "../components/Sidebar";

export default function Home() {
  // State for configuration
  const [apiKey, setApiKey] = useState("");
  const [developerPrompt, setDeveloperPrompt] = useState(DEFAULT_DEVELOPER_PROMPT);

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
          developer_message: `${SYSTEM_PROMPT} ${developerPrompt}`,
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
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        developerPrompt={developerPrompt}
        onDeveloperPromptChange={setDeveloperPrompt}
      />
      {/* Main chat area */}
      <main className="flex-1">
        <div className="relative p-4">
          {error && (
            <div className="mb-2 text-black text-sm" role="alert">{error}</div>
          )}
          <ChatPanel
            chatHistory={chatHistory.map(msg =>
              msg.role === "assistant"
                ? { ...msg, content: msg.content }
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
