import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ApiKeySetup from "@/components/ApiKeySetup";

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

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
              OpenAI Chat Assistant
            </h1>
            <p className="text-muted-foreground mt-2">
              Powered by GPT-4.1-mini with streaming responses
            </p>
          </header>

          <div className="flex-1 flex flex-col">
            {!isApiKeySet ? (
              <ApiKeySetup onApiKeySubmit={handleApiKeySubmit} />
            ) : (
              <ChatInterface
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
