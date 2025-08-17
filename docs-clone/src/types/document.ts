export interface Document {
  id: string
  title: string
  content: string
  lastModified: Date
  createdAt: Date
}

export interface DocumentState {
  document: Document
  isLoading: boolean
  error: string | null
  updateDocument: (updates: Partial<Document>) => void
  saveDocument: () => Promise<void>
  loadDocument: (id: string) => Promise<void>
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'html'
  includeMetadata?: boolean
  paperSize?: 'A4' | 'Letter'
}

export interface EditorState {
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  fontSize: number
  fontFamily: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textColor: string
}