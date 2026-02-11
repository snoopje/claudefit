/**
 * Central type exports for ClaudeFit
 */

import type { WorkoutType } from './workout'

// Exercise types
export type {
  Exercise,
  ExerciseSet,
  WorkoutExercise,
  MuscleGroup,
  ExerciseType,
} from './exercise'
export { MUSCLE_GROUP_CONFIG, EXERCISE_TYPE_LABELS } from './exercise'

// Workout types
export type {
  Workout,
  WorkoutType,
  WorkoutStatus,
  ActiveWorkoutSession,
  PersonalRecord,
  PersonalRecordType,
  WorkoutStatistics,
  WeeklyVolumeData,
} from './workout'

// Routine types
export type {
  Routine,
  RoutineExercise,
  RoutineUsage,
} from './routine'

// Body metrics types
export type {
  BodyMetric,
  BodyMeasurements,
  WeightUnit,
  MeasurementUnit,
  UnitPreferences,
  WeightTrend,
  MeasurementTrend,
} from './bodyMetrics'

// Nutrition types
export type {
  MealEntry,
  MealType,
  NutritionTarget,
  DailyNutritionSummary,
  QuickAddFood,
} from './nutrition'
export { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from './nutrition'

// Goal types
export type {
  Goal,
  GoalCategory,
  GoalPeriod,
  GoalStatus,
  GoalProgress,
  GoalProgressSnapshot,
  GoalTemplate,
} from './goal'
export { GOAL_CATEGORY_LABELS } from './goal'

/**
 * App settings
 */
export interface AppSettings {
  units: {
    weight: 'kg' | 'lbs'
    measurement: 'cm' | 'in'
  }
  preferences: {
    defaultRestTime: number // seconds
    theme: 'dark' // always dark for ClaudeFit
    notificationsEnabled: boolean
  }
}

/**
 * Export/Import data structure
 */
export interface ExportData {
  version: string
  exportDate: string
  exercises: unknown[]
  workouts: unknown[]
  routines: unknown[]
  bodyMetrics: unknown[]
  meals: unknown[]
  nutritionTargets: unknown
  goals: unknown[]
  settings: AppSettings
}

/**
 * Filter options for workout history
 */
export interface WorkoutFilters {
  dateRange?: {
    start: string
    end: string
  }
  type?: WorkoutType
  muscleGroup?: string
  searchTerm?: string
}

/**
 * Date range preset
 */
export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last-7-days'
  | 'last-30-days'
  | 'last-90-days'
  | 'this-week'
  | 'this-month'
  | 'this-year'
  | 'all-time'

/**
 * Chart data point
 */
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  EXERCISES: 'claudefit_exercises',
  WORKOUTS: 'claudefit_workouts',
  ROUTINES: 'claudefit_routines',
  BODY_METRICS: 'claudefit_body_metrics',
  MEALS: 'claudefit_meals',
  NUTRITION_TARGETS: 'claudefit_nutrition_targets',
  GOALS: 'claudefit_goals',
  SETTINGS: 'claudefit_settings',
  ACTIVE_WORKOUT: 'claudefit_active_workout',
  PERSONAL_RECORDS: 'claudefit_personal_records',
  QUICK_ADD_FOODS: 'claudefit_quick_add_foods',
} as const
