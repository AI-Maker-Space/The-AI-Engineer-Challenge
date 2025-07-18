'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Settings, Key, MessageSquare } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userMessage, setUserMessage] = useState('')
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim() || !apiKey.trim()) {
      setError('Please enter both a message and your OpenAI API key')
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setUserMessage('')
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          api_key: apiKey,
          model: 'gpt-4.1-mini'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        accumulatedContent += chunk

        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setMessages(prev => prev.slice(0, -1)) // Remove the user message if there was an error
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Engineer Challenge</h1>
              <p className="text-sm text-gray-600">Powered by OpenAI GPT</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className="btn-secondary text-sm"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 p-4 animate-slide-up">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Message
                </label>
                <textarea
                  value={developerMessage}
                  onChange={(e) => setDeveloperMessage(e.target.value)}
                  placeholder="You are a helpful AI assistant..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto chat-container mb-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">Welcome to AI Engineer Challenge!</h3>
              <p className="max-w-md">
                Start a conversation by typing a message below. Make sure to configure your OpenAI API key in the settings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <User className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-message assistant-message">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-gray-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message here..."
              className="input-field"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !userMessage.trim()}
            className="btn-primary flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </main>
    </div>
  )
} 