import { create } from 'zustand'
import { Document, DocumentVersion } from '@/types/document'
import { generateId, debounce } from '@/lib/utils'
import { DOCUMENT_TEMPLATES } from '@/constants/templates'

interface DocumentState {
  currentDocument: Document | null
  versions: DocumentVersion[]
  isDirty: boolean
  isAutoSaveEnabled: boolean
  
  // Actions
  createDocument: (template?: string) => void
  updateDocument: (updates: Partial<Document>) => void
  updateContent: (content: string) => void
  updateTitle: (title: string) => void
  saveVersion: () => void
  loadDocument: (id: string) => void
  clearDocument: () => void
  toggleAutoSave: () => void
  exportDocument: (format: string) => void
}

const STORAGE_KEY = 'googledocs-clone-document'
const AUTOSAVE_DELAY = 30000 // 30 seconds

// Load document from localStorage
const loadFromStorage = (): Document | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const doc = JSON.parse(stored)
      // Convert date strings back to Date objects
      doc.lastModified = new Date(doc.lastModified)
      doc.createdAt = new Date(doc.createdAt)
      return doc
    }
  } catch (error) {
    console.error('Failed to load document from storage:', error)
  }
  
  return null
}

// Save document to localStorage
const saveToStorage = (document: Document) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(document))
  } catch (error) {
    console.error('Failed to save document to storage:', error)
  }
}

export const useDocumentStore = create<DocumentState>((set, get) => {
  // Auto-save functionality
  const autoSave = debounce(() => {
    const state = get()
    if (state.currentDocument && state.isDirty && state.isAutoSaveEnabled) {
      saveToStorage(state.currentDocument)
      set({ isDirty: false })
    }
  }, AUTOSAVE_DELAY)

  return {
    currentDocument: null,
    versions: [],
    isDirty: false,
    isAutoSaveEnabled: true,

    createDocument: (templateId?: string) => {
      const template = templateId 
        ? DOCUMENT_TEMPLATES[templateId as keyof typeof DOCUMENT_TEMPLATES]
        : DOCUMENT_TEMPLATES.BLANK

      const newDocument: Document = {
        id: generateId(),
        title: templateId === 'rti-marathi' ? 'RTI Application' : 'Untitled document',
        content: template?.content || '',
        lastModified: new Date(),
        createdAt: new Date(),
        version: 1
      }

      set({
        currentDocument: newDocument,
        versions: [],
        isDirty: true
      })

      // Save initial version
      get().saveVersion()
    },

    updateDocument: (updates: Partial<Document>) => {
      set(state => {
        if (!state.currentDocument) return state

        const updatedDoc = {
          ...state.currentDocument,
          ...updates,
          lastModified: new Date()
        }

        return {
          currentDocument: updatedDoc,
          isDirty: true
        }
      })

      autoSave()
    },

    updateContent: (content: string) => {
      get().updateDocument({ content })
    },

    updateTitle: (title: string) => {
      get().updateDocument({ title })
    },

    saveVersion: () => {
      const state = get()
      if (!state.currentDocument) return

      const version: DocumentVersion = {
        id: generateId(),
        documentId: state.currentDocument.id,
        content: state.currentDocument.content,
        timestamp: new Date(),
        version: state.currentDocument.version
      }

      set(state => ({
        versions: [...state.versions, version],
        currentDocument: state.currentDocument 
          ? { ...state.currentDocument, version: state.currentDocument.version + 1 }
          : null
      }))
    },

    loadDocument: (id: string) => {
      // In a real app, this would load from a database
      // For now, we'll try to load from localStorage
      const stored = loadFromStorage()
      if (stored && stored.id === id) {
        set({
          currentDocument: stored,
          isDirty: false
        })
      }
    },

    clearDocument: () => {
      set({
        currentDocument: null,
        versions: [],
        isDirty: false
      })
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    toggleAutoSave: () => {
      set(state => ({ isAutoSaveEnabled: !state.isAutoSaveEnabled }))
    },

    exportDocument: (format: string) => {
      // This will be handled by the export utility functions
      const doc = get().currentDocument
      if (!doc) return
      
      // Trigger export based on format
      console.log(`Exporting document as ${format}`)
    }
  }
})

// Initialize with stored document on load
if (typeof window !== 'undefined') {
  const stored = loadFromStorage()
  if (stored) {
    useDocumentStore.setState({
      currentDocument: stored,
      isDirty: false
    })
  }
}