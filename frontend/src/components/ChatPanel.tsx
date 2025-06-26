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
  clearChatDisabled?: boolean;
  renderAssistantHtml?: boolean;
}

export default function ChatPanel({
  chatHistory,
  userInput,
  onInputChange,
  onSend,
  loading,
  onClearChat,
  clearChatDisabled,
  renderAssistantHtml,
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
        className="flex-1 overflow-y-scroll rounded bg-white p-4 mb-2"
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
                <span
                  className={`px-3 py-2 rounded-lg w-3/4 max-w-full break-words text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-gray-100 text-black"
                      : "bg-[color:#e6a8a1] text-black" // dustyrose-300
                  }`}
                  {...(msg.role === "assistant" && renderAssistantHtml
                    ? { dangerouslySetInnerHTML: { __html: msg.content } }
                    : {})}
                >
                  {!(msg.role === "assistant" && renderAssistantHtml) && msg.content}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        className="fixed left-0 right-0 bottom-0 w-full max-w-2xl mx-auto flex gap-2 items-end bg-white px-2 py-3 border-t border-gray-200"
        style={{ zIndex: 10 }}
        onSubmit={handleSubmit}
        autoComplete="off"
        role="form"
      >
        <textarea
          className="flex-1 px-3 py-2 border rounded bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200 resize-none min-h-[48px] max-h-32"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Type your message"
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-olive-400 text-white font-semibold shadow focus:outline-none focus-visible:ring disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading || !userInput.trim()}
          aria-label="Send message"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            className="px-4 py-2 rounded bg-gray-400 text-white font-semibold shadow focus:outline-none focus-visible:ring disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={clearChatDisabled}
          >
            Clear Chat
          </button>
        )}
      </form>
    </div>
  );
}