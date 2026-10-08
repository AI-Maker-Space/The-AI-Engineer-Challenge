import React, { useRef, useEffect } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import { ChatError } from "./components/ChatError";

// Main chat application component with ChatGPT-like interface.
export default function App() {
  const { messages, loading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:bg-slate-950">
      <article className="flex h-full flex-col">
        {/* Header with centered title and theme toggle */}
        <header className="flex flex-col items-center gap-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 py-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
          <div className="flex items-start justify-center gap-3">
            <span className="text-4xl leading-none md:text-5xl">💡</span>
            <div className="text-center">
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg md:text-xl">
                MindWave AI - Your AI Support Coach for a Stronger Mind
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                &quot;Helping your mind breathe a little easier.&quot;
              </p>
            </div>
          </div>
        </header>

        {/* Chat messages area */}
        <main className="relative flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-blue-50/20 px-4 pb-6 pt-16 dark:bg-transparent md:px-6">
          <div className="absolute right-4 top-4 z-10 md:right-6">
            <ThemeToggle />
          </div>
          <div className="mx-auto max-w-3xl">
            {showWelcome ? (
              <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
                <p className="mb-8 text-center text-lg font-medium text-slate-700 dark:text-slate-300">
                  Hi! It&apos;s good to have you here. What&apos;s on your mind
                  today?
                </p>
                {/* Chat input positioned below welcome message */}
                <div className="w-full max-w-2xl">
                  <ChatInput
                    onSend={sendMessage}
                    disabled={loading}
                    placeholder="Type your message..."
                  />
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {error && <ChatError message={error} />}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </main>

        {/* Chat input at bottom when messages exist - stays fixed at bottom */}
        {!showWelcome && (
          <div className="border-t border-slate-300/80 bg-white/80 backdrop-blur-sm shadow-lg dark:border-slate-700 dark:bg-slate-900/95 px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <ChatInput
                onSend={sendMessage}
                disabled={loading}
                placeholder="Type your message..."
              />
            </div>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 py-3 text-center text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-400 md:px-6">
        <p className="font-semibold">
          My First LLM-Powered Application 🚀🚀🚀 — Built for the AI Engineering
          Challenge by Bharath Markande
        </p>
      </footer>
    </div>
  );
}