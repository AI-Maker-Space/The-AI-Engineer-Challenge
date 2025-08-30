'use client'

import { useState, useRef } from 'react'
import './globals.css'

type Role = 'developer' | 'user' | 'assistant'

export default function HomePage() {
  const [developerMessage, setDeveloperMessage] = useState(
    'You are a concise, helpful assistant.'
  )
  const [userMessage, setUserMessage] = useState('Hello!')
  const [model, setModel] = useState('gpt-4.1-mini')
  // API key is now read server-side from OPENAI_API_KEY; no client key needed
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState<Array<{ role: Role; content: string }>>([
    { role: 'developer', content: 'System: You are a concise, helpful assistant.' },
  ])
  const controllerRef = useRef<AbortController | null>(null)

  async function handleSend() {
    setIsLoading(true)
    controllerRef.current = new AbortController()
    setTranscript((t) => [
      ...t,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' },
    ])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model,
          // api_key omitted; backend uses OPENAI_API_KEY from env
        }),
        signal: controllerRef.current.signal,
      })
      if (!res.ok) {
        let errorText = ''
        try {
          errorText = await res.text()
        } catch {}
        throw new Error(`HTTP ${res.status} ${res.statusText}${errorText ? ` - ${errorText}` : ''}`)
      }
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let assistantText = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setTranscript((t) => {
          const copy = t.slice()
          // Overwrite the last assistant message with the streamed content
          copy[copy.length - 1] = { role: 'assistant', content: assistantText }
          return copy
        })
      }
    } catch (err) {
      console.error(err)
      setTranscript((t) => [
        ...t,
        { role: 'assistant', content: 'Error: ' + (err as Error).message },
      ])
    } finally {
      setIsLoading(false)
      controllerRef.current = null
    }
  }

  function handleAbort() {
    controllerRef.current?.abort()
    setIsLoading(false)
  }

  return (
    <div className="container">
      <h1>AI Engineer Chat</h1>
      <p style={{ color: 'var(--muted)' }}>
        Frontend for FastAPI backend at <code>/api/chat</code>
      </p>

      <div className="card col" style={{ gap: 16 }}>
        <div className="row" style={{ gap: 16 }}>
          <select
            className="select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="gpt-4.1-mini">gpt-4.1-mini</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
          </select>
        </div>

        <textarea
          className="textarea"
          rows={3}
          placeholder="Developer (system) message"
          value={developerMessage}
          onChange={(e) => setDeveloperMessage(e.target.value)}
        />

        <div className="row">
          <input
            className="input"
            placeholder="Your message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            style={{ flex: 1 }}
          />
          <button className="button" onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Streaming…' : 'Send'}
          </button>
          {isLoading && (
            <button className="button" onClick={handleAbort}>Stop</button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="logs">
          {transcript.map((m, i) => (
            <div key={i} className={`msg-${m.role}`}>
              <strong>{m.role}:</strong> {m.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


