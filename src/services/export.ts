/**
 * Export/Import service - handles data backup and restoration
 */

import type { ExportData } from '../types'
import { STORAGE_KEYS } from '../types'
import { getAllData, setItem, getItem, clearAllData } from './storage'
import { getExercises } from './exercises'
import { getWorkouts } from './workouts'
import { getRoutines } from './routines'
import { getBodyMetrics } from './bodyMetrics'
import { getMeals } from './nutrition'
import { getNutritionTargets } from './nutrition'
import { getGoals } from './goals'

/**
 * Current data export version
 */
const EXPORT_VERSION = '1.0.0'

/**
 * Export all application data as JSON
 */
export function exportAllData(): ExportData {
  return {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    exercises: getExercises(),
    workouts: getWorkouts(),
    routines: getRoutines(),
    bodyMetrics: getBodyMetrics(),
    meals: getMeals(),
    nutritionTargets: getNutritionTargets(),
    goals: getGoals(),
    settings: {
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
  }
}

/**
 * Download export data as a JSON file
 */
export function downloadExportData(data: ExportData, filename?: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename || `claudefit-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export and download all data
 */
export function exportAndDownloadData(filename?: string): void {
  const data = exportAllData()
  downloadExportData(data, filename)
}

/**
 * Import data from a JSON file
 */
export function importDataFromFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const data = JSON.parse(json) as ExportData
        resolve(data)
      } catch (error) {
        reject(new Error('Failed to parse import file. Please ensure it is a valid JSON file.'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file.'))
    }

    reader.readAsText(file)
  })
}

/**
 * Validate imported data structure
 */
export function validateImportData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid data format'] }
  }

  const importData = data as Record<string, unknown>

  // Check required fields
  if (!importData.version) {
    errors.push('Missing version information')
  }

  if (!importData.exportDate) {
    errors.push('Missing export date')
  }

  // Validate data types
  if (importData.exercises && !Array.isArray(importData.exercises)) {
    errors.push('Exercises data is not an array')
  }

  if (importData.workouts && !Array.isArray(importData.workouts)) {
    errors.push('Workouts data is not an array')
  }

  if (importData.routines && !Array.isArray(importData.routines)) {
    errors.push('Routines data is not an array')
  }

  if (importData.bodyMetrics && !Array.isArray(importData.bodyMetrics)) {
    errors.push('Body metrics data is not an array')
  }

  if (importData.meals && !Array.isArray(importData.meals)) {
    errors.push('Meals data is not an array')
  }

  if (importData.goals && !Array.isArray(importData.goals)) {
    errors.push('Goals data is not an array')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Import data and merge with existing data
 */
export function mergeImportData(data: ExportData, options: ImportOptions = {}): ImportResult {
  const validation = validateImportData(data)

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      imported: {},
    }
  }

  const errors: string[] = []
  const imported: Record<string, number> = {}

  try {
    // Import exercises
    if (options.exercises !== false && data.exercises) {
      const existingExercises = getExercises()
      const existingIds = new Set(existingExercises.map((e) => e.id))

      const newExercises = data.exercises.filter((e: any) => !existingIds.has(e.id))
      const mergedExercises = [...existingExercises, ...newExercises]

      setItem(STORAGE_KEYS.EXERCISES, mergedExercises)
      imported.exercises = newExercises.length
    }

    // Import workouts
    if (options.workouts !== false && data.workouts) {
      const existingWorkouts = getWorkouts()
      const existingIds = new Set(existingWorkouts.map((w) => w.id))

      const newWorkouts = data.workouts.filter((w: any) => !existingIds.has(w.id))
      const mergedWorkouts = [...existingWorkouts, ...newWorkouts]

      setItem(STORAGE_KEYS.WORKOUTS, mergedWorkouts)
      imported.workouts = newWorkouts.length
    }

    // Import routines
    if (options.routines !== false && data.routines) {
      const existingRoutines = getRoutines()
      const existingIds = new Set(existingRoutines.map((r) => r.id))

      const newRoutines = data.routines.filter((r: any) => !existingIds.has(r.id))
      const mergedRoutines = [...existingRoutines, ...newRoutines]

      setItem(STORAGE_KEYS.ROUTINES, mergedRoutines)
      imported.routines = newRoutines.length
    }

    // Import body metrics
    if (options.bodyMetrics !== false && data.bodyMetrics) {
      const existingMetrics = getBodyMetrics()
      const existingIds = new Set(existingMetrics.map((m) => m.id))

      const newMetrics = data.bodyMetrics.filter((m: any) => !existingIds.has(m.id))
      const mergedMetrics = [...existingMetrics, ...newMetrics]

      setItem(STORAGE_KEYS.BODY_METRICS, mergedMetrics)
      imported.bodyMetrics = newMetrics.length
    }

    // Import meals
    if (options.meals !== false && data.meals) {
      const existingMeals = getMeals()
      const existingIds = new Set(existingMeals.map((m) => m.id))

      const newMeals = data.meals.filter((m: any) => !existingIds.has(m.id))
      const mergedMeals = [...existingMeals, ...newMeals]

      setItem(STORAGE_KEYS.MEALS, mergedMeals)
      imported.meals = newMeals.length
    }

    // Import nutrition targets (replace)
    if (options.nutritionTargets !== false && data.nutritionTargets) {
      setItem(STORAGE_KEYS.NUTRITION_TARGETS, data.nutritionTargets)
      imported.nutritionTargets = 1
    }

    // Import goals
    if (options.goals !== false && data.goals) {
      const existingGoals = getGoals()
      const existingIds = new Set(existingGoals.map((g) => g.id))

      const newGoals = data.goals.filter((g: any) => !existingIds.has(g.id))
      const mergedGoals = [...existingGoals, ...newGoals]

      setItem(STORAGE_KEYS.GOALS, mergedGoals)
      imported.goals = newGoals.length
    }

    // Import settings
    if (options.settings !== false && data.settings) {
      const existingSettingsResult = getItem(STORAGE_KEYS.SETTINGS)
      const existingSettings = (existingSettingsResult.success && existingSettingsResult.data
        ? existingSettingsResult.data
        : {}) as Record<string, unknown>

      const mergedSettings = { ...existingSettings, ...data.settings }
      setItem(STORAGE_KEYS.SETTINGS, mergedSettings)
      imported.settings = 1
    }

    return {
      success: true,
      errors,
      imported,
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error during import'],
      imported,
    }
  }
}

/**
 * Import data and replace all existing data
 */
export function replaceWithImportData(data: ExportData): ImportResult {
  const validation = validateImportData(data)

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
      imported: {},
    }
  }

  const errors: string[] = []
  const imported: Record<string, number> = {}

  try {
    // Clear existing data
    clearAllData()

    // Import all data
    if (data.exercises) {
      setItem(STORAGE_KEYS.EXERCISES, data.exercises)
      imported.exercises = data.exercises.length
    }

    if (data.workouts) {
      setItem(STORAGE_KEYS.WORKOUTS, data.workouts)
      imported.workouts = data.workouts.length
    }

    if (data.routines) {
      setItem(STORAGE_KEYS.ROUTINES, data.routines)
      imported.routines = data.routines.length
    }

    if (data.bodyMetrics) {
      setItem(STORAGE_KEYS.BODY_METRICS, data.bodyMetrics)
      imported.bodyMetrics = data.bodyMetrics.length
    }

    if (data.meals) {
      setItem(STORAGE_KEYS.MEALS, data.meals)
      imported.meals = data.meals.length
    }

    if (data.nutritionTargets) {
      setItem(STORAGE_KEYS.NUTRITION_TARGETS, data.nutritionTargets)
      imported.nutritionTargets = 1
    }

    if (data.goals) {
      setItem(STORAGE_KEYS.GOALS, data.goals)
      imported.goals = data.goals.length
    }

    if (data.settings) {
      setItem(STORAGE_KEYS.SETTINGS, data.settings)
      imported.settings = 1
    }

    return {
      success: true,
      errors,
      imported,
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error during import'],
      imported,
    }
  }
}

/**
 * Import options
 */
export interface ImportOptions {
  exercises?: boolean
  workouts?: boolean
  routines?: boolean
  bodyMetrics?: boolean
  meals?: boolean
  nutritionTargets?: boolean
  goals?: boolean
  settings?: boolean
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean
  errors: string[]
  imported: Record<string, number>
}

/**
 * Get export data summary
 */
export function getExportSummary(data: ExportData): {
  exercises: number
  workouts: number
  routines: number
  bodyMetrics: number
  meals: number
  goals: number
} {
  return {
    exercises: data.exercises?.length || 0,
    workouts: data.workouts?.length || 0,
    routines: data.routines?.length || 0,
    bodyMetrics: data.bodyMetrics?.length || 0,
    meals: data.meals?.length || 0,
    goals: data.goals?.length || 0,
  }
}

/**
 * Create a selective export (only specific data types)
 */
export function createSelectiveExport(types: (keyof ImportOptions)[]): Partial<ExportData> {
  const result: Partial<ExportData> = {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
  }

  if (types.includes('exercises')) {
    result.exercises = getExercises()
  }

  if (types.includes('workouts')) {
    result.workouts = getWorkouts()
  }

  if (types.includes('routines')) {
    result.routines = getRoutines()
  }

  if (types.includes('bodyMetrics')) {
    result.bodyMetrics = getBodyMetrics()
  }

  if (types.includes('meals')) {
    result.meals = getMeals()
  }

  if (types.includes('nutritionTargets')) {
    result.nutritionTargets = getNutritionTargets()
  }

  if (types.includes('goals')) {
    result.goals = getGoals()
  }

  if (types.includes('settings')) {
    const settingsResult = getItem(STORAGE_KEYS.SETTINGS)
    result.settings = settingsResult.success && settingsResult.data ? (settingsResult.data as any) : undefined
  }

  return result
}

/**
 * Check if export file is from a newer version
 */
export function checkVersionCompatibility(data: ExportData): {
  compatible: boolean
  message?: string
} {
  const [major, minor] = data.version.split('.').map(Number)
  const [currentMajor, currentMinor] = EXPORT_VERSION.split('.').map(Number)

  if (major > currentMajor) {
    return {
      compatible: false,
      message: `This export file is from a newer version (v${data.version}) and may not be fully compatible with the current version (v${EXPORT_VERSION}).`,
    }
  }

  if (major === currentMajor && minor > currentMinor) {
    return {
      compatible: true,
      message: `This export file is from a slightly newer version (v${data.version}). Some features may not be available.`,
    }
  }

  return { compatible: true }
}
