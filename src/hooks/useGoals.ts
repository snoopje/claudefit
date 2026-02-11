/**
 * Custom hook for managing goals
 */

import { useState, useEffect, useCallback } from 'react'
import type { Goal, GoalCategory, GoalProgress, GoalTemplate } from '../types'
import {
  getGoals,
  getGoalById,
  getActiveGoals,
  getGoalsByCategory,
  searchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  missGoal,
  pauseGoal,
  resumeGoal,
  calculateGoalProgress,
  updateAllGoals,
  getGoalTemplates,
  createGoalFromTemplate,
  getGoalStatistics,
  getExpiringGoals,
  getOverdueGoals,
} from '../services/goals'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setGoals(getGoals())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load goals')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setGoals(getGoals())
  }, [])

  const getById = useCallback((id: string) => getGoalById(id), [])

  const getActive = useCallback(() => getActiveGoals(), [])

  const getByCategory = useCallback((category: GoalCategory) => {
    return getGoalsByCategory(category)
  }, [])

  const search = useCallback((query: string) => {
    return searchGoals(query)
  }, [])

  const create = useCallback((data: Omit<Goal, 'id' | 'status' | 'createdAt' | 'currentValue' | 'progressHistory'>) => {
    const newGoal = createGoal(data)
    refresh()
    return newGoal
  }, [refresh])

  const update = useCallback((id: string, updates: Partial<Goal>) => {
    const updated = updateGoal(id, updates)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteGoal(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  const complete = useCallback((id: string) => {
    const updated = completeGoal(id)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const miss = useCallback((id: string) => {
    const updated = missGoal(id)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const pause = useCallback((id: string) => {
    const updated = pauseGoal(id)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const resume = useCallback((id: string) => {
    const updated = resumeGoal(id)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const getProgress = useCallback((goal: Goal) => {
    return calculateGoalProgress(goal)
  }, [])

  const updateAll = useCallback(() => {
    updateAllGoals()
    refresh()
  }, [refresh])

  const getTemplates = useCallback(() => {
    return getGoalTemplates()
  }, [])

  const createFromTemplate = useCallback((templateId: string, startDate?: Date, customTarget?: number) => {
    const newGoal = createGoalFromTemplate(templateId, startDate, customTarget)
    if (newGoal) {
      refresh()
    }
    return newGoal
  }, [refresh])

  const statistics = useCallback(() => getGoalStatistics(), [])

  const getExpiring = useCallback((days?: number) => getExpiringGoals(days), [])

  const getOverdue = useCallback(() => getOverdueGoals(), [])

  return {
    goals,
    loading,
    error,
    refresh,
    getById,
    getActive,
    getByCategory,
    search,
    create,
    update,
    remove,
    complete,
    miss,
    pause,
    resume,
    getProgress,
    updateAll,
    getTemplates,
    createFromTemplate,
    statistics,
    getExpiring,
    getOverdue,
  }
}

/**
 * Hook for active goals with progress
 */
export function useActiveGoals() {
  const [activeGoals, setActiveGoals] = useState<Array<{ goal: Goal; progress: GoalProgress }>>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    const goals = getActiveGoals()
    const goalsWithProgress = goals.map((goal) => ({
      goal,
      progress: calculateGoalProgress(goal),
    }))
    setActiveGoals(goalsWithProgress)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { activeGoals, loading, refresh }
}

/**
 * Hook for goal statistics
 */
export function useGoalStats() {
  const [stats, setStats] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    missedGoals: 0,
    pausedGoals: 0,
    completionRate: 0,
  })

  const refresh = useCallback(() => {
    setStats(getGoalStatistics())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, refresh }
}
