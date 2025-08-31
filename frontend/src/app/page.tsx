
"use client";
import { useState } from "react";

export default function Home() {
  const [developerMessage, setDeveloperMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          api_key: apiKey,
        }),
      });
      const data = await res.text();
      setResponse(data);
    } catch (err) {
      setResponse("Error connecting to backend.");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">AI Engineer Challenge Frontend</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          value={developerMessage}
          onChange={(e) => setDeveloperMessage(e.target.value)}
          placeholder="Developer message"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="User message"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="OpenAI API Key"
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Send to Backend"}
        </button>
      </form>
      {response && (
        <div className="mt-6 w-full max-w-md bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Response:</h2>
          <pre className="whitespace-pre-wrap break-words text-sm">{response}</pre>
        </div>
      )}
    </main>
  );
}
