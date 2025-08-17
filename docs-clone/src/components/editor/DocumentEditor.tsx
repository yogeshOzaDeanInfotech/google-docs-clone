"use client"

import React, { useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Toolbar } from './Toolbar'
import { useDocumentStore } from '@/lib/document-store'
import { useGeminiStore } from '@/lib/gemini-store'

export function DocumentEditor() {
  const { content, updateContent } = useDocumentStore()
  const { setInsertCallback } = useGeminiStore()
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      updateContent(html)
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror',
      },
    },
  })

  // Set up the insert callback for Gemini integration
  useEffect(() => {
    if (editor) {
      setInsertCallback((text: string) => {
        editor.chain().focus().insertContent(text).run()
      })
    }
  }, [editor, setInsertCallback])

  // Update editor content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="flex flex-col h-full">
      <Toolbar editor={editor} />
      <div className="ruler"></div>
      <div className="document-container flex-1 overflow-y-auto">
        <div className="document-paper">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}