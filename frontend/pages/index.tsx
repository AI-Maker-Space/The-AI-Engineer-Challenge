import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import StudyInterface from "@/components/StudyInterface";
import ApiKeySetup from "@/components/ApiKeySetup";
import { Book, MessageSquare } from "lucide-react";

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [mode, setMode] = useState<"chat" | "study">("study");

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setIsApiKeySet(true);
  };

  const handleApiKeyReset = () => {
    setApiKey("");
    setIsApiKeySet(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 h-screen">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Police Academy Study Assistant
            </h1>
            <p className="text-muted-foreground mt-2">
              Your AI-powered study companion for the Texas Penal Code
            </p>
          </header>

          {isApiKeySet && (
            <div className="flex justify-center mb-6 space-x-4">
              <button
                onClick={() => setMode("study")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === "study"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                <Book className="w-4 h-4" />
                <span>Study Mode</span>
              </button>
              <button
                onClick={() => setMode("chat")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === "chat"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Mode</span>
              </button>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            {!isApiKeySet ? (
              <ApiKeySetup onApiKeySubmit={handleApiKeySubmit} />
            ) : mode === "chat" ? (
              <ChatInterface
                apiKey={apiKey}
                onApiKeyReset={handleApiKeyReset}
              />
            ) : (
              <StudyInterface
                apiKey={apiKey}
                onApiKeyReset={handleApiKeyReset}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
