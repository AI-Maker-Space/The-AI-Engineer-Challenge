"use client";
import React, { useState } from "react";

export default function Home() {
  const [health, setHealth] = useState<string | null>(null);
  const [devMsg, setDevMsg] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Health check on mount
  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/health`)
      .then((r) => r.json())
      .then((d) => setHealth(d.status))
      .catch(() => setHealth("unreachable"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResponse("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: devMsg,
          user_message: userMsg,
          model,
          api_key: apiKey,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const reader = res.body?.getReader();
      if (reader) {
        let result = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += new TextDecoder().decode(value);
          setResponse(result);
        }
      } else {
        setResponse(await res.text());
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h1>OpenAI Chat Frontend</h1>
      <div style={{ marginBottom: 16 }}>
        <strong>API Health:</strong> {health === null ? "Checking..." : health}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Developer Message:
          <input value={devMsg} onChange={e => setDevMsg(e.target.value)} required style={{ width: "100%" }} />
        </label>
        <label>
          User Message:
          <input value={userMsg} onChange={e => setUserMsg(e.target.value)} required style={{ width: "100%" }} />
        </label>
        <label>
          Model:
          <input value={model} onChange={e => setModel(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          OpenAI API Key:
          <input value={apiKey} onChange={e => setApiKey(e.target.value)} required type="password" style={{ width: "100%" }} />
        </label>
        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>Error: {error}</div>}
      {response && (
        <div style={{ marginTop: 24 }}>
          <strong>Response:</strong>
          <pre style={{ background: "#222", color: "#eee", padding: 12, borderRadius: 4, whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "auto" }}>{response}</pre>
        </div>
      )}
    </main>
  );
}
