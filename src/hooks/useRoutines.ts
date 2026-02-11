/**
 * Custom hook for managing routines
 */

import { useState, useEffect, useCallback } from 'react'
import type { Routine, RoutineExercise } from '../types'
import {
  getRoutines,
  getRoutineById,
  getFavoriteRoutines,
  getRoutinesByType,
  searchRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  toggleRoutineFavorite,
  duplicateRoutine,
  routineToWorkoutExercises,
  startWorkoutFromRoutine,
  addExerciseToRoutine,
  removeExerciseFromRoutine,
  reorderRoutineExercises,
  updateRoutineExercise,
  getRoutineStatistics,
} from '../services/routines'

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setRoutines(getRoutines())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routines')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setRoutines(getRoutines())
  }, [])

  const getById = useCallback((id: string) => getRoutineById(id), [])

  const getFavorites = useCallback(() => getFavoriteRoutines(), [])

  const getByType = useCallback((type: Routine['type']) => {
    return getRoutinesByType(type)
  }, [])

  const search = useCallback((query: string) => {
    return searchRoutines(query)
  }, [])

  const create = useCallback((data: Omit<Routine, 'id' | 'createdAt'>) => {
    const newRoutine = createRoutine(data)
    refresh()
    return newRoutine
  }, [refresh])

  const update = useCallback((id: string, updates: Partial<Routine>) => {
    const updated = updateRoutine(id, updates)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteRoutine(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  const toggleFavorite = useCallback((id: string) => {
    const updated = toggleRoutineFavorite(id)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const duplicate = useCallback((id: string) => {
    const duplicated = duplicateRoutine(id)
    if (duplicated) {
      refresh()
    }
    return duplicated
  }, [refresh])

  const startWorkout = useCallback((routineId: string) => {
    return startWorkoutFromRoutine(routineId)
  }, [])

  const statistics = useCallback(() => getRoutineStatistics(), [])

  return {
    routines,
    loading,
    error,
    refresh,
    getById,
    getFavorites,
    getByType,
    search,
    create,
    update,
    remove,
    toggleFavorite,
    duplicate,
    startWorkout,
    statistics,
  }
}

/**
 * Hook for a single routine
 */
export function useRoutine(id: string) {
  const [routine, setRoutine] = useState<Routine | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setRoutine(getRoutineById(id))
    setLoading(false)
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const update = useCallback((updates: Partial<Routine>) => {
    const updated = updateRoutine(id, updates)
    if (updated) {
      setRoutine(updated)
    }
    return updated
  }, [id])

  const addExercise = useCallback((exerciseData: Omit<RoutineExercise, 'exerciseId'>) => {
    const updated = addExerciseToRoutine(id, exerciseData)
    if (updated) {
      setRoutine(updated)
    }
    return updated
  }, [id])

  const removeExercise = useCallback((exerciseIndex: number) => {
    const updated = removeExerciseFromRoutine(id, exerciseIndex)
    if (updated) {
      setRoutine(updated)
    }
    return updated
  }, [id])

  const reorderExercises = useCallback((fromIndex: number, toIndex: number) => {
    const updated = reorderRoutineExercises(id, fromIndex, toIndex)
    if (updated) {
      setRoutine(updated)
    }
    return updated
  }, [id])

  const updateExercise = useCallback((exerciseIndex: number, updates: Partial<RoutineExercise>) => {
    const updated = updateRoutineExercise(id, exerciseIndex, updates)
    if (updated) {
      setRoutine(updated)
    }
    return updated
  }, [id])

  const toWorkoutExercises = useCallback(() => {
    if (!routine) return []
    return routineToWorkoutExercises(routine)
  }, [routine])

  return {
    routine,
    loading,
    refresh,
    update,
    addExercise,
    removeExercise,
    reorderExercises,
    updateExercise,
    toWorkoutExercises,
  }
}
