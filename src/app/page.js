'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { DocumentEditor } from '@/components/editor/DocumentEditor'
import { GeminiPanel } from '@/components/gemini/GeminiPanel'
import { useDocumentStore } from '@/lib/document-store'

export default function Home() {
  const [isGeminiOpen, setIsGeminiOpen] = useState(false)
  const { currentDocument, createDocument } = useDocumentStore()

  useEffect(() => {
    // Create RTI template document on first load
    if (!currentDocument) {
      createDocument('RTI_MARATHI')
    }
  }, [currentDocument, createDocument])

  const toggleGemini = () => {
    setIsGeminiOpen(!isGeminiOpen)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <main className={`flex-1 transition-all duration-300 ${isGeminiOpen ? 'mr-96' : ''}`}>
          <DocumentEditor />
        </main>
        
        <GeminiPanel isOpen={isGeminiOpen} onToggle={toggleGemini} />
      </div>
    </div>
  )
}
