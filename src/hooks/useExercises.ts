/**
 * Custom hook for managing exercises
 */

import { useState, useEffect, useCallback } from 'react'
import type { Exercise, MuscleGroup, ExerciseType } from '../types'
import {
  getExercises,
  getExerciseById,
  getExercisesByMuscleGroup,
  getExercisesByType,
  searchExercises,
  addCustomExercise,
  updateExercise,
  deleteExercise,
  getAllMuscleGroups,
  getAllEquipment,
} from '../services/exercises'

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setExercises(getExercises())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exercises')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setExercises(getExercises())
  }, [])

  const getById = useCallback((id: string) => getExerciseById(id), [])

  const getByMuscleGroup = useCallback((muscleGroup: MuscleGroup) => {
    return getExercisesByMuscleGroup(muscleGroup)
  }, [])

  const getByType = useCallback((type: ExerciseType) => {
    return getExercisesByType(type)
  }, [])

  const search = useCallback((query: string) => {
    return searchExercises(query)
  }, [])

  const add = useCallback((exercise: Omit<Exercise, 'id' | 'isCustom'>) => {
    const newExercise = addCustomExercise(exercise)
    refresh()
    return newExercise
  }, [refresh])

  const update = useCallback((id: string, updates: Partial<Exercise>) => {
    const updated = updateExercise(id, updates)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteExercise(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  const muscleGroups = useCallback(() => getAllMuscleGroups(), [])

  const equipment = useCallback(() => getAllEquipment(), [])

  return {
    exercises,
    loading,
    error,
    refresh,
    getById,
    getByMuscleGroup,
    getByType,
    search,
    add,
    update,
    remove,
    muscleGroups: muscleGroups(),
    equipment: equipment(),
  }
}

/**
 * Hook for a single exercise
 */
export function useExercise(id: string) {
  const [exercise, setExercise] = useState<Exercise | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setExercise(getExerciseById(id))
    setLoading(false)
  }, [id])

  return { exercise, loading }
}

/**
 * Hook for filtered exercises
 */
export function useFilteredExercises(
  filterType: 'all' | 'muscleGroup' | 'type' | 'search',
  filterValue?: string
) {
  const { exercises, loading } = useExercises()
  const [filtered, setFiltered] = useState<Exercise[]>([])

  useEffect(() => {
    if (loading) return

    switch (filterType) {
      case 'muscleGroup':
        if (filterValue) {
          setFiltered(getExercisesByMuscleGroup(filterValue as MuscleGroup))
        } else {
          setFiltered(exercises)
        }
        break
      case 'type':
        if (filterValue) {
          setFiltered(getExercisesByType(filterValue as ExerciseType))
        } else {
          setFiltered(exercises)
        }
        break
      case 'search':
        if (filterValue) {
          setFiltered(searchExercises(filterValue))
        } else {
          setFiltered(exercises)
        }
        break
      default:
        setFiltered(exercises)
    }
  }, [exercises, filterType, filterValue, loading])

  return { filtered, loading }
}
