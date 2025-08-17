'use client'

import React, { useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Undo,
  Redo,
  Printer,
  ChevronDown,
  Palette,
  Highlighter,
  Plus,
  Minus,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FONT_FAMILIES, FONT_SIZES } from '@/constants/templates'
import { cn } from '@/lib/utils'

interface ToolbarProps {
  onFormat: (command: string, value?: string) => void
  activeFormats?: Set<string>
}

export function Toolbar({ onFormat, activeFormats = new Set() }: ToolbarProps) {
  const [fontSize, setFontSize] = useState('11')
  const [fontFamily, setFontFamily] = useState('Arial')

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    onFormat('fontSize', size)
  }

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family)
    onFormat('fontFamily', family)
  }

  const isActive = (format: string) => activeFormats.has(format)

  return (
    <div className="border-b bg-gray-50 px-3 py-1">
      <div className="flex items-center space-x-1">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('undo')}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('redo')}
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('print')}
        >
          <Printer className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-gray-300" />

        {/* Font Family */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-3 w-32 justify-between">
              <span className="truncate">{fontFamily}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            {FONT_FAMILIES.map((font) => (
              <DropdownMenuItem
                key={font}
                onClick={() => handleFontFamilyChange(font)}
                className={cn(fontFamily === font && "bg-gray-100")}
                style={{ fontFamily: font }}
              >
                {font}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-gray-300" />

        {/* Font Size */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const currentSize = parseInt(fontSize)
            if (currentSize > 8) {
              handleFontSizeChange(String(currentSize - 1))
            }
          }}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 w-16 justify-between">
              <span>{fontSize}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-16">
            {FONT_SIZES.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => handleFontSizeChange(String(size))}
                className={cn(fontSize === String(size) && "bg-gray-100")}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const currentSize = parseInt(fontSize)
            if (currentSize < 72) {
              handleFontSizeChange(String(currentSize + 1))
            }
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>

        <div className="h-5 w-px bg-gray-300" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('bold') && "bg-gray-200")}
          onClick={() => onFormat('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('italic') && "bg-gray-200")}
          onClick={() => onFormat('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('underline') && "bg-gray-200")}
          onClick={() => onFormat('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('strike') && "bg-gray-200")}
          onClick={() => onFormat('strike')}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        {/* Text Color */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('color')}
        >
          <Palette className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('background')}
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-gray-300" />

        {/* Insert */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('link')}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('image')}
        >
          <Image className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-gray-300" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('align-left') && "bg-gray-200")}
          onClick={() => onFormat('align', 'left')}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('align-center') && "bg-gray-200")}
          onClick={() => onFormat('align', 'center')}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('align-right') && "bg-gray-200")}
          onClick={() => onFormat('align', 'right')}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('align-justify') && "bg-gray-200")}
          onClick={() => onFormat('align', 'justify')}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-gray-300" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('list-bullet') && "bg-gray-200")}
          onClick={() => onFormat('list', 'bullet')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive('list-ordered') && "bg-gray-200")}
          onClick={() => onFormat('list', 'ordered')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Indent */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('indent', 'decrease')}
        >
          <Outdent className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onFormat('indent', 'increase')}
        >
          <Indent className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-gray-300" />

        {/* More Options */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}