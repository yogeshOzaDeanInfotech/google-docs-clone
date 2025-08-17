"use client"

import React from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "./ChatInterface"

interface GeminiPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function GeminiPanel({ isOpen, onClose }: GeminiPanelProps) {
  if (!isOpen) return null

  return (
    <div className="gemini-panel w-96">
      <div className="gemini-header">
        <div className="flex items-center gap-2 flex-1">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="font-medium">Gemini</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ChatInterface />
    </div>
  )
}