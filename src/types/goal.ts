/**
 * Goal categories
 */
export type GoalCategory =
  | 'workouts-per-week'
  | 'workouts-per-month'
  | 'calories-per-day'
  | 'protein-per-day'
  | 'bodyweight'
  | 'measurement'
  | 'strength'
  | 'custom'

/**
 * Goal frequency period
 */
export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'one-time'

/**
 * Goal status
 */
export type GoalStatus = 'active' | 'in-progress' | 'completed' | 'missed' | 'paused'

/**
 * Goal definition
 */
export interface Goal {
  id: string
  name: string
  description?: string
  category: GoalCategory
  period: GoalPeriod
  targetValue: number
  currentValue: number
  unit: string
  startDate: string // ISO date
  endDate: string // ISO date
  status: GoalStatus
  remindersEnabled?: boolean
  reminderDays?: number[] // 0-6 (Sunday-Saturday)
  createdAt: string
  completedAt?: string
  progressHistory?: GoalProgressSnapshot[]
}

/**
 * Goal progress snapshot for tracking history
 */
export interface GoalProgressSnapshot {
  date: string
  value: number
}

/**
 * Goal progress calculation
 */
export interface GoalProgress {
  percentage: number
  remaining: number
  isComplete: boolean
  isOnTrack: boolean
  daysRemaining: number
}

/**
 * Goal template for quick creation
 */
export interface GoalTemplate {
  id: string
  name: string
  description: string
  category: GoalCategory
  period: GoalPeriod
  defaultTarget: number
  unit: string
  suggestedDuration?: number // in days
}

/**
 * Goal category labels
 */
export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  'workouts-per-week': 'Workouts per Week',
  'workouts-per-month': 'Workouts per Month',
  'calories-per-day': 'Daily Calories',
  'protein-per-day': 'Daily Protein',
  bodyweight: 'Bodyweight',
  measurement: 'Body Measurement',
  strength: 'Strength PR',
  custom: 'Custom Goal',
}
