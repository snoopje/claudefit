/**
 * Custom hook for managing nutrition data
 */

import { useState, useEffect, useCallback } from 'react'
import type { MealEntry, MealType, NutritionTarget, QuickAddFood } from '../types'
import {
  getMeals,
  getMealsForDate,
  getTodaysMeals,
  getDailyNutritionSummary,
  getWeeklyNutritionSummary,
  getWeeklyNutritionAverages,
  addMealEntry,
  updateMealEntry,
  deleteMealEntry,
  getNutritionTargets,
  updateNutritionTargets,
  quickAddFood,
  getQuickAddFoods,
  addQuickAddFood,
  deleteQuickAddFood,
  getMealsByType,
  getNutritionProgress,
  getRemainingNutrition,
  getMacroDistribution,
  getCalorieHistory,
} from '../services/nutrition'

export function useNutrition() {
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [targets, setTargets] = useState<NutritionTarget>({
    dailyCalories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setMeals(getMeals())
      setTargets(getNutritionTargets())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load nutrition data')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setMeals(getMeals())
    setTargets(getNutritionTargets())
  }, [])

  const getForDate = useCallback((date: Date) => {
    return getMealsForDate(date)
  }, [])

  const getTodays = useCallback(() => {
    return getTodaysMeals()
  }, [])

  const getSummary = useCallback((date?: Date) => {
    return getDailyNutritionSummary(date)
  }, [])

  const getWeekly = useCallback(() => {
    return getWeeklyNutritionSummary()
  }, [])

  const getAverages = useCallback(() => {
    return getWeeklyNutritionAverages()
  }, [])

  const add = useCallback((data: Omit<MealEntry, 'id'>) => {
    const newMeal = addMealEntry(data)
    refresh()
    return newMeal
  }, [refresh])

  const update = useCallback((id: string, updates: Partial<MealEntry>) => {
    const updated = updateMealEntry(id, updates)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteMealEntry(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  const updateTargets = useCallback((newTargets: NutritionTarget) => {
    updateNutritionTargets(newTargets)
    setTargets(newTargets)
  }, [])

  const getByType = useCallback((date: Date, mealType: MealType) => {
    return getMealsByType(date, mealType)
  }, [])

  const getProgress = useCallback((date?: Date) => {
    return getNutritionProgress(date)
  }, [])

  const getRemaining = useCallback((date?: Date) => {
    return getRemainingNutrition(date)
  }, [])

  const getDistribution = useCallback((date?: Date) => {
    return getMacroDistribution(date)
  }, [])

  return {
    meals,
    targets,
    loading,
    error,
    refresh,
    getForDate,
    getTodays,
    getSummary,
    getWeekly,
    getAverages,
    add,
    update,
    remove,
    updateTargets,
    getByType,
    getProgress,
    getRemaining,
    getDistribution,
  }
}

/**
 * Hook for today's nutrition
 */
export function useTodaysNutrition() {
  const [summary, setSummary] = useState<ReturnType<typeof getDailyNutritionSummary>>({
    date: '',
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    meals: [],
    target: {
      dailyCalories: 2000,
      protein: 150,
      carbs: 200,
      fat: 65,
    },
    isWithinTarget: false,
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setSummary(getDailyNutritionSummary())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { summary, loading, refresh }
}

/**
 * Hook for quick add foods
 */
export function useQuickAddFoods() {
  const [foods, setFoods] = useState<QuickAddFood[]>([])

  const refresh = useCallback(() => {
    setFoods(getQuickAddFoods())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const add = useCallback((food: Omit<QuickAddFood, 'id'>) => {
    const newFood = addQuickAddFood(food)
    refresh()
    return newFood
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteQuickAddFood(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  const quickAdd = useCallback((foodId: string, date?: Date) => {
    return quickAddFood(foodId, date)
  }, [])

  return {
    foods,
    loading: false,
    refresh,
    add,
    remove,
    quickAdd,
  }
}

/**
 * Hook for calorie history (for charts)
 */
export function useCalorieHistory(days: number = 30) {
  const [history, setHistory] = useState<Array<{ date: string; calories: number; target: number }>>([])

  useEffect(() => {
    setHistory(getCalorieHistory(days))
  }, [days])

  return { history }
}
