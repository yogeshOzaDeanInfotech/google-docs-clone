import { create } from 'zustand'
import { generateContent } from './gemini'
import { Message } from '@/types/gemini'

interface GeminiStore {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, documentContext?: string) => Promise<void>
  clearMessages: () => void
  insertAtCursor: (content: string) => void
  onInsertCallback?: (content: string) => void
  setInsertCallback: (callback: (content: string) => void) => void
}

export const useGeminiStore = create<GeminiStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  sendMessage: async (content: string, documentContext?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    }))
    
    try {
      const response = await generateContent(content, documentContext)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false
      }))
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  },
  
  clearMessages: () => set({ messages: [], error: null }),
  
  insertAtCursor: (content: string) => {
    const { onInsertCallback } = get()
    if (onInsertCallback) {
      onInsertCallback(content)
    }
  },
  
  setInsertCallback: (callback) => set({ onInsertCallback: callback })
}))