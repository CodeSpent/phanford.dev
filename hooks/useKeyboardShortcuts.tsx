import { useEffect, useCallback, DependencyList } from 'react'

interface IUseKeyboardShortcut {
  keySequence: string // a string representing a sequence of keys, e.g. "Shift+a" or "Ctrl+Alt+s"
  callback: () => void // a callback to execute when the key sequence is pressed
  deps?: DependencyList // dependencies to handle the callback re-creation
  enabled?: boolean
}

export function useKeyboardShortcut({
  keySequence,
  callback,
  enabled,
  deps = [],
}: IUseKeyboardShortcut) {
  // Create a memoized callback to avoid unnecessary re-creations
  const memoizedCallback = useCallback(callback, deps)

  useEffect(() => {
    if (!enabled) return

    // Parse the key sequence into individual keys
    const keys = keySequence.split('+').map(key => key.trim().toLowerCase())

    const onKeydown = (e: KeyboardEvent) => {
      // Check if all keys in the sequence are pressed
      if (
        keys.every(
          key =>
            (key === 'ctrl' && e.ctrlKey) ||
            (key === 'alt' && e.altKey) ||
            (key === 'shift' && e.shiftKey) ||
            key === e.key.toLowerCase()
        )
      ) {
        memoizedCallback()
      }
    }

    // Adding the event listener
    document.addEventListener('keydown', onKeydown)

    // Cleanup: removing the event listener when component unmounts or dependencies change
    return () => document.removeEventListener('keydown', onKeydown)
  }, [keySequence, memoizedCallback])
}
