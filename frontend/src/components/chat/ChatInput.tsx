"use client";

import { MAX_MESSAGE_CHARS } from "@/lib/limits";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ChatInput({
  onSend,
  onCancel,
  isLoading = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setInput("");

    // Reset textarea height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        submit();
      }
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-surface-elevated/60 p-4"
    >
      <div className="flex items-end gap-3">
        <label htmlFor="chat-input" className="sr-only">
          Your message
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={input}
          maxLength={MAX_MESSAGE_CHARS}
          onChange={(event) => setInput(event.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind…"
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-11 shrink-0 items-center justify-center rounded-xl border border-error/40 bg-error/10 px-5 text-sm font-semibold text-error transition-colors hover:bg-error/20 focus:outline-none focus:ring-2 focus:ring-error/30"
            aria-label="Stop response"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            Send
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        {isLoading
          ? "Waiting for a reply · click Stop to cancel"
          : "Press Enter to send · Shift+Enter for a new line"}
      </p>
    </form>
  );
}
