import type { WorkoutExercise } from './exercise'

/**
 * Workout types
 */
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'mixed'

/**
 * Workout status
 */
export type WorkoutStatus = 'planned' | 'in-progress' | 'completed' | 'skipped'

/**
 * Main workout interface
 */
export interface Workout {
  id: string
  name?: string
  date: string // ISO date string
  startTime?: string // ISO timestamp
  endTime?: string // ISO timestamp
  duration: number // in minutes
  type: WorkoutType
  status: WorkoutStatus
  exercises: WorkoutExercise[]
  notes?: string
  totalVolume?: number // kg or lbs
  totalSets?: number
  totalReps?: number
}

/**
 * Active workout session for tracking
 */
export interface ActiveWorkoutSession {
  workoutId: string
  startTime: string
  currentExerciseIndex: number
  currentSetIndex: number
  exercises: WorkoutExercise[]
  restTimerEndTime?: string
}

/**
 * Personal record types
 */
export type PersonalRecordType = 'oneRepMax' | 'maxVolume' | 'maxWeight' | 'maxReps' | 'longestDuration'

/**
 * Personal record entry
 */
export interface PersonalRecord {
  id: string
  exerciseId: string
  type: PersonalRecordType
  value: number
  date: string
  workoutId: string
}

/**
 * Workout statistics summary
 */
export interface WorkoutStatistics {
  totalWorkouts: number
  totalVolume: number
  totalDuration: number
  averageDuration: number
  currentStreak: number
  longestStreak: number
  workoutsThisWeek: number
  workoutsThisMonth: number
  mostFrequentMuscleGroup: string
}

/**
 * Weekly volume data
 */
export interface WeeklyVolumeData {
  weekStart: string
  volume: number
  workoutCount: number
}
