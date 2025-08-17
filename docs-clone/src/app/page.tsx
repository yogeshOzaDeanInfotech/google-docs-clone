"use client"

import React, { useState } from "react"
import { Header } from "@/components/layout/Header"
import { DocumentEditor } from "@/components/editor/DocumentEditor"
import { GeminiPanel } from "@/components/gemini/GeminiPanel"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function Home() {
  const [isGeminiOpen, setIsGeminiOpen] = useState(true)

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <DocumentEditor />
        </div>
        {isGeminiOpen ? (
          <GeminiPanel 
            isOpen={isGeminiOpen} 
            onClose={() => setIsGeminiOpen(false)} 
          />
        ) : (
          <Button
            onClick={() => setIsGeminiOpen(true)}
            className="fixed right-4 bottom-4 rounded-full h-14 w-14 shadow-lg"
            size="icon"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  )
}