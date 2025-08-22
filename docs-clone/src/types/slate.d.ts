import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomElement = 
  | { type: 'paragraph'; children: CustomText[]; align?: string; indent?: number }
  | { type: 'heading'; children: CustomText[]; level?: number; align?: string }
  | { type: 'list-item'; children: CustomText[]; align?: string; indent?: number }
  | { type: 'numbered-list'; children: CustomText[]; align?: string; indent?: number }
  | { type: 'block-quote'; children: CustomText[]; align?: string }
  | { type: 'code-block'; children: CustomText[]; align?: string }
  | { type: 'table'; children: TableRow[] }
  | { type: 'table-row'; children: TableCell[] }
  | { type: 'table-cell'; children: CustomText[] }
  | { type: 'image'; url: string; children: CustomText[] }
  | { type: 'divider'; children: CustomText[] }

export type TableRow = { type: 'table-row'; children: TableCell[] }
export type TableCell = { type: 'table-cell'; children: CustomText[] }

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  subscript?: boolean
  superscript?: boolean
  code?: boolean
  color?: string
  backgroundColor?: string
  link?: string
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}