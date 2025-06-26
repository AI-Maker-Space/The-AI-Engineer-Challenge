import React from "react";
import { DEFAULT_SYSTEM_PROMPT } from "../constants";

interface ConfigurationPanelProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

export default function ConfigurationPanel({
  apiKey,
  onApiKeyChange,
  systemPrompt,
  onSystemPromptChange,
}: ConfigurationPanelProps) {
  return (
    <form className="flex flex-col gap-6" autoComplete="off">
      <div>
        <label htmlFor="api-key" className="block font-medium mb-1">
          OpenAI API Key
        </label>
        <input
          id="api-key"
          name="api-key"
          type="password"
          inputMode="text"
          autoComplete="off"
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-900"
          placeholder="Paste your OpenAI API key here"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          aria-label="OpenAI API Key"
        />
      </div>
      <div>
        <label htmlFor="system-prompt" className="block font-medium mb-1">
          System Prompt
        </label>
        <textarea
          id="system-prompt"
          name="system-prompt"
          rows={4}
          className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-900"
          placeholder="Enter a system prompt for ChattyCat"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          aria-label="System Prompt"
        />
        <div className="text-xs text-gray-500 mt-1">
          Default: <span className="italic">{DEFAULT_SYSTEM_PROMPT}</span>
        </div>
      </div>
    </form>
  );
}