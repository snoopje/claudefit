/**
 * Exercise type definition
 */
export interface Exercise {
  id: string
  name: string
  muscleGroups: MuscleGroup[]
  equipment: string
  type: ExerciseType
  isCustom?: boolean
}

/**
 * Muscle group categories
 */
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'flexibility'
  | 'full-body'

/**
 * Exercise types
 */
export type ExerciseType = 'strength' | 'cardio' | 'flexibility'

/**
 * Exercise set data for workout logging
 */
export interface ExerciseSet {
  reps?: number
  weight?: number
  duration?: number // in seconds, for cardio
  distance?: number // in meters, for cardio
  completed: boolean
}

/**
 * Exercise entry in a workout
 */
export interface WorkoutExercise {
  exerciseId: string
  sets: ExerciseSet[]
  notes?: string
}

/**
 * Muscle group display configuration
 */
export const MUSCLE_GROUP_CONFIG: Record<MuscleGroup, { label: string; color: string }> = {
  chest: { label: 'Chest', color: '#ff6b6b' },
  back: { label: 'Back', color: '#4ecdc4' },
  legs: { label: 'Legs', color: '#95e1d3' },
  shoulders: { label: 'Shoulders', color: '#ffd93d' },
  arms: { label: 'Arms', color: '#ff9f43' },
  core: { label: 'Core', color: '#a8e6cf' },
  cardio: { label: 'Cardio', color: '#ff6b9d' },
  flexibility: { label: 'Flexibility', color: '#c44569' },
  'full-body': { label: 'Full Body', color: '#c8ff00' },
}

/**
 * Exercise type labels
 */
export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  flexibility: 'Flexibility',
}
