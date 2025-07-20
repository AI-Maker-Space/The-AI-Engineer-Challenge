"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFeatherAlt, FaMagic } from "react-icons/fa";
import ChatWindow from "./ChatWindow";

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
}

const defaultSystemPrompt =
  "You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | undefined>(undefined);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const missingApiKey = !apiKey;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getApiBaseUrl = () => {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return "http://localhost:8000/api/chat";
    }
    return "https://the-ai-engineer-challenge-roan.vercel.app/api/chat";
  };

  const handleUploadPDF = async (file: File) => {
    setUploadStatus("Uploading...");
    setPdfUploaded(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      const response = await fetch("/api/upload_pdf", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        setUploadStatus("Upload failed");
        return;
      }
      setUploadStatus("PDF uploaded and indexed!");
      setPdfUploaded(true);
      setMessages([
        {
          role: "ai",
          content: "PDF uploaded and indexed! You can now ask questions about your document.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.log(err);
      setUploadStatus("Upload error");
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || loading) return;
    if (!apiKey) {
      alert("Please enter your OpenAI API key in settings.");
      setShowSettings(true);
      return;
    }
    const userMsg: Message = {
      role: "user",
      content: userInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setUserInput("");
    setLoading(true);
    try {
      let response;
      if (pdfUploaded) {
        response = await fetch("/api/chat_with_pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_message: userInput,
            api_key: apiKey,
          }),
        });
      } else {
        const latexInstruction = `\nYou are a helpful AI assistant. When you include mathematical expressions in your responses, always format them using LaTeX syntax. Use single dollar signs \`$...$\` for inline math and double dollar signs \`$$...$$\` for display math. For example:\n\n- Inline: The solution is $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$.\n- Display:\n$$\nx = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\n$$\n\nDo not use any other delimiters for math. Always escape backslashes as needed for LaTeX.`;
        response = await fetch(getApiBaseUrl(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            developer_message: systemPrompt + '\n\n' + latexInstruction,
            user_message: userInput,
            model,
            api_key: apiKey,
          }),
        });
      }
      if (!response.ok) {
        const errorText = await response.text();
        setMessages((msgs) => [
          ...msgs,
          {
            role: "ai",
            content: `Error: ${response.status} ${response.statusText}\n${errorText}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setLoading(false);
        return;
      }
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      let aiMsg = "";
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          aiMsg += new TextDecoder().decode(value);
          setMessages((msgs) => {
            const last = msgs[msgs.length - 1];
            if (last.role === "ai") {
              return [...msgs.slice(0, -1), { ...last, content: aiMsg }];
            } else {
              return [
                ...msgs,
                {
                  role: "ai",
                  content: aiMsg,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ];
            }
          });
        }
      }
      setLoading(false);
    } catch (err: unknown) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          content: `Error: ${message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Settings persistence (localStorage)
  useEffect(() => {
    setApiKey(localStorage.getItem("openai_api_key") || "");
    setModel(localStorage.getItem("openai_model") || "gpt-4.1-mini");
    setSystemPrompt(localStorage.getItem("openai_system_prompt") || defaultSystemPrompt);
  }, []);
  const saveSettings = () => {
    localStorage.setItem("openai_api_key", apiKey);
    localStorage.setItem("openai_model", model);
    localStorage.setItem("openai_system_prompt", systemPrompt);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start font-quicksand relative pt-2 pb-0">
      {/* Grain overlay for texture */}
      <div className="ghibli-grain" aria-hidden="true" />
      {/* Header */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-3 px-4 mb-2">
        <motion.h1
          className="text-3xl font-bold flex items-center gap-3 select-none text-[#355c3a]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <FaFeatherAlt className="text-yellow-700 drop-shadow" />
          <span className="font-noto-serif">Ghibli Chat</span>
        </motion.h1>
        <motion.button
          className="ghibli-btn px-4 py-2 flex items-center gap-2"
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Settings"
          whileHover={{ scale: 1.08, boxShadow: "0 0 16px #ffe9b3" }}
        >
          <FaMagic className="text-yellow-700" />
          Settings
        </motion.button>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-ghibli-parchment ghibli-shadow ghibli-rounded p-7 w-full max-w-md relative border-2 border-[#e6dcc3]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <h2 className="text-xl font-noto-serif mb-4 text-yellow-900 flex items-center gap-2">
                <FaMagic className="text-yellow-700" /> Settings
              </h2>
              <div className="mb-3 relative">
                <span className="input-icon"><FaMagic /></span>
                <input
                  id="apiKey"
                  type="password"
                  className="ghibli-input w-full pl-10 py-2"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                />
              </div>
              <div className="mb-3 relative">
                <span className="input-icon"><FaFeatherAlt /></span>
                <select
                  id="model"
                  className="ghibli-input w-full pl-10 py-2"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div className="mb-3 relative">
                <span className="input-icon"><FaFeatherAlt /></span>
                <textarea
                  id="systemPrompt"
                  className="ghibli-input w-full pl-10 py-2"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="ghibli-btn px-4 py-2"
                  onClick={() => setShowSettings(false)}
                >Cancel</button>
                <button
                  className="ghibli-btn px-4 py-2"
                  onClick={saveSettings}
                >Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Container as a separate component */}
      <ChatWindow
        messages={messages}
        loading={loading}
        userInput={userInput}
        handleKeyDown={handleKeyDown}
        handleSend={handleSend}
        clearChat={clearChat}
        setUserInput={setUserInput}
        setMessages={setMessages}
        missingApiKey={missingApiKey}
        onShowSettings={() => setShowSettings(true)}
        onUploadPDF={handleUploadPDF}
        uploadStatus={uploadStatus}
      />
      <footer className="text-xs text-yellow-900 font-noto-serif drop-shadow-sm mt-1 mb-0">Built with Next.js, Tailwind CSS, Framer Motion, and FastAPI &mdash; Inspired by Studio Ghibli</footer>
    </div>
  );
}
