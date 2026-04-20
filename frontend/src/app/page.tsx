"use client"
import { useEffect, useRef, useState } from 'react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function HomePage() {
  const [apiKey, setApiKey] = useState<string>(typeof window !== 'undefined' ? localStorage.getItem('OPENAI_API_KEY') || '' : '')
  const [model, setModel] = useState<string>('gpt-4.1-mini')
  const [developerMessage, setDeveloperMessage] = useState<string>('You are a helpful AI assistant.')
  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const streamBuffer = useRef<string>('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('OPENAI_API_KEY', apiKey)
  }, [apiKey])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!apiKey) {
      alert('Please provide your OpenAI API key.')
      return
    }
    if (!input.trim() || isStreaming) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' }
    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)
    streamBuffer.current = ''

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMsg.content,
          model,
          api_key: apiKey,
        }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        streamBuffer.current += chunk
        setMessages(prev => prev.map(m => (m.id === assistantMsg.id ? { ...m, content: streamBuffer.current } : m)))
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => prev.map(m => (m.id === assistantMsg.id ? { ...m, content: `Error: ${message}` } : m)))
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4">
      <header className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">OpenAI Chat</h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2"
            placeholder="OpenAI API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2"
            placeholder="Model (e.g., gpt-4.1-mini)"
            value={model}
            onChange={e => setModel(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2"
            placeholder="System prompt"
            value={developerMessage}
            onChange={e => setDeveloperMessage(e.target.value)}
          />
        </div>
      </header>

      <section ref={listRef} className="mb-24 h-[55vh] overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
        {messages.length === 0 ? (
          <p className="text-neutral-500">Start a conversation below. Responses stream in real time.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block whitespace-pre-wrap rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-900'}`}>
                  {m.content || (isStreaming && m.role === 'assistant' ? '…' : '')}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="fixed inset-x-0 bottom-0 mx-auto max-w-3xl p-4">
        <div className="flex gap-2 rounded-xl bg-white p-2 shadow-sm">
          <textarea
            className="min-h-[48px] max-h-40 flex-1 resize-y rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="h-12 rounded-lg bg-blue-600 px-4 font-medium text-white disabled:opacity-50"
          >
            {isStreaming ? 'Streaming…' : 'Send'}
          </button>
        </div>
      </footer>
    </main>
  )
}

