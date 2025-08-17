export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface GeminiState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, documentContext?: string) => Promise<void>
  clearMessages: () => void
}

export interface GeminiConfig {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}