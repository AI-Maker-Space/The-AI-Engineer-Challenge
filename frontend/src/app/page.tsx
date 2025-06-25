'use client';
import React, { useState, useEffect } from "react";
import Tabs from "../components/Tabs";
import ChatPanel, { ChatMessage } from "../components/ChatPanel";
import ConfigurationPanel from "../components/ConfigurationPanel";
import { DEFAULT_SYSTEM_PROMPT } from "../constants";

const CHAT_HISTORY_KEY = "chattycat-history";

export default function Home() {
  // State for configuration
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);

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
          developer_message: systemPrompt,
          user_message: userMsg.content,
          api_key: apiKey,
        }),
      });
      if (!response.body) throw new Error("No response body");
      let assistantMsg: ChatMessage = { role: "assistant", content: "" };
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
    } catch (err: any) {
      setError(err.message || "Failed to get response from backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs
      defaultTabId="chat"
      tabs={[
        {
          label: "Chat",
          id: "chat",
          content: (
            <div>
              {error && (
                <div className="mb-2 text-red-600 dark:text-red-400 text-sm" role="alert">{error}</div>
              )}
              <ChatPanel
                chatHistory={chatHistory}
                userInput={userInput}
                onInputChange={setUserInput}
                onSend={handleSend}
                loading={loading}
              />
            </div>
          ),
        },
        {
          label: "Configuration",
          id: "config",
          content: (
            <ConfigurationPanel
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
          ),
        },
      ]}
    />
  );
}
