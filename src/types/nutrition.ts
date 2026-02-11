/**
 * Meal entry for nutrition tracking
 */
export interface MealEntry {
  id: string
  date: string // ISO date string
  name: string
  mealType: MealType
  calories: number
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber?: number // grams
  sugar?: number // grams
  sodium?: number // mg
  notes?: string
}

/**
 * Meal types
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'post-workout' | 'other'

/**
 * Daily nutrition targets
 */
export interface NutritionTarget {
  dailyCalories: number
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber?: number // grams
}

/**
 * Daily nutrition summary
 */
export interface DailyNutritionSummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  totalFiber?: number
  meals: MealEntry[]
  target: NutritionTarget
  isWithinTarget: boolean
}

/**
 * Quick add food item
 */
export interface QuickAddFood {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  servingSize: string
  category: string
}

/**
 * Meal type labels
 */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  'post-workout': 'Post-Workout',
  other: 'Other',
}

/**
 * Meal type icons (emoji for simplicity)
 */
export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
  'post-workout': '💪',
  other: '📝',
}
