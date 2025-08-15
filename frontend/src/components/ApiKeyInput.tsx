import React, { useState } from 'react';
import './ApiKeyInput.css';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  developerMessage: string;
  onDeveloperMessageChange: (message: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
  developerMessage,
  onDeveloperMessageChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const availableModels = [
    'gpt-4.1-mini',
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  return (
    <div className="api-key-input">
      <div className="input-header">
        <h3>Configuration</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-btn"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      <div className={`input-fields ${isExpanded ? 'expanded' : ''}`}>
        <div className="input-group">
          <label htmlFor="api-key">OpenAI API Key *</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="api-key-field"
          />
          <small>Your API key is stored locally and never sent to our servers</small>
        </div>

        <div className="input-group">
          <label htmlFor="model">Model</label>
          <select
            id="model"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="model-select"
          >
            {availableModels.map((modelOption) => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="developer-message">Developer Message (Optional)</label>
          <textarea
            id="developer-message"
            value={developerMessage}
            onChange={(e) => onDeveloperMessageChange(e.target.value)}
            placeholder="Set the AI's behavior and context (e.g., 'You are a helpful coding assistant')"
            className="developer-message-field"
            rows={3}
          />
          <small>This message sets the AI's role and behavior for the conversation</small>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
