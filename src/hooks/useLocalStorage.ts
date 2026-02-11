/**
 * Custom hook for localStorage with TypeScript and error handling
 * Provides reactive state management with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react'

export interface LocalStorageOptions<T> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  syncAcrossTabs?: boolean
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: LocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const serializer = options?.serializer || JSON.stringify
  const deserializer = options?.deserializer || JSON.parse
  const syncAcrossTabs = options?.syncAcrossTabs ?? true

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserializer(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Set value in localStorage and state
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, serializer]
  )

  // Remove value from localStorage and reset to initial
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for storage events (sync across tabs)
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue))
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserializer, syncAcrossTabs])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for storing boolean values in localStorage
 */
export function useLocalStorageBool(
  key: string,
  initialValue: boolean
): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void, () => void] {
  return useLocalStorage(key, initialValue)
}

/**
 * Hook for storing number values in localStorage
 */
export function useLocalStorageNumber(
  key: string,
  initialValue: number
): [number, (value: number | ((prev: number) => number)) => void, () => void] {
  return useLocalStorage(key, initialValue)
}

/**
 * Hook for storing string values in localStorage
 */
export function useLocalStorageString(
  key: string,
  initialValue: string
): [string, (value: string | ((prev: string) => string)) => void, () => void] {
  return useLocalStorage(key, initialValue)
}

/**
 * Hook for storing array values in localStorage
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[]
): [T[], (value: T[] | ((prev: T[]) => T[])) => void, () => void] {
  return useLocalStorage<T[]>(key, initialValue)
}

/**
 * Hook for storing object values in localStorage
 */
export function useLocalStorageObject<T extends Record<string, unknown>>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  return useLocalStorage<T>(key, initialValue)
}
