import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { templates } from '@/constants/templates'

interface DocumentStore {
  id: string
  title: string
  content: string
  lastModified: Date
  createdAt: Date
  // Actions
  updateTitle: (title: string) => void
  updateContent: (content: string) => void
  loadTemplate: (templateKey: keyof typeof templates) => void
  clearDocument: () => void
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      id: 'doc-' + Date.now(),
      title: templates.rti.title,
      content: templates.rti.content,
      lastModified: new Date(),
      createdAt: new Date(),
      
      updateTitle: (title) => set((state) => ({ 
        title,
        lastModified: new Date()
      })),
      
      updateContent: (content) => set((state) => ({ 
        content,
        lastModified: new Date()
      })),
      
      loadTemplate: (templateKey) => set((state) => ({
        title: templates[templateKey].title,
        content: templates[templateKey].content,
        lastModified: new Date()
      })),
      
      clearDocument: () => set((state) => ({
        id: 'doc-' + Date.now(),
        title: 'Untitled document',
        content: '',
        lastModified: new Date(),
        createdAt: new Date()
      }))
    }),
    {
      name: 'document-storage',
      partialize: (state) => ({
        id: state.id,
        title: state.title,
        content: state.content,
        lastModified: state.lastModified,
        createdAt: state.createdAt
      })
    }
  )
)