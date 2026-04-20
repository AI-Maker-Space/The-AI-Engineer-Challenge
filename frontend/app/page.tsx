'use client';

import { useState, useRef, useEffect } from 'react';
import { formatMessage } from '@/utils/messageFormatter';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

const API_KEY_STORAGE_KEY = 'openai_api_key';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(true);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello. I\'m here to support you. How are you feeling today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Check for stored API key on mount
  useEffect(() => {
    const storedKey = sessionStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      setShowApiKeyModal(false);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKeyError('');

    const key = apiKeyInput.trim();

    if (!key) {
      setApiKeyError('API key is required');
      return;
    }

    // Basic validation - OpenAI keys typically start with 'sk-'
    if (!key.startsWith('sk-')) {
      setApiKeyError('Invalid API key format. OpenAI keys typically start with "sk-"');
      return;
    }

    // Store in sessionStorage (cleared when browser closes)
    sessionStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setShowApiKeyModal(false);
    setApiKeyInput('');
  };

  const handleClearApiKey = () => {
    sessionStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setShowApiKeyModal(true);
    setMessages([
      {
        role: 'assistant',
        content: 'Hello. I\'m here to support you. How are you feeling today?',
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            content: '[ERROR] API key is required. Please enter your OpenAI API key.',
          },
        ]);
        setShowApiKeyModal(true);
        return;
      }

      // Use /api/chat endpoint - Next.js will proxy to FastAPI backend in dev,
      // or Vercel will route to FastAPI backend in production
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-API-Key': apiKey, // Send API key in custom header
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.reply) {
        throw new Error('Invalid response from server: missing reply field');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Failed to connect to server.';

      if (error instanceof Error) {
        errorMessage = error.message;
        // Provide helpful context for common errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to backend. Make sure the FastAPI server is running on http://localhost:8000';
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: `[ERROR] ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {showApiKeyModal && (
        <div className="api-key-modal">
          <div className="api-key-modal-content">
            <div className="api-key-modal-title">
              API Key Required
            </div>
            <div className="api-key-modal-description">
              Enter your OpenAI API key to access the chat interface. Your key is stored locally in your browser session and is never sent to our servers except for API requests.
            </div>
            <form onSubmit={handleApiKeySubmit}>
              <div className="api-key-input-container">
                <label htmlFor="api-key-input" className="api-key-input-label">
                  OpenAI API Key
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value);
                    setApiKeyError('');
                  }}
                  className="api-key-input"
                  placeholder="sk-..."
                  autoFocus
                />
                {apiKeyError && (
                  <div className="api-key-error">{apiKeyError}</div>
                )}
                <div className="api-key-warning">
                  Your API key is stored in browser session storage and will be cleared when you close the browser.
                </div>
              </div>
              <button type="submit" className="api-key-button">
                Connect
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="chat-header">
        <div className="chat-header-content">
          <h1 className="chat-title">Mental Health Coach</h1>
          {apiKey && (
            <button
              onClick={handleClearApiKey}
              className="clear-api-key-button"
              title="Clear API key"
            >
              Settings
            </button>
          )}
        </div>
      </div>
      <div className="chat-messages" ref={outputRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.role}`}>
            {message.role === 'user' && (
              <div className="message-bubble message-user-bubble">
                <div className="message-content">{message.content}</div>
              </div>
            )}
            {message.role === 'assistant' && (
              <div className="message-bubble message-assistant-bubble">
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              </div>
            )}
            {message.role === 'error' && (
              <div className="message-bubble message-error-bubble">
                <div className="message-content">{message.content}</div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-bubble message-assistant-bubble">
              <div className="message-content loading">
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
            placeholder="Type your message..."
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className="chat-send-button"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

