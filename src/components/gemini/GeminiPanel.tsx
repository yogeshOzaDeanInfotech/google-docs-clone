'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, ChevronLeft, Send, Copy, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocumentStore } from '@/lib/document-store'
import { geminiService } from '@/lib/gemini'
import { Message } from '@/types/gemini'
import { generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface GeminiPanelProps {
  isOpen: boolean
  onToggle: () => void
}

export function GeminiPanel({ isOpen, onToggle }: GeminiPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentDocument } = useDocumentStore()

  useEffect(() => {
    // Initialize Gemini with API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (apiKey) {
      geminiService.initialize(apiKey)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get document context
      const documentContext = currentDocument?.content
        ? currentDocument.content.replace(/<[^>]*>/g, '').substring(0, 1000) + '...'
        : undefined

      const response = await geminiService.generateContent(input, documentContext)
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.text || 'I apologize, but I couldn\'t generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
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
      handleSend()
    }
  }

  const insertAtCursor = (text: string) => {
    // In a real implementation, this would insert at the cursor position
    // For now, we'll append to the document
    const quill = (window as any).quillInstance
    if (quill) {
      const range = quill.getSelection()
      quill.insertText(range?.index || 0, text)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const quickActions = [
    { label: 'Improve writing', prompt: 'Please improve the writing in my document' },
    { label: 'Fix grammar', prompt: 'Please fix any grammar issues in my document' },
    { label: 'Make it formal', prompt: 'Please make my document more formal' },
    { label: 'Summarize', prompt: 'Please summarize my document' },
  ]

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-50",
        isOpen ? "w-96" : "w-0"
      )}
    >
      {isOpen && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Gemini</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600 mb-2">Quick actions</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(action.prompt)}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Ask Gemini to help with your document</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && (
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertAtCursor(message.content)}
                        className="h-6 text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Insert
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content)}
                        className="h-6 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Gemini anything..."
                className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-white shadow-lg rounded-l-lg p-2 hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  )
}