import React, { useState, useEffect } from "react";

interface SidebarProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  assistantPrompt: string;
  onAssistantPromptChange: (value: string) => void;
}

export default function Sidebar({
  apiKey,
  onApiKeyChange,
  assistantPrompt,
  onAssistantPromptChange,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!apiKey) {
      setSidebarOpen(true);
    }
  }, [apiKey]);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
        sidebarOpen ? "w-[20rem]" : "w-0"
      } bg-gray-200 p-4 flex flex-col gap-4`}
    >
      <button
        className="mb-4 -mr-8 bg-gray-300 text-black px-2 py-1 rounded-r focus:outline-none border border-gray-300 self-end"
        aria-label={sidebarOpen ? "Close configuration sidebar" : "Open configuration sidebar"}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {sidebarOpen ? "←" : "→"}
      </button>
      {sidebarOpen && (
        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">OpenAI API Key</span>
            <input
              type="password"
              className="border rounded px-3 py-2 bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={e => onApiKeyChange(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">Assistant Prompt</span>
            <textarea
              className="border rounded px-3 py-2 bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200 min-h-[48px]"
              placeholder="Enter your assistant prompt..."
              value={assistantPrompt}
              onChange={e => onAssistantPromptChange(e.target.value)}
            />
          </label>
        </form>
      )}
    </aside>
  );
}