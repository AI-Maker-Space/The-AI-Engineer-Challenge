"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  API_URL,
  checkBackendHealth,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/api";

function createId() {
  return crypto.randomUUID();
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: "assistant",
      content:
        "Hi — I'm your mental coach. What's on your mind today? Share anything about stress, motivation, habits, or confidence.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;

    async function pollHealth() {
      const ok = await checkBackendHealth();
      if (!cancelled) setBackendOnline(ok);
    }

    pollHealth();
    const interval = setInterval(pollHealth, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setLoading(true);

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: reply },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">
              Mental Coach
            </h1>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Supportive coaching via your FastAPI backend
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                backendOnline === null
                  ? "animate-pulse bg-[var(--text-muted)]"
                  : backendOnline
                    ? "bg-[var(--success)]"
                    : "bg-[var(--error)]"
              }`}
              aria-hidden
            />
            <span className="text-[var(--text-muted)]">
              {backendOnline === null
                ? "Checking…"
                : backendOnline
                  ? "Backend online"
                  : "Backend offline"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div
          className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[var(--user-bubble)] text-[var(--text)]"
                    : "bg-[var(--assistant-bubble)] text-[var(--text)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-[var(--assistant-bubble)] px-4 py-3 text-[var(--text-muted)]">
                Thinking…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <p
            className="mt-3 rounded-lg border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]"
            role="alert"
          >
            {error}
          </p>
        )}

        {backendOnline === false && (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Start the API from the project root:{" "}
            <code className="rounded bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[var(--accent)]">
              uv run uvicorn api.index:app --reload
            </code>
            {" · "}
            Backend URL:{" "}
            <code className="text-[var(--accent)]">{API_URL}</code>
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <label htmlFor="message" className="sr-only">
            Your message
          </label>
          <input
            id="message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind…"
            disabled={loading}
            className="min-h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 disabled:opacity-60"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="min-h-12 rounded-xl bg-[var(--accent)] px-5 font-medium text-[#0f1419] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
