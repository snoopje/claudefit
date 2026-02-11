/**
 * Storage service with localStorage abstraction and error handling
 * Manages all local data persistence for ClaudeFit
 */

import { STORAGE_KEYS } from '../types'

/**
 * Storage error types
 */
export enum StorageErrorType {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom storage error
 */
export class StorageError extends Error {
  constructor(
    public type: StorageErrorType,
    message: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * Storage result type
 */
type StorageResult<T> = {
  success: boolean
  data?: T
  error?: StorageError
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get remaining localStorage space estimate (in bytes)
 * Note: This is an approximation as browsers don't expose exact quota
 */
export function getStorageSizeInfo(): { used: number; remaining: number } {
  let total = 0
  let used = 0

  if (!isStorageAvailable()) {
    return { used: 0, remaining: 0 }
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      if (value) {
        used += key.length + value.length
      }
    }
  }

  // Most browsers have ~5-10MB limit, using 5MB as conservative estimate
  total = 5 * 1024 * 1024 // 5MB in bytes (assuming 2 bytes per char)

  return {
    used: used * 2, // Approximate bytes (2 bytes per char)
    remaining: total - used * 2,
  }
}

/**
 * Get item from localStorage with error handling
 */
export function getItem<T>(key: string): StorageResult<T> {
  try {
    if (!isStorageAvailable()) {
      throw new Error('localStorage is not available')
    }

    const item = localStorage.getItem(key)

    if (item === null) {
      return { success: true, data: undefined }
    }

    const parsed = JSON.parse(item) as T
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: new StorageError(StorageErrorType.PARSE_ERROR, `Failed to parse data for key: ${key}`, error),
      }
    }
    return {
      success: false,
      error: new StorageError(StorageErrorType.UNKNOWN, `Failed to get item: ${key}`, error),
    }
  }
}

/**
 * Set item in localStorage with error handling
 */
export function setItem<T>(key: string, value: T): StorageResult<void> {
  try {
    if (!isStorageAvailable()) {
      throw new Error('localStorage is not available')
    }

    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)

    return { success: true }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      return {
        success: false,
        error: new StorageError(StorageErrorType.QUOTA_EXCEEDED, 'Storage quota exceeded. Please clear some data.', error),
      }
    }
    return {
      success: false,
      error: new StorageError(StorageErrorType.UNKNOWN, `Failed to set item: ${key}`, error),
    }
  }
}

/**
 * Remove item from localStorage with error handling
 */
export function removeItem(key: string): StorageResult<void> {
  try {
    if (!isStorageAvailable()) {
      throw new Error('localStorage is not available')
    }

    localStorage.removeItem(key)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: new StorageError(StorageErrorType.UNKNOWN, `Failed to remove item: ${key}`, error),
    }
  }
}

/**
 * Clear all ClaudeFit data from localStorage
 */
export function clearAllData(): StorageResult<void> {
  try {
    if (!isStorageAvailable()) {
      throw new Error('localStorage is not available')
    }

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: new StorageError(StorageErrorType.UNKNOWN, 'Failed to clear data', error),
    }
  }
}

/**
 * Get all ClaudeFit data
 */
export function getAllData(): StorageResult<Record<string, unknown>> {
  const result: Record<string, unknown> = {}

  try {
    if (!isStorageAvailable()) {
      throw new Error('localStorage is not available')
    }

    Object.entries(STORAGE_KEYS).forEach(([_, key]) => {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          result[key] = JSON.parse(item)
        } catch {
          result[key] = item
        }
      }
    })

    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: new StorageError(StorageErrorType.UNKNOWN, 'Failed to get all data', error),
    }
  }
}

/**
 * Initialize default data if not present
 */
export function initializeDefaults(): void {
  const defaults = {
    [STORAGE_KEYS.EXERCISES]: [],
    [STORAGE_KEYS.WORKOUTS]: [],
    [STORAGE_KEYS.ROUTINES]: [],
    [STORAGE_KEYS.BODY_METRICS]: [],
    [STORAGE_KEYS.MEALS]: [],
    [STORAGE_KEYS.NUTRITION_TARGETS]: {
      dailyCalories: 2000,
      protein: 150,
      carbs: 200,
      fat: 65,
    },
    [STORAGE_KEYS.GOALS]: [],
    [STORAGE_KEYS.SETTINGS]: {
      units: {
        weight: 'kg',
        measurement: 'cm',
      },
      preferences: {
        defaultRestTime: 90,
        theme: 'dark',
        notificationsEnabled: true,
      },
    },
    [STORAGE_KEYS.ACTIVE_WORKOUT]: null,
    [STORAGE_KEYS.PERSONAL_RECORDS]: {},
    [STORAGE_KEYS.QUICK_ADD_FOODS]: [],
  }

  Object.entries(defaults).forEach(([key, value]) => {
    const existing = getItem(key)
    if (existing.data === undefined) {
      setItem(key, value)
    }
  })
}

/**
 * Storage event listener for cross-tab synchronization
 */
export function addStorageListener(callback: (event: StorageEvent) => void): () => void {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

/**
 * Check storage health and quota
 */
export function checkStorageHealth(): {
  isAvailable: boolean
  sizeInfo: ReturnType<typeof getStorageSizeInfo>
  hasQuotaIssue: boolean
} {
  const isAvailable = isStorageAvailable()
  const sizeInfo = getStorageSizeInfo()
  const hasQuotaIssue = sizeInfo.remaining < 100 * 1024 // Less than 100KB remaining

  return {
    isAvailable,
    sizeInfo,
    hasQuotaIssue,
  }
}

/**
 * Compress data by removing unnecessary fields before storage
 * This helps with quota management
 */
export function compressData<T extends Record<string, unknown>>(data: T[], preserveFields: (keyof T)[]): T[] {
  return data.map((item) => {
    const compressed = {} as T
    preserveFields.forEach((field) => {
      if (field in item) {
        compressed[field] = item[field]
      }
    })
    return compressed
  })
}
