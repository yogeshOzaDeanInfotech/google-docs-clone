export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

export interface GeminiResponse {
  text: string
  suggestions?: string[]
  error?: string
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  error: string | null
}

export interface GeminiConfig {
  apiKey: string
  model: string
  temperature?: number
  maxTokens?: number
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  prompt: string
  category: 'general' | 'document' | 'rti' | 'letter' | 'formatting'
}