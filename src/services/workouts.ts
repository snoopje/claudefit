/**
 * Workout service - manages workout sessions and history
 */

import type {
  Workout,
  WorkoutExercise,
  ExerciseSet,
  ActiveWorkoutSession,
  WorkoutStatistics,
  WeeklyVolumeData,
  PersonalRecord,
  PersonalRecordType,
  WorkoutType,
} from '../types'
import { STORAGE_KEYS } from '../types'
import { getItem, setItem, removeItem } from './storage'
import { getExerciseById } from './exercises'
import { startOfWeek, endOfWeek, subDays, format, isSameDay, startOfDay } from 'date-fns'

/**
 * Generate unique workout ID
 */
function generateWorkoutId(): string {
  return `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all workouts
 */
export function getWorkouts(): Workout[] {
  const result = getItem<Workout[]>(STORAGE_KEYS.WORKOUTS)
  return result.success && result.data ? result.data : []
}

/**
 * Get workout by ID
 */
export function getWorkoutById(id: string): Workout | undefined {
  const workouts = getWorkouts()
  return workouts.find((workout) => workout.id === id)
}

/**
 * Get workouts by date range
 */
export function getWorkoutsByDateRange(startDate: Date, endDate: Date): Workout[] {
  const workouts = getWorkouts()
  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.date)
    return workoutDate >= startOfDay(startDate) && workoutDate <= endOfDay(endDate)
  })
}

/**
 * Get workouts by muscle group
 */
export function getWorkoutsByMuscleGroup(muscleGroup: string): Workout[] {
  const workouts = getWorkouts()
  return workouts.filter((workout) =>
    workout.exercises.some((exercise) => {
      const exerciseData = getExerciseById(exercise.exerciseId)
      return exerciseData?.muscleGroups.includes(muscleGroup as any)
    })
  )
}

/**
 * Get recent workouts (last N)
 */
export function getRecentWorkouts(count: number = 10): Workout[] {
  const workouts = getWorkouts()
  return workouts
    .filter((w) => w.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}

/**
 * Create new workout
 */
export function createWorkout(data: Omit<Workout, 'id' | 'totalVolume' | 'totalSets' | 'totalReps'>): Workout {
  const workout: Workout = {
    ...data,
    id: generateWorkoutId(),
    totalVolume: 0,
    totalSets: 0,
    totalReps: 0,
  }

  // Calculate totals
  workout.totalSets = data.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  workout.totalReps = data.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0),
    0
  )
  workout.totalVolume = data.exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0),
    0
  )

  const workouts = getWorkouts()
  const updatedWorkouts = [...workouts, workout]
  setItem(STORAGE_KEYS.WORKOUTS, updatedWorkouts)

  return workout
}

/**
 * Update workout
 */
export function updateWorkout(id: string, updates: Partial<Workout>): Workout | null {
  const workouts = getWorkouts()
  const index = workouts.findIndex((workout) => workout.id === id)

  if (index === -1) {
    return null
  }

  const updatedWorkout = { ...workouts[index], ...updates }

  // Recalculate totals if exercises changed
  if (updates.exercises) {
    updatedWorkout.totalSets = updates.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    updatedWorkout.totalReps = updates.exercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0),
      0
    )
    updatedWorkout.totalVolume = updates.exercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0),
      0
    )
  }

  const updatedWorkouts = [...workouts]
  updatedWorkouts[index] = updatedWorkout

  setItem(STORAGE_KEYS.WORKOUTS, updatedWorkouts)
  updatePersonalRecords(updatedWorkout)

  return updatedWorkout
}

/**
 * Delete workout
 */
export function deleteWorkout(id: string): boolean {
  const workouts = getWorkouts()
  const updatedWorkouts = workouts.filter((workout) => workout.id !== id)

  if (updatedWorkouts.length === workouts.length) {
    return false
  }

  setItem(STORAGE_KEYS.WORKOUTS, updatedWorkouts)
  return true
}

/**
 * Start a new workout session
 */
export function startWorkoutSession(exercises: WorkoutExercise[]): ActiveWorkoutSession {
  const session: ActiveWorkoutSession = {
    workoutId: generateWorkoutId(),
    startTime: new Date().toISOString(),
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    exercises: exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((set) => ({ ...set, completed: false })),
    })),
  }

  setItem(STORAGE_KEYS.ACTIVE_WORKOUT, session)
  return session
}

/**
 * Get active workout session
 */
export function getActiveWorkoutSession(): ActiveWorkoutSession | null {
  const result = getItem<ActiveWorkoutSession>(STORAGE_KEYS.ACTIVE_WORKOUT)
  return result.success && result.data ? result.data : null
}

/**
 * Update active workout session
 */
export function updateActiveSession(session: ActiveWorkoutSession): void {
  setItem(STORAGE_KEYS.ACTIVE_WORKOUT, session)
}

/**
 * Complete current set in active session
 */
export function completeCurrentSet(): ActiveWorkoutSession | null {
  const session = getActiveWorkoutSession()
  if (!session) return null

  const { exercises, currentExerciseIndex, currentSetIndex } = session

  if (exercises[currentExerciseIndex]?.sets[currentSetIndex]) {
    exercises[currentExerciseIndex].sets[currentSetIndex].completed = true

    // Move to next set or exercise
    if (currentSetIndex < exercises[currentExerciseIndex].sets.length - 1) {
      session.currentSetIndex = currentSetIndex + 1
    } else if (currentExerciseIndex < exercises.length - 1) {
      session.currentExerciseIndex = currentExerciseIndex + 1
      session.currentSetIndex = 0
    }

    updateActiveSession(session)
    return session
  }

  return session
}

/**
 * Set rest timer for active session
 */
export function setRestTimer(durationSeconds: number): void {
  const session = getActiveWorkoutSession()
  if (!session) return

  const endTime = new Date(Date.now() + durationSeconds * 1000).toISOString()
  session.restTimerEndTime = endTime
  updateActiveSession(session)
}

/**
 * Clear rest timer
 */
export function clearRestTimer(): void {
  const session = getActiveWorkoutSession()
  if (!session) return

  session.restTimerEndTime = undefined
  updateActiveSession(session)
}

/**
 * Finish workout session
 */
export function finishWorkoutSession(notes?: string): Workout | null {
  const session = getActiveWorkoutSession()
  if (!session) return null

  const endTime = new Date()
  const startTime = new Date(session.startTime)
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000) // minutes

  // Determine workout type based on exercises
  const exerciseTypes = session.exercises.map((ex) => {
    const exerciseData = getExerciseById(ex.exerciseId)
    return exerciseData?.type || 'strength'
  })

  let workoutType: WorkoutType = 'strength'
  const strengthCount = exerciseTypes.filter((t) => t === 'strength').length
  const cardioCount = exerciseTypes.filter((t) => t === 'cardio').length
  const flexibilityCount = exerciseTypes.filter((t) => t === 'flexibility').length

  if (cardioCount > strengthCount && cardioCount > flexibilityCount) {
    workoutType = 'cardio'
  } else if (flexibilityCount > strengthCount && flexibilityCount > cardioCount) {
    workoutType = 'flexibility'
  } else if (exerciseTypes.length > 1 && new Set(exerciseTypes).size > 1) {
    workoutType = 'mixed'
  }

  const workout = createWorkout({
    name: session.workoutId,
    date: format(startTime, 'yyyy-MM-dd'),
    startTime: session.startTime,
    endTime: endTime.toISOString(),
    duration,
    type: workoutType,
    status: 'completed',
    exercises: session.exercises,
    notes,
  })

  // Clear active session
  removeItem(STORAGE_KEYS.ACTIVE_WORKOUT)

  return workout
}

/**
 * Cancel workout session
 */
export function cancelWorkoutSession(): void {
  removeItem(STORAGE_KEYS.ACTIVE_WORKOUT)
}

/**
 * Get workout statistics
 */
export function getWorkoutStatistics(): WorkoutStatistics {
  const workouts = getWorkouts().filter((w) => w.status === 'completed')
  const now = new Date()

  // Calculate streak
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const sortedDates = workouts
    .map((w) => new Date(w.date))
    .sort((a, b) => b.getTime() - a.getTime())
    .map((d) => format(d, 'yyyy-MM-dd'))

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i])
    const expectedDate = i === 0 ? now : subDays(new Date(sortedDates[i - 1]), 1)

    if (isSameDay(currentDate, expectedDate) || (i === 0 && isWithinLastDays(currentDate, 1))) {
      tempStreak++
    } else {
      tempStreak = 1
    }

    if (i === 0 && isWithinLastDays(currentDate, 1)) {
      currentStreak = tempStreak
    }

    longestStreak = Math.max(longestStreak, tempStreak)
  }

  // This week's workouts
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)
  const workoutsThisWeek = workouts.filter((w) => {
    const date = new Date(w.date)
    return date >= weekStart && date <= weekEnd
  }).length

  // This month's workouts
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const workoutsThisMonth = workouts.filter((w) => {
    const date = new Date(w.date)
    return date >= monthStart
  }).length

  // Total volume
  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0)
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)

  // Most frequent muscle group
  const muscleGroupCounts: Record<string, number> = {}
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const exerciseData = getExerciseById(exercise.exerciseId)
      exerciseData?.muscleGroups.forEach((mg) => {
        muscleGroupCounts[mg] = (muscleGroupCounts[mg] || 0) + 1
      })
    })
  })

  const mostFrequentMuscleGroup =
    Object.entries(muscleGroupCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  return {
    totalWorkouts: workouts.length,
    totalVolume,
    totalDuration,
    averageDuration: workouts.length > 0 ? Math.round(totalDuration / workouts.length) : 0,
    currentStreak,
    longestStreak,
    workoutsThisWeek,
    workoutsThisMonth,
    mostFrequentMuscleGroup,
  }
}

/**
 * Get weekly volume data
 */
export function getWeeklyVolumeData(weeks: number = 12): WeeklyVolumeData[] {
  const workouts = getWorkouts().filter((w) => w.status === 'completed')
  const data: WeeklyVolumeData[] = []

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subDays(new Date(), i * 7))
    const weekEnd = endOfWeek(weekStart)

    const weekWorkouts = workouts.filter((w) => {
      const date = new Date(w.date)
      return date >= weekStart && date <= weekEnd
    })

    data.push({
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      volume: weekWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0),
      workoutCount: weekWorkouts.length,
    })
  }

  return data
}

/**
 * Personal Records
 */
export function getPersonalRecords(): Record<string, PersonalRecord[]> {
  const result = getItem<Record<string, PersonalRecord[]>>(STORAGE_KEYS.PERSONAL_RECORDS)
  return result.success && result.data ? result.data : {}
}

/**
 * Update personal records after a workout
 */
function updatePersonalRecords(workout: Workout): void {
  const records = getPersonalRecords()

  workout.exercises.forEach((workoutExercise) => {
    const exerciseRecords = records[workoutExercise.exerciseId] || []

    workoutExercise.sets.forEach((set) => {
      if (!set.completed || (!set.weight && !set.reps && !set.duration)) return

      const date = workout.date

      // Check for 1RM (using Epley formula approximation)
      if (set.weight && set.reps && set.reps <= 10) {
        const estimated1RM = Math.round(set.weight * (1 + set.reps / 30))
        const existing1RM = exerciseRecords.find((r) => r.type === 'oneRepMax')

        if (!existing1RM || estimated1RM > existing1RM.value) {
          const newRecord: PersonalRecord = {
            id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            exerciseId: workoutExercise.exerciseId,
            type: 'oneRepMax',
            value: estimated1RM,
            date,
            workoutId: workout.id,
          }

          records[workoutExercise.exerciseId] = exerciseRecords.filter((r) => r.type !== 'oneRepMax').concat(newRecord)
        }
      }

      // Check for max weight
      if (set.weight) {
        const existingMaxWeight = exerciseRecords.find((r) => r.type === 'maxWeight')
        if (!existingMaxWeight || set.weight > existingMaxWeight.value) {
          const newRecord: PersonalRecord = {
            id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            exerciseId: workoutExercise.exerciseId,
            type: 'maxWeight',
            value: set.weight,
            date,
            workoutId: workout.id,
          }

          records[workoutExercise.exerciseId] = exerciseRecords.filter((r) => r.type !== 'maxWeight').concat(newRecord)
        }
      }

      // Check for max reps (with weight)
      if (set.reps && set.weight && set.weight > 0) {
        const existingMaxReps = exerciseRecords.find((r) => r.type === 'maxReps' && r.value === set.weight)
        // This is a simplified check - in reality, you'd track max reps at each weight level
      }

      // Check for max volume (weight * reps)
      if (set.weight && set.reps) {
        const volume = set.weight * set.reps
        const existingMaxVolume = exerciseRecords.find((r) => r.type === 'maxVolume')

        if (!existingMaxVolume || volume > existingMaxVolume.value) {
          const newRecord: PersonalRecord = {
            id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            exerciseId: workoutExercise.exerciseId,
            type: 'maxVolume',
            value: volume,
            date,
            workoutId: workout.id,
          }

          records[workoutExercise.exerciseId] = exerciseRecords.filter((r) => r.type !== 'maxVolume').concat(newRecord)
        }
      }

      // Check for longest duration (cardio)
      if (set.duration) {
        const existingDuration = exerciseRecords.find((r) => r.type === 'longestDuration')
        if (!existingDuration || set.duration > existingDuration.value) {
          const newRecord: PersonalRecord = {
            id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            exerciseId: workoutExercise.exerciseId,
            type: 'longestDuration',
            value: set.duration,
            date,
            workoutId: workout.id,
          }

          records[workoutExercise.exerciseId] = exerciseRecords.filter((r) => r.type !== 'longestDuration').concat(newRecord)
        }
      }
    })
  })

  setItem(STORAGE_KEYS.PERSONAL_RECORDS, records)
}

/**
 * Get PRs for an exercise
 */
export function getExercisePRs(exerciseId: string): PersonalRecord[] {
  const records = getPersonalRecords()
  return records[exerciseId] || []
}

/**
 * Get all recent PRs
 */
export function getRecentPRs(limit: number = 10): PersonalRecord[] {
  const records = getPersonalRecords()
  const allRecords: PersonalRecord[] = []

  Object.values(records).forEach((exerciseRecords) => {
    allRecords.push(...exerciseRecords)
  })

  return allRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

// Helper function
function isWithinLastDays(date: Date, days: number): boolean {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return diff <= days * 24 * 60 * 60 * 1000
}

function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}
