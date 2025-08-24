'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !apiKey.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage.content,
          model: 'gpt-4.1-mini',
          api_key: apiKey
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      let assistantMessage = ''
      const assistantMessageId = (Date.now() + 1).toString()

      // Add initial assistant message
      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, initialAssistantMessage])

      // Stream the response
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        assistantMessage += chunk

        // Update the assistant message in real-time
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: assistantMessage }
            : msg
        ))
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-container">
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#ececf1' }}>
        ChatGPT-Style Chat Interface
      </h1>

      {/* Settings Section */}
      <div className="settings">
        <label htmlFor="apiKey">OpenAI API Key:</label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key (sk-...)"
        />
        
        <label htmlFor="developerMessage">System Message:</label>
        <input
          id="developerMessage"
          type="text"
          value={developerMessage}
          onChange={(e) => setDeveloperMessage(e.target.value)}
          placeholder="Instructions for the AI assistant"
        />
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#8e8ea0', marginTop: '50px' }}>
            <p>Start a conversation by typing a message below!</p>
          </div>
        )}
        
        {messages.map(message => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-header">
              <span>{message.role === 'user' ? 'You' : 'AI Assistant'}</span>
              <span>{message.timestamp.toLocaleTimeString()}</span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="input-container">
        <textarea
          className="input-field"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={apiKey ? "Type your message here..." : "Please enter your API key first"}
          disabled={!apiKey || isLoading}
          rows={1}
          style={{
            height: 'auto',
            minHeight: '50px',
            maxHeight: '150px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 150) + 'px'
          }}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || !apiKey || isLoading}
        >
          {isLoading ? <div className="loading"></div> : 'Send'}
        </button>
      </div>
    </div>
  )
}
