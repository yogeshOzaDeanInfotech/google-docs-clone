"use client"

import React from "react"
import { 
  FileText, 
  Star, 
  FolderOpen, 
  Share2, 
  MessageSquare,
  History,
  UserCircle2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDocumentStore } from "@/lib/document-store"
import { exportToPDF, exportToText, exportToHTML, exportToWord } from "@/lib/export-utils"

export function Header() {
  const { title, updateTitle, content } = useDocumentStore()
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [localTitle, setLocalTitle] = React.useState(title)
  const [showFileMenu, setShowFileMenu] = React.useState(false)

  React.useEffect(() => {
    setLocalTitle(title)
  }, [title])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showFileMenu && !(e.target as HTMLElement).closest('.relative')) {
        setShowFileMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showFileMenu])

  const handleTitleSubmit = () => {
    updateTitle(localTitle)
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      setLocalTitle(title)
      setIsEditingTitle(false)
    }
  }

  const handleExportPDF = async () => {
    const element = document.querySelector('.document-paper') as HTMLElement
    if (element) {
      await exportToPDF(element, title)
    }
  }

  const handleExportWord = () => {
    exportToWord(content, title)
  }

  const handleExportText = () => {
    exportToText(content, title)
  }

  const handleExportHTML = () => {
    exportToHTML(content, title)
  }

  return (
    <header className="bg-white border-b px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-9 w-9 text-blue-600" />
          <div className="flex flex-col">
            {isEditingTitle ? (
              <Input
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                className="h-7 text-lg font-normal px-1 py-0"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-lg text-gray-700 hover:border hover:border-gray-300 rounded px-1 -ml-1"
              >
                {title}
              </button>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="relative">
                <button 
                  className="hover:bg-gray-100 rounded px-2 py-1"
                  onClick={() => setShowFileMenu(!showFileMenu)}
                >
                  File
                </button>
                {showFileMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg py-1 z-50 min-w-[200px]">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        handleExportPDF()
                        setShowFileMenu(false)
                      }}
                    >
                      Download as PDF
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        handleExportWord()
                        setShowFileMenu(false)
                      }}
                    >
                      Download as Word
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        handleExportText()
                        setShowFileMenu(false)
                      }}
                    >
                      Download as Text
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        handleExportHTML()
                        setShowFileMenu(false)
                      }}
                    >
                      Download as HTML
                    </button>
                    <div className="border-t my-1"></div>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        window.print()
                        setShowFileMenu(false)
                      }}
                    >
                      Print
                    </button>
                  </div>
                )}
              </div>
              <button className="hover:bg-gray-100 rounded px-2 py-1">Edit</button>
              <button className="hover:bg-gray-100 rounded px-2 py-1">View</button>
              <button className="hover:bg-gray-100 rounded px-2 py-1">Insert</button>
              <button className="hover:bg-gray-100 rounded px-2 py-1">Format</button>
              <button className="hover:bg-gray-100 rounded px-2 py-1">Tools</button>
              <button className="hover:bg-gray-100 rounded px-2 py-1">Extensions</button>
              <button className="hover:bg-gray-100 rounded px-2 py-1">Help</button>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="ml-4">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <FolderOpen className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <History className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="icon" className="ml-2">
            <UserCircle2 className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </header>
  )
}