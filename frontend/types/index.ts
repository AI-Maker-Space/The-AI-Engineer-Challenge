export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatRequest {
  developer_message: string
  user_message: string
  model: string
  api_key: string
}
