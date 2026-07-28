"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./TerminalChat.module.css";

type Role = "system" | "user" | "coach" | "error";

type Line = {
  id: string;
  role: Role;
  text: string;
};

const BOOT_LINES = [
  "INITIALIZING NEURAL_COACH v1.0 ...",
  "LINKING TO SUPPORTIVE MENTAL COACH KERNEL ...",
  "ENCRYPTION: ENABLED // CHANNEL: SECURE",
  "READY. TYPE A MESSAGE AND PRESS ENTER.",
];

/** Backend base URL — empty means same-origin (Vercel) or local override. */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Matrix-styled chat terminal wired to the FastAPI `/api/chat` endpoint.
 * API key uses a password input per frontend security rules.
 */
export default function TerminalChat() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence — staggered system lines for terminal presence
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((text, index) => {
      const timer = setTimeout(() => {
        if (cancelled) return;
        setLines((prev) => [
          ...prev,
          { id: makeId(), role: "system", text },
        ]);
        if (index === BOOT_LINES.length - 1) {
          setBooting(false);
          inputRef.current?.focus();
        }
      }, 350 * (index + 1));
      timers.push(timer);
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Keep the transcript pinned to the latest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, isLoading]);

  const appendLine = (role: Role, text: string) => {
    setLines((prev) => [...prev, { id: makeId(), role, text }]);
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading || booting) return;

    setInput("");
    appendLine("user", message);
    setIsLoading(true);

    try {
      const body: { message: string; api_key?: string } = { message };
      if (apiKey.trim()) {
        body.api_key = apiKey.trim();
      }

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail =
          typeof data.detail === "string"
            ? data.detail
            : `REQUEST FAILED // STATUS ${response.status}`;
        appendLine("error", detail);
        return;
      }

      appendLine("coach", data.reply ?? "(empty response from coach kernel)");
    } catch {
      appendLine(
        "error",
        `CONNECTION LOST // IS THE BACKEND RUNNING AT ${API_BASE}?`,
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section className={styles.terminal} aria-label="Matrix chat terminal">
      <header className={styles.titleBar}>
        <div className={styles.traffic}>
          <span className={styles.dotRed} />
          <span className={styles.dotAmber} />
          <span className={styles.dotGreen} />
        </div>
        <h1 className={styles.brand}>NEURAL_COACH</h1>
        <button
          type="button"
          className={styles.configToggle}
          onClick={() => setShowConfig((open) => !open)}
          aria-expanded={showConfig}
        >
          {showConfig ? "[ CLOSE_CONFIG ]" : "[ CONFIG ]"}
        </button>
      </header>

      {showConfig && (
        <div className={styles.configPanel}>
          <label className={styles.configLabel} htmlFor="api-key">
            OPENAI_API_KEY (optional override — stored only in this browser session)
          </label>
          <input
            id="api-key"
            type="password"
            autoComplete="off"
            spellCheck={false}
            className={styles.configInput}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-••••••••"
          />
          <p className={styles.configHint}>
            Leave blank to use the server&apos;s OPENAI_API_KEY env var.
            Endpoint: {API_BASE}/api/chat
          </p>
        </div>
      )}

      <div className={styles.screen} ref={scrollRef}>
        <div className={styles.scanlines} aria-hidden="true" />
        {lines.map((line) => (
          <p key={line.id} className={`${styles.line} ${styles[line.role]}`}>
            <span className={styles.prefix}>{prefixFor(line.role)}</span>
            <span className={styles.text}>{line.text}</span>
          </p>
        ))}
        {isLoading && (
          <p className={`${styles.line} ${styles.coach}`}>
            <span className={styles.prefix}>{prefixFor("coach")}</span>
            <span className={styles.thinking}>
              thinking<span className={styles.dots} />
            </span>
          </p>
        )}
      </div>

      <form className={styles.prompt} onSubmit={onSubmit}>
        <label className={styles.promptLabel} htmlFor="matrix-input">
          root@matrix:~$
        </label>
        <input
          id="matrix-input"
          ref={inputRef}
          className={styles.promptInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={booting || isLoading}
          placeholder={booting ? "booting..." : "enter message"}
          autoComplete="off"
          spellCheck={false}
          aria-label="Chat message"
        />
        <span className={styles.cursor} aria-hidden="true" />
        <button
          type="submit"
          className={styles.send}
          disabled={booting || isLoading || !input.trim()}
        >
          SEND_
        </button>
      </form>
    </section>
  );
}

function prefixFor(role: Role): string {
  switch (role) {
    case "system":
      return "> SYS //";
    case "user":
      return "> YOU //";
    case "coach":
      return "> COACH //";
    case "error":
      return "> ERR //";
  }
}
