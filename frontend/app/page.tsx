'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Key, Settings } from 'lucide-react'
import { ChatMessage, ApiKeyModal } from '@/components'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://the-ai-engineer-challenge-backend-rho.vercel.app'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [developerMessage, setDeveloperMessage] = useState('You are a helpful AI assistant.')
  const [model, setModel] = useState('gpt-4.1-mini')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load API key from localStorage on component mount
  useEffect(() => {
    console.log('Checking for saved API key...')
    const savedApiKey = localStorage.getItem('openai_api_key')
    if (savedApiKey) {
      console.log('Found saved API key')
      setApiKey(savedApiKey)
    } else {
      console.log('No saved API key found, showing modal')
      setShowApiKeyModal(true)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleApiKeySave = (key: string) => {
    console.log('Saving API key:', key.substring(0, 10) + '...')
    setApiKey(key)
    localStorage.setItem('openai_api_key', key)
    setShowApiKeyModal(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || !apiKey || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: input,
          model: model,
          api_key: apiKey
        })
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
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value)
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          )
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
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
      sendMessage()
    }
  }

  console.log('Current modal state:', showApiKeyModal)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-white">AI Engineer Challenge</h1>
          </div>
          <div
            onClick={() => {
              console.log('API Key button clicked')
              setShowApiKeyModal(true)
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                console.log('API Key button activated via keyboard')
                setShowApiKeyModal(true)
              }
            }}
          >
            <Key className="h-4 w-4" />
            <span>API Key</span>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <div className="bg-dark-800 border-b border-dark-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-400" />
              <label className="text-sm text-gray-300">System Message:</label>
              <input
                type="text"
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                className="px-3 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm w-64"
                placeholder="Enter system message..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Model:</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="px-3 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
              >
                <option value="gpt-4.1-mini">GPT-4.1-mini</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-primary-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                Welcome to AI Engineer Challenge
              </h2>
              <p className="text-gray-400">
                Start a conversation by typing a message below
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="chat-message assistant-message">
              <div className="typing-indicator">
                <span className="text-sm text-gray-400">AI is thinking</span>
                <div className="typing-dot"></div>
                <div className="typing-dot" style={{ animationDelay: '0.1s' }}></div>
                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-dark-800 border-t border-dark-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                disabled={isLoading || !apiKey}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || !apiKey}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal onSave={handleApiKeySave} onClose={() => setShowApiKeyModal(false)} />
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        //   <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4 border border-dark-700">
        //     <h2 className="text-xl font-semibold text-white mb-4">API Key Modal Test</h2>
        //     <p className="text-gray-300 mb-4">Modal is working!</p>
        //     <button
        //       onClick={() => {
        //         console.log('Test close button clicked')
        //         setShowApiKeyModal(false)
        //       }}
        //       className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
        //     >
        //       Close
        //     </button>
        //   </div>
        // </div>
      )}
    </div>
  )
}
