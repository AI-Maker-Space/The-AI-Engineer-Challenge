import React, { FormEvent, useRef, useEffect } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  userInput: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  onClearChat?: () => void;
}

export default function ChatPanel({
  chatHistory,
  userInput,
  onInputChange,
  onSend,
  loading,
  onClearChat,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when chatHistory changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading && userInput.trim()) {
      onSend();
    }
  };

  return (
    <div className="relative h-[calc(80vh-112px)] flex flex-col">
      <div
        className="flex-1 overflow-y-auto rounded bg-white p-4 mb-2"
        aria-label="Chat history"
        tabIndex={0}
        style={{ marginBottom: "88px" }}
      >
        {chatHistory.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet. Say hi to ChattyCat!</div>
        ) : (
          <ul className="space-y-3">
            {chatHistory.map((msg, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className=" w-7 h-7 rounded-full bg-yellow-200 border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <span role="img" aria-label="cat">🐱</span>
                  </span>
                )}
                <span
                  className={`px-3 py-2 rounded-lg w-3/4 max-w-full break-words text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {msg.content}
                </span>
                {msg.role === "user" && (
                  <span className="w-7 h-7 rounded-full bg-blue-200 border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <span role="img" aria-label="user">🧑</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        className="fixed left-0 right-0 bottom-0 w-full max-w-2xl mx-auto flex gap-2 items-end bg-background px-2 py-3 border-t border-gray-200"
        style={{ zIndex: 10 }}
        onSubmit={handleSubmit}
        autoComplete="off"
        role="form"
      >
        <textarea
          className="flex-1 px-3 py-2 border rounded bg-accent dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-900 resize-none min-h-[48px] max-h-32"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Type your message"
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="button"
          disabled={loading || !userInput.trim()}
          aria-label="Send message"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            className="px-4 py-2 rounded bg-secondary text-white font-semibold shadow focus:outline-none focus-visible:ring disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Clear Chat
          </button>
        )}
      </form>
    </div>
  );
}