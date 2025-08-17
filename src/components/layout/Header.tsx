'use client'

import React, { useState, useEffect } from 'react'
import { Star, Folder, Share2, MessageSquare, VideoIcon, ChevronDown, Download, FileText, FileCode, FilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocumentStore } from '@/lib/document-store'
import { handleExport } from '@/lib/export-utils'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { currentDocument, updateTitle, createDocument } = useDocumentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('Untitled document')

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title)
    }
  }, [currentDocument])

  const handleTitleSubmit = () => {
    updateTitle(title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      setTitle(currentDocument?.title || 'Untitled document')
      setIsEditing(false)
    }
  }

  const handleExportClick = async (format: string) => {
    if (currentDocument) {
      try {
        await handleExport(currentDocument, format)
      } catch (error) {
        console.error('Export failed:', error)
      }
    }
  }

  const menuItems = {
    File: (
      <>
        <DropdownMenuItem onClick={() => createDocument()}>
          <FilePlus className="mr-2 h-4 w-4" />
          New Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => createDocument('RTI_MARATHI')}>
          <FileText className="mr-2 h-4 w-4" />
          New RTI Template
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Download className="mr-2 h-4 w-4" />
            Download as
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleExportClick('pdf')}>
              <FileText className="mr-2 h-4 w-4" />
              PDF (.pdf)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportClick('docx')}>
              <FileText className="mr-2 h-4 w-4" />
              Word (.docx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportClick('html')}>
              <FileCode className="mr-2 h-4 w-4" />
              HTML (.html)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportClick('txt')}>
              <FileText className="mr-2 h-4 w-4" />
              Plain Text (.txt)
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.print()}>Print</DropdownMenuItem>
      </>
    ),
    Edit: (
      <>
        <DropdownMenuItem>Undo</DropdownMenuItem>
        <DropdownMenuItem>Redo</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Cut</DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem>Paste</DropdownMenuItem>
      </>
    ),
    View: (
      <>
        <DropdownMenuItem>Show ruler</DropdownMenuItem>
        <DropdownMenuItem>Show outline</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Full screen</DropdownMenuItem>
      </>
    ),
    Insert: (
      <>
        <DropdownMenuItem>Image</DropdownMenuItem>
        <DropdownMenuItem>Link</DropdownMenuItem>
        <DropdownMenuItem>Table</DropdownMenuItem>
        <DropdownMenuItem>Drawing</DropdownMenuItem>
      </>
    ),
    Format: (
      <>
        <DropdownMenuItem>Bold</DropdownMenuItem>
        <DropdownMenuItem>Italic</DropdownMenuItem>
        <DropdownMenuItem>Underline</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Clear formatting</DropdownMenuItem>
      </>
    ),
    Tools: (
      <>
        <DropdownMenuItem>Word count</DropdownMenuItem>
        <DropdownMenuItem>Review suggested edits</DropdownMenuItem>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
      </>
    ),
    Extensions: (
      <>
        <DropdownMenuItem>Add-ons</DropdownMenuItem>
        <DropdownMenuItem>Apps Script</DropdownMenuItem>
      </>
    ),
    Help: (
      <>
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem>Training</DropdownMenuItem>
        <DropdownMenuItem>Updates</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Report a problem</DropdownMenuItem>
      </>
    ),
  }

  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        {/* Logo and Document Title */}
        <div className="flex items-center space-x-3">
          {/* Google Docs Logo */}
          <div className="p-2">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M25 2H10C8.9 2 8 2.9 8 4V36C8 37.1 8.9 38 10 38H30C31.1 38 32 37.1 32 36V9L25 2Z" fill="#4285F4"/>
              <path d="M25 2V9H32L25 2Z" fill="#A1C2FA"/>
              <path d="M14 21H26V23H14V21ZM14 25H26V27H14V25ZM14 29H26V31H14V29ZM14 17H26V19H14V17Z" fill="white"/>
            </svg>
          </div>

          <div className="flex flex-col">
            {/* Document Title */}
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-normal outline-none border-b-2 border-blue-500 px-1"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-lg font-normal cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  {title}
                </h1>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Folder className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>

            {/* Menu Bar */}
            <nav className="flex items-center space-x-1 text-sm">
              {Object.entries(menuItems).map(([item, content]) => (
                <DropdownMenu key={item}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-1 hover:bg-gray-100 rounded text-gray-700">
                      {item}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {content}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <VideoIcon className="h-5 w-5" />
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
            U
          </div>
        </div>
      </div>
    </header>
  )
}