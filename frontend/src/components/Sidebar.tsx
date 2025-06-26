import React, { useState, useEffect } from "react";

interface SidebarProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  developerPrompt: string;
  onDeveloperPromptChange: (value: string) => void;
}

export default function Sidebar({
  apiKey,
  onApiKeyChange,
  developerPrompt,
  onDeveloperPromptChange,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!apiKey) {
      setSidebarOpen(true);
    }
  }, [apiKey]);

  return (
    <aside
      className={`transition-all duration-300 ${
        sidebarOpen ? "w-80" : "w-0"
      } bg-white border-r border-gray-200 p-4 flex flex-col gap-4 overflow-hidden`}
      style={{ minWidth: sidebarOpen ? "22rem" : "0", maxWidth: sidebarOpen ? "22rem" : "0", marginTop: "0" }}
    >
      <button
        className="mb-4 bg-gray-200 text-black px-2 py-1 rounded-r focus:outline-none border border-gray-300 self-end"
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
            <span className="font-semibold">Developer Prompt</span>
            <textarea
              className="border rounded px-3 py-2 bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200 min-h-[48px]"
              placeholder="Enter your developer prompt..."
              value={developerPrompt}
              onChange={e => onDeveloperPromptChange(e.target.value)}
            />
          </label>
        </form>
      )}
    </aside>
  );
}