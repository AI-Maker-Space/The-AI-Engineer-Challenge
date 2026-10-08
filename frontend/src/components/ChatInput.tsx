import React, { useState, useRef, useEffect } from "react";

const SUGGESTED_PROMPTS: string[] = [
  "I want to build a stronger mindset. Give 3 habits to build a stronger mindset",
  "I’m overwhelmed. Can you guide a brief calming exercise and help reframe it",
  "I’m stuck on a goal—help me break it into simple steps and stay motivated",
  "Give me a quick mental check-in with a few questions",
  "I’m stuck on a decision—help me explore options and choose what aligns with my values"
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Chat input component with auto-resize textarea and send button.
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 bg-white/80 backdrop-blur-sm p-4 dark:bg-slate-900"
    >
      <div className="flex-1 rounded-xl border border-slate-300/80 bg-white/90 backdrop-blur-sm p-2 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-blue-400">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full resize-none border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        {showSuggestions && !disabled && !message.trim() && (
          <div className="mt-3 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/90 p-2 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            <p className="mb-1 font-semibold text-slate-800 dark:text-slate-100">
              Try one of these to get started:
            </p>
            <div className="flex flex-col gap-1 max-h-44 overflow-y-auto pr-1">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setMessage(prompt);
                    setShowSuggestions(false);
                    textareaRef.current?.focus();
                  }}
                  className="rounded-lg bg-white/80 px-2 py-1 text-left text-[11px] leading-snug text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}

