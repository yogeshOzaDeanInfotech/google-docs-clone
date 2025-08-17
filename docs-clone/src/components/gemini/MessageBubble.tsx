"use client"

import React from "react"
import { Copy, FileText, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Message } from "@/types/gemini"
import { useGeminiStore } from "@/lib/gemini-store"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { insertAtCursor } = useGeminiStore()
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }
  
  const handleInsert = () => {
    insertAtCursor(message.content)
  }
  
  return (
    <div className={`gemini-message ${message.role}`}>
      {message.role === "assistant" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      )}
      
      <div className="flex-1">
        <div className="gemini-message-content">
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.role === "assistant" && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInsert}
                className="text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Insert
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {message.role === "user" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      )}
    </div>
  )
}