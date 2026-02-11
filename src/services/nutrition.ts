/**
 * Nutrition service - manages meal logging and nutrition targets
 */

import type {
  MealEntry,
  MealType,
  NutritionTarget,
  DailyNutritionSummary,
  QuickAddFood,
} from '../types'
import { STORAGE_KEYS } from '../types'
import { getItem, setItem, removeItem } from './storage'
import { format, startOfDay, endOfDay, subDays, startOfWeek, isSameDay } from 'date-fns'

/**
 * Generate unique meal ID
 */
function generateMealId(): string {
  return `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Default quick add foods
 */
const DEFAULT_QUICK_ADD_FOODS: QuickAddFood[] = [
  {
    id: 'qa-chicken-breast',
    name: 'Grilled Chicken Breast (100g)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g',
    category: 'protein',
  },
  {
    id: 'qa-brown-rice',
    name: 'Brown Rice (1 cup cooked)',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1 cup',
    category: 'carbs',
  },
  {
    id: 'qa-eggs',
    name: 'Large Eggs (2)',
    calories: 143,
    protein: 12,
    carbs: 0.7,
    fat: 9.5,
    servingSize: '2 large',
    category: 'protein',
  },
  {
    id: 'qa-oatmeal',
    name: 'Oatmeal (1 cup cooked)',
    calories: 158,
    protein: 6,
    carbs: 27,
    fat: 3,
    servingSize: '1 cup',
    category: 'carbs',
  },
  {
    id: 'qa-banana',
    name: 'Banana (medium)',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium',
    category: 'fruit',
  },
  {
    id: 'qa-almonds',
    name: 'Almonds (1 oz)',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    servingSize: '1 oz (28g)',
    category: 'fat',
  },
  {
    id: 'qa-salmon',
    name: 'Salmon Fillet (100g)',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    servingSize: '100g',
    category: 'protein',
  },
  {
    id: 'qa-broccoli',
    name: 'Broccoli (1 cup)',
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fat: 0.6,
    servingSize: '1 cup',
    category: 'vegetable',
  },
  {
    id: 'qa-whey-protein',
    name: 'Whey Protein Shake',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1,
    servingSize: '1 scoop',
    category: 'protein',
  },
  {
    id: 'qa-avocado',
    name: 'Avocado (half)',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    servingSize: '1/2 avocado',
    category: 'fat',
  },
  {
    id: 'qa-greek-yogurt',
    name: 'Greek Yogurt (1 cup)',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.7,
    servingSize: '1 cup',
    category: 'protein',
  },
  {
    id: 'qa-sweet-potato',
    name: 'Sweet Potato (medium)',
    calories: 103,
    protein: 2.3,
    carbs: 24,
    fat: 0.1,
    servingSize: '1 medium',
    category: 'carbs',
  },
]

/**
 * Get all meals
 */
export function getMeals(): MealEntry[] {
  const result = getItem<MealEntry[]>(STORAGE_KEYS.MEALS)
  return result.success && result.data ? result.data : []
}

/**
 * Get meals for a specific date
 */
export function getMealsForDate(date: Date): MealEntry[] {
  const meals = getMeals()
  const targetDate = format(date, 'yyyy-MM-dd')

  return meals.filter((meal) => meal.date === targetDate)
}

/**
 * Get meals for date range
 */
export function getMealsForDateRange(startDate: Date, endDate: Date): MealEntry[] {
  const meals = getMeals()

  return meals.filter((meal) => {
    const mealDate = new Date(meal.date)
    return mealDate >= startDate && mealDate <= endDate
  })
}

/**
 * Get today's meals
 */
export function getTodaysMeals(): MealEntry[] {
  return getMealsForDate(new Date())
}

/**
 * Get meal by ID
 */
export function getMealById(id: string): MealEntry | undefined {
  const meals = getMeals()
  return meals.find((meal) => meal.id === id)
}

/**
 * Get nutrition targets
 */
export function getNutritionTargets(): NutritionTarget {
  const result = getItem<NutritionTarget>(STORAGE_KEYS.NUTRITION_TARGETS)

  return (
    result.success && result.data
      ? result.data
      : {
          dailyCalories: 2000,
          protein: 150,
          carbs: 200,
          fat: 65,
        }
  )
}

/**
 * Update nutrition targets
 */
export function updateNutritionTargets(targets: NutritionTarget): void {
  setItem(STORAGE_KEYS.NUTRITION_TARGETS, targets)
}

/**
 * Calculate daily nutrition summary
 */
export function getDailyNutritionSummary(date: Date = new Date()): DailyNutritionSummary {
  const meals = getMealsForDate(date)
  const targets = getNutritionTargets()

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0)
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0)
  const totalFiber = meals.reduce((sum, meal) => sum + (meal.fiber || 0), 0)

  // Check if within target (within 10% tolerance)
  const isWithinTarget =
    totalCalories >= targets.dailyCalories * 0.9 && totalCalories <= targets.dailyCalories * 1.1

  return {
    date: format(date, 'yyyy-MM-dd'),
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalFiber,
    meals,
    target: targets,
    isWithinTarget,
  }
}

/**
 * Get weekly nutrition summary
 */
export function getWeeklyNutritionSummary(): DailyNutritionSummary[] {
  const summaries: DailyNutritionSummary[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i)
    summaries.push(getDailyNutritionSummary(date))
  }

  return summaries
}

/**
 * Get weekly averages
 */
export function getWeeklyNutritionAverages(): {
  calories: number
  protein: number
  carbs: number
  fat: number
} {
  const weekly = getWeeklyNutritionSummary()

  const daysWithMeals = weekly.filter((day) => day.meals.length > 0)

  if (daysWithMeals.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }

  return {
    calories: Math.round(
      daysWithMeals.reduce((sum, day) => sum + day.totalCalories, 0) / daysWithMeals.length
    ),
    protein: Math.round(
      daysWithMeals.reduce((sum, day) => sum + day.totalProtein, 0) / daysWithMeals.length
    ),
    carbs: Math.round(
      daysWithMeals.reduce((sum, day) => sum + day.totalCarbs, 0) / daysWithMeals.length
    ),
    fat: Math.round(
      daysWithMeals.reduce((sum, day) => sum + day.totalFat, 0) / daysWithMeals.length
    ),
  }
}

/**
 * Add meal entry
 */
export function addMealEntry(data: Omit<MealEntry, 'id'>): MealEntry {
  const meal: MealEntry = {
    ...data,
    id: generateMealId(),
  }

  const meals = getMeals()
  const updatedMeals = [...meals, meal]
  setItem(STORAGE_KEYS.MEALS, updatedMeals)

  return meal
}

/**
 * Update meal entry
 */
export function updateMealEntry(id: string, updates: Partial<MealEntry>): MealEntry | null {
  const meals = getMeals()
  const index = meals.findIndex((meal) => meal.id === id)

  if (index === -1) {
    return null
  }

  const updatedMeal = { ...meals[index], ...updates }
  const updatedMeals = [...meals]
  updatedMeals[index] = updatedMeal

  setItem(STORAGE_KEYS.MEALS, updatedMeals)

  return updatedMeal
}

/**
 * Delete meal entry
 */
export function deleteMealEntry(id: string): boolean {
  const meals = getMeals()
  const updatedMeals = meals.filter((meal) => meal.id !== id)

  if (updatedMeals.length === meals.length) {
    return false
  }

  setItem(STORAGE_KEYS.MEALS, updatedMeals)
  return true
}

/**
 * Quick add from preset foods
 */
export function quickAddFood(foodId: string, date: Date = new Date()): MealEntry | null {
  const quickAddFoods = getQuickAddFoods()
  const food = quickAddFoods.find((f) => f.id === foodId)

  if (!food) {
    return null
  }

  // Determine meal type based on time
  const hour = new Date().getHours()
  let mealType: MealType = 'snack'

  if (hour >= 5 && hour < 10) mealType = 'breakfast'
  else if (hour >= 10 && hour < 14) mealType = 'lunch'
  else if (hour >= 14 && hour < 18) mealType = 'snack'
  else if (hour >= 18 && hour < 22) mealType = 'dinner'
  else mealType = 'snack'

  return addMealEntry({
    date: format(date, 'yyyy-MM-dd'),
    name: food.name,
    mealType,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
  })
}

/**
 * Get quick add foods
 */
export function getQuickAddFoods(): QuickAddFood[] {
  const result = getItem<QuickAddFood[]>(STORAGE_KEYS.QUICK_ADD_FOODS)

  if (result.success && result.data && result.data.length > 0) {
    return result.data
  }

  // Initialize with defaults
  setItem(STORAGE_KEYS.QUICK_ADD_FOODS, DEFAULT_QUICK_ADD_FOODS)
  return DEFAULT_QUICK_ADD_FOODS
}

/**
 * Add custom quick add food
 */
export function addQuickAddFood(food: Omit<QuickAddFood, 'id'>): QuickAddFood {
  const foods = getQuickAddFoods()

  const newFood: QuickAddFood = {
    ...food,
    id: `custom-food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }

  const updatedFoods = [...foods, newFood]
  setItem(STORAGE_KEYS.QUICK_ADD_FOODS, updatedFoods)

  return newFood
}

/**
 * Delete quick add food
 */
export function deleteQuickAddFood(id: string): boolean {
  const foods = getQuickAddFoods()
  const updatedFoods = foods.filter((food) => food.id !== id)

  if (updatedFoods.length === foods.length) {
    return false
  }

  setItem(STORAGE_KEYS.QUICK_ADD_FOODS, updatedFoods)
  return true
}

/**
 * Get meals by type for a date
 */
export function getMealsByType(date: Date, mealType: MealType): MealEntry[] {
  const meals = getMealsForDate(date)
  return meals.filter((meal) => meal.mealType === mealType)
}

/**
 * Get nutrition progress percentage
 */
export function getNutritionProgress(date: Date = new Date()): {
  calories: number
  protein: number
  carbs: number
  fat: number
} {
  const summary = getDailyNutritionSummary(date)
  const targets = summary.target

  return {
    calories: Math.min(100, Math.round((summary.totalCalories / targets.dailyCalories) * 100)),
    protein: Math.min(100, Math.round((summary.totalProtein / targets.protein) * 100)),
    carbs: Math.min(100, Math.round((summary.totalCarbs / targets.carbs) * 100)),
    fat: Math.min(100, Math.round((summary.totalFat / targets.fat) * 100)),
  }
}

/**
 * Get remaining calories and macros
 */
export function getRemainingNutrition(date: Date = new Date()): {
  calories: number
  protein: number
  carbs: number
  fat: number
} {
  const summary = getDailyNutritionSummary(date)
  const targets = summary.target

  return {
    calories: Math.max(0, targets.dailyCalories - summary.totalCalories),
    protein: Math.max(0, targets.protein - summary.totalProtein),
    carbs: Math.max(0, targets.carbs - summary.totalCarbs),
    fat: Math.max(0, targets.fat - summary.totalFat),
  }
}

/**
 * Get macro distribution percentage
 */
export function getMacroDistribution(date: Date = new Date()): {
  protein: number
  carbs: number
  fat: number
} {
  const summary = getDailyNutritionSummary(date)

  const totalCaloriesFromMacros =
    summary.totalProtein * 4 + summary.totalCarbs * 4 + summary.totalFat * 9

  if (totalCaloriesFromMacros === 0) {
    return { protein: 0, carbs: 0, fat: 0 }
  }

  return {
    protein: Math.round((summary.totalProtein * 4 / totalCaloriesFromMacros) * 100),
    carbs: Math.round((summary.totalCarbs * 4 / totalCaloriesFromMacros) * 100),
    fat: Math.round((summary.totalFat * 9 / totalCaloriesFromMacros) * 100),
  }
}

/**
 * Search meals
 */
export function searchMeals(query: string, date?: Date): MealEntry[] {
  const meals = date ? getMealsForDate(date) : getMeals()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) {
    return meals
  }

  return meals.filter((meal) => meal.name.toLowerCase().includes(searchTerm))
}

/**
 * Get calorie history for charts
 */
export function getCalorieHistory(days: number = 30): Array<{ date: string; calories: number; target: number }> {
  const targets = getNutritionTargets()
  const history: Array<{ date: string; calories: number; target: number }> = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i)
    const summary = getDailyNutritionSummary(date)

    history.push({
      date: format(date, 'MMM dd'),
      calories: summary.totalCalories,
      target: targets.dailyCalories,
    })
  }

  return history
}

/**
 * Duplicate meal entry
 */
export function duplicateMealEntry(id: string, newDate?: Date): MealEntry | null {
  const meal = getMealById(id)
  if (!meal) return null

  return addMealEntry({
    ...meal,
    date: newDate ? format(newDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  })
}

/**
 * Get most logged foods
 */
export function getMostLoggedFoods(limit: number = 10): Array<{ name: string; count: number }> {
  const meals = getMeals()
  const foodCounts: Record<string, number> = {}

  meals.forEach((meal) => {
    foodCounts[meal.name] = (foodCounts[meal.name] || 0) + 1
  })

  return Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }))
}
