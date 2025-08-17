export interface Document {
  id: string
  title: string
  content: string
  lastModified: Date
  createdAt: Date
  version: number
}

export interface DocumentVersion {
  id: string
  documentId: string
  content: string
  timestamp: Date
  version: number
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'html'
  fileName?: string
  includeMetadata?: boolean
}

export interface FontStyle {
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  color: string
  backgroundColor?: string
}

export interface DocumentSelection {
  start: number
  end: number
  text: string
}