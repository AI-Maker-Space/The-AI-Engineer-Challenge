import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { FaUser, FaRobot, FaRegCopy, FaCheck, FaRedo } from "react-icons/fa";

interface ConversationBubbleProps {
  role: "user" | "ai";
  content: string;
  time: string;
  onRegenerate?: () => void;
}

const ConversationBubble: React.FC<ConversationBubbleProps> = ({ role, content, time, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className={`ghibli-rounded px-4 py-2 max-w-[60%] text-base shadow flex items-start gap-2 ${
        role === "user"
          ? "bg-yellow-100 text-yellow-900 rounded-br-none border-2 border-yellow-200"
          : "bg-white text-green-900 rounded-bl-none border-2 border-green-100"
      }`}
      style={{ fontFamily: role === "user" ? 'Quicksand' : 'Noto Serif JP' }}
    >
      <span className="mt-1">
        {role === "user" ? (
          <FaUser className="text-yellow-700" />
        ) : (
          <FaRobot className="text-green-700" />
        )}
      </span>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="prose prose-sm max-w-none text-inherit">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </div>
        <div className="flex items-end justify-between mt-1">
          <div className="text-xs text-gray-400 font-quicksand">{time}</div>
          {/* Copy and Regenerate buttons for AI bubbles only */}
          {role === "ai" && (
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded ghibli-btn text-xs flex items-center gap-1"
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy to clipboard"}
                aria-label="Copy to clipboard"
              >
                {copied ? <FaCheck className="text-green-600" /> : <FaRegCopy />}
              </button>
              <button
                className="p-1 rounded ghibli-btn text-xs flex items-center gap-1"
                onClick={onRegenerate}
                title="Regenerate response"
                aria-label="Regenerate response"
              >
                <FaRedo />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationBubble; 