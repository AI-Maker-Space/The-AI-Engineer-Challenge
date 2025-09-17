import { useState } from "react";
import { Eye, EyeOff, Key, AlertCircle } from "lucide-react";

interface ApiKeySetupProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export default function ApiKeySetup({ onApiKeySubmit }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      setError('Invalid API key format. OpenAI API keys start with "sk-"');
      return;
    }

    setIsLoading(true);

    try {
      // Test the API key by making a health check to the backend
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/health`
      );

      if (!response.ok) {
        throw new Error(
          "Backend server is not accessible. Please ensure the API server is running."
        );
      }

      onApiKeySubmit(apiKey.trim());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to validate API key"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border p-8 animate-fade-in">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
            <p className="text-muted-foreground">
              Enter your OpenAI API key to get started with the chat assistant.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium block">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-md font-medium transition-colors"
            >
              {isLoading ? "Validating..." : "Start Chatting"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p className="mt-1">
              Don't have an API key?{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get one from OpenAI
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

