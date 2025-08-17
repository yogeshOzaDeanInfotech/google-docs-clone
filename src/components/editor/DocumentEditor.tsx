'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useDocumentStore } from '@/lib/document-store'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Toolbar } from './Toolbar'
import 'react-quill/dist/quill.snow.css'

// Dynamic import for react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 animate-pulse" />
})

// Custom toolbar configuration
const modules = {
  toolbar: false, // We'll use our custom toolbar
  history: {
    delay: 1000,
    maxStack: 500,
    userOnly: false
  }
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'align',
  'color',
  'background',
  'code-block'
]

export function DocumentEditor() {
  const quillRef = useRef<any>(null)
  const { currentDocument, updateContent } = useDocumentStore()
  const [content, setContent] = useState('')
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (currentDocument) {
      setContent(currentDocument.content)
    }
  }, [currentDocument])

  const handleChange = useCallback((value: string) => {
    setContent(value)
    updateContent(value)
  }, [updateContent])

  const handleFormat = useCallback((command: string, value?: string) => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    switch (command) {
      case 'undo':
        quill.history.undo()
        break
      case 'redo':
        quill.history.redo()
        break
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strike':
        quill.format(command, !quill.getFormat()[command])
        break
      case 'fontSize':
        quill.format('size', value === '11' ? false : value + 'px')
        break
      case 'fontFamily':
        quill.format('font', value === 'Arial' ? false : value)
        break
      case 'align':
        quill.format('align', value)
        break
      case 'list':
        if (value === 'bullet') {
          quill.format('list', 'bullet')
        } else if (value === 'ordered') {
          quill.format('list', 'ordered')
        }
        break
      case 'indent':
        if (value === 'increase') {
          quill.format('indent', '+1')
        } else {
          quill.format('indent', '-1')
        }
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) {
          quill.format('link', url)
        }
        break
      case 'image':
        const imageUrl = prompt('Enter image URL:')
        if (imageUrl) {
          const range = quill.getSelection()
          quill.insertEmbed(range?.index || 0, 'image', imageUrl)
        }
        break
      case 'color':
        // In a real app, you'd show a color picker
        const color = prompt('Enter color (hex):')
        if (color) {
          quill.format('color', color)
        }
        break
      case 'background':
        // In a real app, you'd show a color picker
        const bgColor = prompt('Enter background color (hex):')
        if (bgColor) {
          quill.format('background', bgColor)
        }
        break
      case 'print':
        window.print()
        break
    }

    // Update active formats
    updateActiveFormats()
  }, [])

  const updateActiveFormats = useCallback(() => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    const formats = quill.getFormat()
    const active = new Set<string>()

    if (formats.bold) active.add('bold')
    if (formats.italic) active.add('italic')
    if (formats.underline) active.add('underline')
    if (formats.strike) active.add('strike')
    if (formats.align === 'center') active.add('align-center')
    if (formats.align === 'right') active.add('align-right')
    if (formats.align === 'justify') active.add('align-justify')
    if (!formats.align || formats.align === 'left') active.add('align-left')
    if (formats.list === 'bullet') active.add('list-bullet')
    if (formats.list === 'ordered') active.add('list-ordered')

    setActiveFormats(active)
  }, [])

  const handleSelectionChange = useCallback(() => {
    updateActiveFormats()
  }, [updateActiveFormats])

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'b', ctrl: true, handler: () => handleFormat('bold') },
    { key: 'i', ctrl: true, handler: () => handleFormat('italic') },
    { key: 'u', ctrl: true, handler: () => handleFormat('underline') },
    { key: 'z', ctrl: true, handler: () => handleFormat('undo') },
    { key: 'y', ctrl: true, handler: () => handleFormat('redo') },
    { key: 'p', ctrl: true, handler: () => handleFormat('print') },
  ])

  // Store quill instance globally for Gemini integration
  useEffect(() => {
    if (quillRef.current) {
      (window as any).quillInstance = quillRef.current.getEditor()
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <Toolbar onFormat={handleFormat} activeFormats={activeFormats} />
      
      {/* Ruler */}
      <div className="h-8 bg-gray-100 border-b flex items-center px-4">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="absolute inset-0 flex">
            {[...Array(17)].map((_, i) => (
              <div key={i} className="flex-1 border-l border-gray-300 h-2 mt-3">
                <span className="text-xs text-gray-500 ml-1">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Container */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="max-w-4xl mx-auto my-8">
          <div 
            className="bg-white shadow-lg"
            style={{
              minHeight: '11in',
              width: '8.5in',
              padding: '1in',
              margin: '0 auto',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              onChangeSelection={handleSelectionChange}
              className="h-full border-0"
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.5'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}