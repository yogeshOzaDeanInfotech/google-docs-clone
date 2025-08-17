import { useEffect } from 'react'

interface ShortcutHandler {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check each shortcut
      for (const shortcut of shortcuts) {
        const ctrlOrMeta = shortcut.ctrl || shortcut.meta
        const isCtrlPressed = event.ctrlKey || event.metaKey
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!ctrlOrMeta || isCtrlPressed) &&
          (!shortcut.shift || event.shiftKey) &&
          (!shortcut.alt || event.altKey)
        ) {
          event.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}

// Common shortcuts for document editing
export const documentShortcuts = {
  bold: { key: 'b', ctrl: true },
  italic: { key: 'i', ctrl: true },
  underline: { key: 'u', ctrl: true },
  save: { key: 's', ctrl: true },
  print: { key: 'p', ctrl: true },
  undo: { key: 'z', ctrl: true },
  redo: { key: 'y', ctrl: true },
  find: { key: 'f', ctrl: true },
  selectAll: { key: 'a', ctrl: true },
}