"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsSending(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: "You are a helpful assistant.",
          user_message: userMsg.content,
          model: "gpt-4.1-mini",
          api_key: apiKey || undefined,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantBuffer = "";
      const assistantId = crypto.randomUUID();
      setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantBuffer += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, content: assistantBuffer } : msg)));
      }
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: `Error: ${err?.message || String(err)}` },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <h1 style={{ margin: 0 }}>Chat</h1>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input
            type="password"
            placeholder="Enter OpenAI API Key (optional)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              outline: "none",
              minWidth: 280,
            }}
          />
        </div>
      </header>
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: "auto", padding: 16, background: "#fafafa" }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#666" }}>Say hi! Type a message below.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  maxWidth: 720,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: m.role === "user" ? "#e6f0ff" : "white",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{m.role}</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSend();
        }}
        style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={2}
          style={{
            flex: 1,
            resize: "none",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={isSending || input.trim().length === 0}
          style={{
            padding: "0 16px",
            borderRadius: 8,
            border: "1px solid #2563eb",
            background: isSending ? "#93c5fd" : "#3b82f6",
            color: "white",
            cursor: isSending ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </main>
  );
}


