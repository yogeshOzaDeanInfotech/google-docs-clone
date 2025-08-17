"use client"

import React from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  Link2, 
  Image, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Printer,
  Palette,
  MoreVertical,
  Type,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Editor } from '@tiptap/react'

interface ToolbarProps {
  editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="toolbar">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="toolbar-button"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="toolbar-button"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="toolbar-button"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button variant="ghost" size="sm" className="toolbar-button gap-1">
        <Type className="h-4 w-4" />
        <span className="text-sm">100%</span>
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button variant="ghost" size="sm" className="toolbar-button gap-1">
        <span className="text-sm">Normal text</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button variant="ghost" size="sm" className="toolbar-button gap-1">
        <span className="text-sm">Arial</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button variant="ghost" size="sm" className="toolbar-button gap-1">
        <span className="text-sm">11</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`toolbar-button ${editor.isActive('underline') ? 'active' : ''}`}
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="sm" className="toolbar-button">
        <Palette className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button variant="ghost" size="sm" className="toolbar-button">
        <Link2 className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="sm" className="toolbar-button">
        <Image className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="toolbar-separator" />
      
      <Button variant="ghost" size="sm" className="toolbar-button">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  )
}