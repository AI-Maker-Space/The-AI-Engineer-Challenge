import { useState, useRef, useEffect, FormEvent } from "react";

function App() {
  const [developerMessage, setDeveloperMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [model, setModel] = useState("us.anthropic.claude-3-5-sonnet-20241022-v2:0");
  const [awsRegion, setAwsRegion] = useState("us-east-1");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const availableModels = [
    { id: "us.anthropic.claude-3-5-sonnet-20241022-v2:0", name: "Claude 3.5 Sonnet v2" },
    { id: "us.anthropic.claude-3-5-haiku-20241022-v1:0", name: "Claude 3.5 Haiku" },
    { id: "us.anthropic.claude-3-opus-20240229-v1:0", name: "Claude 3 Opus" },
    { id: "us.anthropic.claude-3-sonnet-20240229-v1:0", name: "Claude 3 Sonnet" },
    { id: "us.anthropic.claude-3-haiku-20240307-v1:0", name: "Claude 3 Haiku" },
  ];

  const awsRegions = ["us-east-1", "us-west-2", "eu-west-1", "ap-northeast-1"];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model,
          aws_region: awsRegion,
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setResponse((prev) => prev + chunk);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResponse("Error: " + err.message);
      } else {
        setResponse("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          maxWidth: 480,
          width: "100%",
          padding: "2.5rem 2rem 2rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.1rem",
            fontWeight: 700,
            color: "#d97706",
            margin: 0,
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          Anthropic Chat
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#666",
            textAlign: "center",
            margin: "-0.5rem 0 0 0",
          }}
        >
          Powered by AWS Bedrock
        </p>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <label style={{ fontWeight: 500, color: "#333" }}>
            System Message
            <textarea
              value={developerMessage}
              onChange={(e) => setDeveloperMessage(e.target.value)}
              required
              style={{
                width: "100%",
                minHeight: 60,
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #ddd",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              placeholder="Enter system message (e.g., You are a helpful assistant)"
            />
          </label>
          <label style={{ fontWeight: 500, color: "#333" }}>
            User Message
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
              style={{
                width: "100%",
                minHeight: 60,
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #ddd",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              placeholder="Enter your message"
            />
          </label>
          <label style={{ fontWeight: 500, color: "#333" }}>
            Model
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #ddd",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                boxSizing: "border-box",
              }}
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label style={{ fontWeight: 500, color: "#333" }}>
            AWS Region
            <select
              value={awsRegion}
              onChange={(e) => setAwsRegion(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                borderRadius: 8,
                border: "1px solid #ddd",
                padding: "0.5rem 0.75rem",
                fontSize: 15,
                background: "#f7f8fa",
                boxSizing: "border-box",
              }}
            >
              {awsRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#fcd9b6" : "#d97706",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.85rem 0",
              fontWeight: 700,
              fontSize: 17,
              marginTop: 8,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 2px 8px rgba(217,119,6,0.15)",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        <div style={{ marginTop: "0.5rem", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#222",
              marginBottom: 8,
              marginTop: 0,
            }}
          >
            Response
          </h2>
          <div
            ref={responseRef}
            style={{
              background: "#1a1a2e",
              color: "#f7f7fa",
              borderRadius: 12,
              minHeight: 100,
              maxHeight: 300,
              overflowY: "auto",
              padding: 18,
              fontFamily: "monospace",
              fontSize: 14,
              whiteSpace: "pre-wrap",
              boxShadow: "0 2px 8px rgba(31,38,135,0.07)",
              border: "1px solid #2c2f33",
            }}
          >
            {response ? (
              <span style={{ wordBreak: "break-word" }}>{response}</span>
            ) : (
              <span style={{ color: "#888" }}>(No response yet)</span>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 32,
          color: "#fff",
          opacity: 0.7,
          fontSize: 14,
          textAlign: "center",
        }}
      >
        Powered by Anthropic Claude on AWS Bedrock | Built with React + FastAPI
      </div>
    </div>
  );
}

export default App;
