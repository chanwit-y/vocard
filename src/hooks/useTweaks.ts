import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'vocard:tweaks:v1'

function readFromStorage<T extends Record<string, unknown>>(defaults: T): T {
  if (typeof window === 'undefined') return defaults
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<T> | null
    if (!parsed || typeof parsed !== 'object') return defaults
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

function writeToStorage<T>(values: T) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    // ignore quota / privacy-mode failures
  }
}

export function useTweaks<T extends Record<string, unknown>>(
  defaults: T,
): [T, <K extends keyof T>(key: K, value: T[K]) => void] {
  const [values, setValues] = useState<T>(() => readFromStorage(defaults))
  const latest = useRef(values)
  latest.current = values

  // Safety net: in case state is ever updated without going through setTweak,
  // mirror it to localStorage on the next paint.
  useEffect(() => {
    writeToStorage(values)
  }, [values])

  // Final flush before the page unloads, so a fast tab-close still persists.
  useEffect(() => {
    const flush = () => writeToStorage(latest.current)
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
    }
  }, [])

  const setTweak = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((prev) => {
        if (prev[key] === value) return prev
        const next = { ...prev, [key]: value }
        // Persist synchronously so the change is durable immediately.
        writeToStorage(next)
        return next
      })
    },
    [],
  )

  return [values, setTweak]
}
