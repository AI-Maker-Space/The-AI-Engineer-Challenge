import React, { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import DocumentList from "./DocumentList";
import { UploadResponse } from "../types/document";

interface SidebarProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  developerPrompt: string;
  onDeveloperPromptChange: (value: string) => void;
  selectedDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
  onDocumentDelete: (documentId: string) => void;
}

export default function Sidebar({
  apiKey,
  onApiKeyChange,
  developerPrompt,
  onDeveloperPromptChange,
  selectedDocumentId,
  onDocumentSelect,
  onDocumentDelete,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setSidebarOpen(true);
    }
  }, [apiKey]);

  const handleUploadSuccess = (response: UploadResponse) => {
    setUploadSuccess(response.message);
    setUploadError(null);
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(null);
    // Clear error message after 5 seconds
    setTimeout(() => setUploadError(null), 5000);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
        sidebarOpen ? "w-[20rem]" : "w-0"
      } bg-gray-200 p-4 flex flex-col gap-4 overflow-y-auto`}
    >
      <button
        className="mb-4 -mr-8 bg-gray-300 text-black px-2 py-1 rounded-r focus:outline-none border border-gray-300 self-end"
        aria-label={sidebarOpen ? "Close configuration sidebar" : "Open configuration sidebar"}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {sidebarOpen ? "←" : "→"}
      </button>
      {sidebarOpen && (
        <div className="flex flex-col gap-6">
          {/* Configuration Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
            <form className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-sm">OpenAI API Key</span>
                <input
                  type="password"
                  className="border rounded px-3 py-2 bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200 text-sm"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={e => onApiKeyChange(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-sm">Developer Prompt</span>
                <textarea
                  className="border rounded px-3 py-2 bg-gray-100 border-gray-300 focus:outline-none focus:ring focus:ring-gray-200 min-h-[48px] text-sm"
                  placeholder="Enter your developer prompt..."
                  value={developerPrompt}
                  onChange={e => onDeveloperPromptChange(e.target.value)}
                />
              </label>
            </form>
          </div>

          {/* PDF Upload Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">PDF Upload</h2>
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              disabled={!apiKey}
            />
            {uploadError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                {uploadSuccess}
              </div>
            )}
          </div>

          {/* Document Management Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
            <DocumentList
              selectedDocumentId={selectedDocumentId}
              onDocumentSelect={onDocumentSelect}
              onDocumentDelete={onDocumentDelete}
            />
          </div>

          {/* Chat Mode Indicator */}
          {selectedDocumentId && (
            <div className="mt-auto p-3 bg-olive-100 border border-olive-200 rounded-lg">
              <div className="text-sm font-medium text-olive-800">
                📄 RAG Mode Active
              </div>
              <div className="text-xs text-olive-600 mt-1">
                Chatting with selected document
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}