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

interface ChatInputFormProps {
  userInput: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  onClearChat?: () => void;
  clearChatDisabled?: boolean;
}

function ChatInputForm({
  userInput,
  onInputChange,
  onSend,
  loading,
  onClearChat,
  clearChatDisabled,
}: ChatInputFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading && userInput.trim()) {
      onSend();
    }
  };
  return (
    <form
      className="w-3/4 m-auto"
      onSubmit={handleSubmit}
      autoComplete="off"
      role="form"
    >
      <div className="flex flex-row m-4 gap-4">
        <textarea
          className="p-2 border rounded bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200 resize-none min-h-[48px] max-h-32"
          style={{ width: "85%" }}
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Type your message"
          disabled={loading}
          required
        />
        <div className="flex flex-col gap-4" style={{ width: "15%" }}>
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
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold shadow focus:outline-none focus-visible:ring disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={clearChatDisabled}
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>
    </form>
  );
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

  return (
    <div className="flex flex-col h-full min-h-100 w-4/5 mx-auto">
      <div
        className="flex-1 min-h-100 overflow-y-auto p-6 mt-30 mb-36 h-screen"
        aria-label="Chat history"
        tabIndex={0}
      >
        {chatHistory.length === 0 ? (
          <div className="text-gray-500 text-center">No messages yet. Say hi to ChattyCat!</div>
        ) : (
          <ul className="space-y-3">
            {chatHistory.map((msg, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && renderAssistantHtml ? (
                  <span
                    className={`px-3 py-2 rounded-lg w-3/4 max-w-full break-words text-sm shadow-sm bg-olive-300 text-black`}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                ) : (
                  <span
                    className={`px-3 py-2 rounded-lg max-w-full break-words text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-dustyrose-300 text-black w-1/2"
                        : "bg-olive-300 text-black w-3/4"
                    }`}
                  >
                    {msg.content}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="fixed left-0 bottom-0 z-40 w-full bg-white p-2">
        <ChatInputForm
          userInput={userInput}
          onInputChange={onInputChange}
          onSend={onSend}
          loading={loading}
          onClearChat={onClearChat}
          clearChatDisabled={clearChatDisabled}
        />
      </div>
    </div>
  );
}