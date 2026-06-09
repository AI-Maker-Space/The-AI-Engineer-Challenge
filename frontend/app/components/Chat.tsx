'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail?.detail ?? `Server error ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: data.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4 py-4">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm select-none">
            MC
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 leading-tight">Mental Coach</h1>
            <p className="text-xs text-slate-400">AI-powered support, always here for you</p>
          </div>
        </div>
      </header>

      {/* Message list */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-violet-600/20 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <p className="text-slate-300 font-medium">Hey, I&apos;m your mental coach.</p>
              <p className="text-slate-500 text-sm max-w-xs">
                Share what&apos;s on your mind — I&apos;m here to listen and help you work through it.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words
                  ${msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <p className="text-xs text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg px-3 py-2">
                {error}
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar */}
      <footer className="shrink-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4 py-3">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="
              flex-1 resize-none overflow-hidden rounded-xl bg-slate-800 border border-slate-700
              px-4 py-3 text-sm text-slate-100 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
              disabled:opacity-50 max-h-40
            "
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="
              shrink-0 h-11 w-11 rounded-xl bg-violet-600 hover:bg-violet-500
              disabled:bg-slate-700 disabled:cursor-not-allowed
              flex items-center justify-center transition-colors
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900
            "
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.818 6.354H13.5a.75.75 0 0 1 0 1.5H4.097l-1.818 6.354a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.208-8.652.75.75 0 0 0 0-1.052A28.896 28.896 0 0 0 3.105 2.288Z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
