import React, { useRef } from "react";
import { FaFeatherAlt, FaUser } from "react-icons/fa";

interface ChatInputFormProps {
  userInput: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  clearChat: () => void;
  setUserInput: (val: string) => void;
  loading: boolean;
  onUploadPDF?: (file: File) => void;
  uploadStatus?: string;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  userInput,
  handleKeyDown,
  handleSend,
  clearChat,
  setUserInput,
  loading,
  onUploadPDF,
  uploadStatus,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUploadPDF) {
      onUploadPDF(e.target.files[0]);
      e.target.value = ""; // reset for next upload
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* PDF Upload UI */}
      <div className="flex items-center gap-2 mb-1">
        <button
          className="ghibli-btn px-3 py-1"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload PDF
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {uploadStatus && <span className="text-sm text-green-700 ml-2">{uploadStatus}</span>}
      </div>
      {/* Chat input UI */}
      <form
        className="flex items-end gap-2 relative pt-2 bg-transparent"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <span className="input-icon left-4"><FaUser /></span>
        <textarea
          className="ghibli-input flex-1 pl-10 pr-3 py-2 resize-none min-h-[40px] max-h-[120px] text-base"
          placeholder="Type your message here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
          style={{ fontFamily: 'Quicksand' }}
        />
        <button
          type="submit"
          className="ghibli-btn px-5 py-2 flex items-center gap-2"
          disabled={loading || !userInput.trim()}
        >
          <FaFeatherAlt /> Send
        </button>
        <button
          type="button"
          className="ghibli-btn px-4 py-2"
          onClick={clearChat}
          disabled={loading}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default ChatInputForm; 