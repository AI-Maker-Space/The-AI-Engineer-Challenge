import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import './ApiKeyInput.css';

const ApiKeyInput = ({ apiKey, setApiKey }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="api-key-section">
      <div className="api-key-header">
        <Key size={20} />
        <h3>Gemini API Key</h3>
      </div>
      <div className="api-key-input-container">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key..."
          className="api-key-input"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="toggle-visibility"
          aria-label={showKey ? 'Hide API key' : 'Show API key'}
        >
          {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <p className="api-key-help">
        Get your Gemini API key from{' '}
        <a 
          href="https://makersuite.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Google AI Studio
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput; 