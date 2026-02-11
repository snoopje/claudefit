/**
 * Routine exercise template
 */
export interface RoutineExercise {
  exerciseId: string
  defaultSets: number
  defaultReps?: number
  defaultWeight?: number
  defaultDuration?: number // for cardio
  notes?: string
  restTime?: number // suggested rest time in seconds
}

/**
 * Workout routine template
 */
export interface Routine {
  id: string
  name: string
  description?: string
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed'
  exercises: RoutineExercise[]
  estimatedDuration?: number // in minutes
  tags?: string[]
  createdAt: string
  isFavorite?: boolean
}

/**
 * Routine history - tracks when a routine was used
 */
export interface RoutineUsage {
  routineId: string
  workoutId: string
  date: string
}
