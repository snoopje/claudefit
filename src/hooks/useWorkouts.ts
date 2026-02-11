/**
 * Custom hook for managing workouts
 */

import { useState, useEffect, useCallback } from 'react'
import type { Workout, WorkoutExercise, ActiveWorkoutSession, WorkoutType } from '../types'
import {
  getWorkouts,
  getWorkoutById,
  getWorkoutsByDateRange,
  getRecentWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  startWorkoutSession,
  getActiveWorkoutSession,
  updateActiveSession,
  completeCurrentSet,
  setRestTimer,
  clearRestTimer,
  finishWorkoutSession,
  cancelWorkoutSession,
  getWorkoutStatistics,
  getWeeklyVolumeData,
  getExercisePRs,
  getRecentPRs,
} from '../services/workouts'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setWorkouts(getWorkouts())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workouts')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setWorkouts(getWorkouts())
  }, [])

  const getById = useCallback((id: string) => getWorkoutById(id), [])

  const getByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return getWorkoutsByDateRange(startDate, endDate)
  }, [])

  const getRecent = useCallback((count: number = 10) => {
    return getRecentWorkouts(count)
  }, [])

  const create = useCallback((data: Omit<Workout, 'id' | 'totalVolume' | 'totalSets' | 'totalReps'>) => {
    const newWorkout = createWorkout(data)
    refresh()
    return newWorkout
  }, [refresh])

  const update = useCallback((id: string, updates: Partial<Workout>) => {
    const updated = updateWorkout(id, updates)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteWorkout(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  const statistics = useCallback(() => getWorkoutStatistics(), [])

  const weeklyVolume = useCallback((weeks: number = 12) => getWeeklyVolumeData(weeks), [])

  return {
    workouts,
    loading,
    error,
    refresh,
    getById,
    getByDateRange,
    getRecent,
    create,
    update,
    remove,
    statistics,
    weeklyVolume,
  }
}

/**
 * Hook for active workout session
 */
export function useActiveWorkout() {
  const [session, setSession] = useState<ActiveWorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(getActiveWorkoutSession())
    setLoading(false)
  }, [])

  const start = useCallback((exercises: WorkoutExercise[]) => {
    const newSession = startWorkoutSession(exercises)
    setSession(newSession)
    return newSession
  }, [])

  const update = useCallback((updates: Partial<ActiveWorkoutSession>) => {
    if (session) {
      const updated = { ...session, ...updates }
      updateActiveSession(updated)
      setSession(updated)
    }
  }, [session])

  const completeSet = useCallback(() => {
    const updated = completeCurrentSet()
    if (updated) {
      setSession(updated)
    }
    return session
  }, [session])

  const setRest = useCallback((durationSeconds: number) => {
    setRestTimer(durationSeconds)
    if (session) {
      const endTime = new Date(Date.now() + durationSeconds * 1000).toISOString()
      const updated = { ...session, restTimerEndTime: endTime }
      updateActiveSession(updated)
      setSession(updated)
    }
  }, [session])

  const clearRest = useCallback(() => {
    clearRestTimer()
    if (session) {
      const updated = { ...session, restTimerEndTime: undefined }
      setSession(updated)
    }
  }, [session])

  const finish = useCallback((notes?: string) => {
    const workout = finishWorkoutSession(notes)
    setSession(null)
    return workout
  }, [])

  const cancel = useCallback(() => {
    cancelWorkoutSession()
    setSession(null)
  }, [])

  return {
    session,
    loading,
    start,
    update,
    completeSet,
    setRest,
    clearRest,
    finish,
    cancel,
    isActive: session !== null,
  }
}

/**
 * Hook for personal records
 */
export function usePersonalRecords(exerciseId?: string) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (exerciseId) {
      setRecords(getExercisePRs(exerciseId))
    } else {
      setRecords(getRecentPRs())
    }
    setLoading(false)
  }, [exerciseId])

  return { records, loading }
}

/**
 * Hook for workout statistics
 */
export function useWorkoutStats() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    totalDuration: 0,
    averageDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    workoutsThisWeek: 0,
    workoutsThisMonth: 0,
    mostFrequentMuscleGroup: '',
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setStats(getWorkoutStatistics())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, loading, refresh }
}
