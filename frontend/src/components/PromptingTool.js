import React, { useState } from 'react';
import { Send, MessageSquare, RefreshCw, Sparkles, User, Bot } from 'lucide-react';
import './PromptingTool.css';

const PromptingTool = ({ testCases = [], apiKey, onTestCasesUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          test_cases: testCases,
          api_key: apiKey
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineTestCases = async () => {
    if (!testCases.length || isLoading) return;

    setIsLoading(true);
    
    const refinementPrompt = "Please analyze these test cases and suggest improvements for better coverage, clarity, and effectiveness.";

    try {
      const response = await fetch('/api/refine-test-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_cases: testCases,
          refinement_prompt: refinementPrompt,
          api_key: apiKey
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedPrompts = [
    "How can I improve test coverage for edge cases?",
    "What are the best practices for writing clear test steps?",
    "How should I prioritize these test cases?",
    "What additional scenarios should I consider?",
    "How can I make these test cases more maintainable?"
  ];

  return (
    <div className="prompting-tool">
      <button 
        className="prompting-tool-toggle"
        onClick={() => setIsVisible(!isVisible)}
      >
        <MessageSquare size={20} />
        AI Assistant
        {messages.length > 0 && <span className="message-count">{messages.length}</span>}
      </button>

      {isVisible && (
        <div className="prompting-tool-panel">
          <div className="prompting-tool-header">
            <div className="header-title">
              <Sparkles size={18} />
              Test Case AI Assistant
            </div>
            <button 
              className="close-button"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>

          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-content">
                  <Sparkles size={24} />
                  <h3>Welcome to your AI Test Case Assistant!</h3>
                  <p>I can help you improve your test cases, suggest better coverage, and provide QA best practices.</p>
                  
                  {testCases.length > 0 && (
                    <button 
                      className="refine-button"
                      onClick={handleRefineTestCases}
                      disabled={isLoading}
                    >
                      <RefreshCw size={16} />
                      Analyze Current Test Cases
                    </button>
                  )}
                  
                  <div className="suggested-prompts">
                    <p>Try asking:</p>
                    {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                      <button 
                        key={index}
                        className="suggested-prompt"
                        onClick={() => setInputMessage(prompt)}
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-header">
                  <div className="message-avatar">
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <span className="message-role">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="message-time">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="message-header">
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>
                  <span className="message-role">AI Assistant</span>
                </div>
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about improving your test cases..."
              disabled={isLoading}
              rows={2}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              <Send size={18} />
            </button>
          </div>

          {testCases.length > 0 && messages.length > 0 && (
            <div className="quick-actions">
              <button 
                className="quick-action-button"
                onClick={handleRefineTestCases}
                disabled={isLoading}
              >
                <RefreshCw size={14} />
                Refine Test Cases
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptingTool;
