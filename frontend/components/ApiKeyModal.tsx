'use client'

import { useState } from 'react'
import { Key, Eye, EyeOff, X } from 'lucide-react'

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void
  onClose: () => void
}

export function ApiKeyModal({ onSave, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')

  console.log('ApiKeyModal rendered')

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key')
      return
    }
    
    if (!apiKey.startsWith('sk-')) {
      setError('API key should start with "sk-"')
      return
    }
    
    onSave(apiKey)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4 border border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">OpenAI API Key</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-3">
            Enter your OpenAI API key to start chatting. Your key is stored locally and never sent to our servers.
          </p>
          
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setError('')
              }}
              onKeyPress={handleKeyPress}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Save Key
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-dark-700 rounded-lg">
          <p className="text-xs text-gray-400">
            <strong>How to get your API key:</strong>
            <br />
            1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">platform.openai.com/api-keys</a>
            <br />
            2. Sign in or create an account
            <br />
            3. Click "Create new secret key"
            <br />
            4. Copy the key and paste it here
          </p>
        </div>
      </div>
    </div>
  )
}
