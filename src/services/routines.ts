/**
 * Routine service - manages workout templates/routines
 */

import type { Routine, RoutineExercise, RoutineUsage } from '../types'
import { STORAGE_KEYS } from '../types'
import { getItem, setItem, removeItem } from './storage'
import { getExerciseById } from './exercises'

/**
 * Generate unique routine ID
 */
function generateRoutineId(): string {
  return `routine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all routines
 */
export function getRoutines(): Routine[] {
  const result = getItem<Routine[]>(STORAGE_KEYS.ROUTINES)
  return result.success && result.data ? result.data : []
}

/**
 * Get routine by ID
 */
export function getRoutineById(id: string): Routine | undefined {
  const routines = getRoutines()
  return routines.find((routine) => routine.id === id)
}

/**
 * Get favorite routines
 */
export function getFavoriteRoutines(): Routine[] {
  const routines = getRoutines()
  return routines.filter((routine) => routine.isFavorite)
}

/**
 * Get routines by type
 */
export function getRoutinesByType(type: Routine['type']): Routine[] {
  const routines = getRoutines()
  return routines.filter((routine) => routine.type === type)
}

/**
 * Search routines
 */
export function searchRoutines(query: string): Routine[] {
  const routines = getRoutines()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) {
    return routines
  }

  return routines.filter(
    (routine) =>
      routine.name.toLowerCase().includes(searchTerm) ||
      routine.description?.toLowerCase().includes(searchTerm) ||
      routine.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
  )
}

/**
 * Create new routine
 */
export function createRoutine(
  data: Omit<Routine, 'id' | 'createdAt'>
): Routine {
  const routine: Routine = {
    ...data,
    id: generateRoutineId(),
    createdAt: new Date().toISOString(),
  }

  // Calculate estimated duration
  routine.estimatedDuration = calculateEstimatedDuration(routine)

  const routines = getRoutines()
  const updatedRoutines = [...routines, routine]
  setItem(STORAGE_KEYS.ROUTINES, updatedRoutines)

  return routine
}

/**
 * Update routine
 */
export function updateRoutine(id: string, updates: Partial<Routine>): Routine | null {
  const routines = getRoutines()
  const index = routines.findIndex((routine) => routine.id === id)

  if (index === -1) {
    return null
  }

  const updatedRoutine = { ...routines[index], ...updates }

  // Recalculate estimated duration if exercises changed
  if (updates.exercises) {
    updatedRoutine.estimatedDuration = calculateEstimatedDuration(updatedRoutine)
  }

  const updatedRoutines = [...routines]
  updatedRoutines[index] = updatedRoutine

  setItem(STORAGE_KEYS.ROUTINES, updatedRoutines)

  return updatedRoutine
}

/**
 * Delete routine
 */
export function deleteRoutine(id: string): boolean {
  const routines = getRoutines()
  const updatedRoutines = routines.filter((routine) => routine.id !== id)

  if (updatedRoutines.length === routines.length) {
    return false
  }

  setItem(STORAGE_KEYS.ROUTINES, updatedRoutines)
  return true
}

/**
 * Toggle favorite status
 */
export function toggleRoutineFavorite(id: string): Routine | null {
  const routine = getRoutineById(id)
  if (!routine) return null

  return updateRoutine(id, { isFavorite: !routine.isFavorite })
}

/**
 * Duplicate routine
 */
export function duplicateRoutine(id: string): Routine | null {
  const routine = getRoutineById(id)
  if (!routine) return null

  return createRoutine({
    ...routine,
    name: `${routine.name} (Copy)`,
    isFavorite: false,
  })
}

/**
 * Convert routine to workout exercises
 */
export function routineToWorkoutExercises(routine: Routine) {
  return routine.exercises.map((routineExercise) => ({
    exerciseId: routineExercise.exerciseId,
    sets: Array.from({ length: routineExercise.defaultSets }, () => ({
      reps: routineExercise.defaultReps,
      weight: routineExercise.defaultWeight,
      duration: routineExercise.defaultDuration,
      completed: false,
    })),
    notes: routineExercise.notes,
  }))
}

/**
 * Start workout from routine
 */
export function startWorkoutFromRoutine(routineId: string) {
  const routine = getRoutineById(routineId)
  if (!routine) return null

  const { startWorkoutSession } = require('./workouts')

  return startWorkoutSession(routineToWorkoutExercises(routine))
}

/**
 * Get routine usage history
 */
export function getRoutineUsageHistory(routineId: string): RoutineUsage[] {
  // This would track when a routine was used to start a workout
  // For now, we'll return empty array - this could be expanded
  const result = getItem<RoutineUsage[]>(`${STORAGE_KEYS.ROUTINES}_${routineId}_usage`)
  return result.success && result.data ? result.data : []
}

/**
 * Calculate estimated duration for a routine
 */
function calculateEstimatedDuration(routine: Routine): number {
  let totalMinutes = 0

  routine.exercises.forEach((exercise) => {
    // Estimate: 1 minute per set + 2 minutes rest between sets
    const setsTime = exercise.defaultSets * 1
    const restTime = (exercise.defaultSets - 1) * (exercise.restTime || 90) / 60
    totalMinutes += setsTime + restTime + 2 // +2 for setup
  })

  return Math.round(totalMinutes)
}

/**
 * Get recommended rest time for exercise type
 */
export function getRecommendedRestTime(exerciseId: string): number {
  const exercise = getExerciseById(exerciseId)

  if (!exercise) return 90 // Default 90 seconds

  // Compound movements need more rest
  const compoundExercises = [
    'squat',
    'deadlift',
    'bench',
    'overhead-press',
    'barbell-row',
  ]

  const isCompound = compoundExercises.some((name) =>
    exercise.name.toLowerCase().includes(name)
  )

  if (exercise.type === 'cardio') {
    return 60
  }

  if (isCompound) {
    return 120 // 2 minutes for compounds
  }

  if (exercise.type === 'flexibility') {
    return 30
  }

  return 90 // Default 90 seconds
}

/**
 * Add exercise to routine
 */
export function addExerciseToRoutine(
  routineId: string,
  exerciseData: Omit<RoutineExercise, 'exerciseId'>
): Routine | null {
  const routine = getRoutineById(routineId)
  if (!routine) return null

  // Generate a temporary exercise ID - this should be replaced with actual exercise selection
  const newExercise: RoutineExercise = {
    ...exerciseData,
    exerciseId: `temp-${Date.now()}`,
  }

  return updateRoutine(routineId, {
    exercises: [...routine.exercises, newExercise],
  })
}

/**
 * Remove exercise from routine
 */
export function removeExerciseFromRoutine(
  routineId: string,
  exerciseIndex: number
): Routine | null {
  const routine = getRoutineById(routineId)
  if (!routine) return null

  if (exerciseIndex < 0 || exerciseIndex >= routine.exercises.length) {
    return null
  }

  const updatedExercises = routine.exercises.filter((_, index) => index !== exerciseIndex)

  return updateRoutine(routineId, {
    exercises: updatedExercises,
  })
}

/**
 * Reorder exercises in routine
 */
export function reorderRoutineExercises(
  routineId: string,
  fromIndex: number,
  toIndex: number
): Routine | null {
  const routine = getRoutineById(routineId)
  if (!routine) return null

  const exercises = [...routine.exercises]
  const [removed] = exercises.splice(fromIndex, 1)
  exercises.splice(toIndex, 0, removed)

  return updateRoutine(routineId, { exercises })
}

/**
 * Update exercise in routine
 */
export function updateRoutineExercise(
  routineId: string,
  exerciseIndex: number,
  updates: Partial<RoutineExercise>
): Routine | null {
  const routine = getRoutineById(routineId)
  if (!routine) return null

  if (exerciseIndex < 0 || exerciseIndex >= routine.exercises.length) {
    return null
  }

  const updatedExercises = [...routine.exercises]
  updatedExercises[exerciseIndex] = {
    ...updatedExercises[exerciseIndex],
    ...updates,
  }

  return updateRoutine(routineId, { exercises: updatedExercises })
}

/**
 * Get routine statistics
 */
export function getRoutineStatistics() {
  const routines = getRoutines()

  return {
    totalRoutines: routines.length,
    favoriteRoutines: routines.filter((r) => r.isFavorite).length,
    typeBreakdown: {
      strength: routines.filter((r) => r.type === 'strength').length,
      cardio: routines.filter((r) => r.type === 'cardio').length,
      flexibility: routines.filter((r) => r.type === 'flexibility').length,
      mixed: routines.filter((r) => r.type === 'mixed').length,
    },
  }
}
