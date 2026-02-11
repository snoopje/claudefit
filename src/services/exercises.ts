/**
 * Exercise service - manages exercise library
 */

import type { Exercise, MuscleGroup, ExerciseType } from '../types'
import { STORAGE_KEYS } from '../types'
import { getItem, setItem } from './storage'

/**
 * Pre-built seed exercises
 */
export const SEED_EXERCISES: Exercise[] = [
  // Chest
  {
    id: 'ex-barbell-bench-press',
    name: 'Barbell Bench Press',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-incline-bench-press',
    name: 'Incline Bench Press',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-decline-bench-press',
    name: 'Decline Bench Press',
    muscleGroups: ['chest', 'arms'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-cable-fly',
    name: 'Cable Fly',
    muscleGroups: ['chest'],
    equipment: 'cable machine',
    type: 'strength',
  },
  {
    id: 'ex-push-ups',
    name: 'Push-ups',
    muscleGroups: ['chest', 'shoulders', 'arms', 'core'],
    equipment: 'none',
    type: 'strength',
  },
  {
    id: 'ex-dips',
    name: 'Dips',
    muscleGroups: ['chest', 'arms', 'shoulders'],
    equipment: 'dip station',
    type: 'strength',
  },

  // Back
  {
    id: 'ex-deadlift',
    name: 'Deadlift',
    muscleGroups: ['back', 'legs', 'core'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-pull-ups',
    name: 'Pull-ups',
    muscleGroups: ['back', 'arms', 'shoulders'],
    equipment: 'pull-up bar',
    type: 'strength',
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroups: ['back', 'arms'],
    equipment: 'cable machine',
    type: 'strength',
  },
  {
    id: 'ex-barbell-row',
    name: 'Barbell Row',
    muscleGroups: ['back', 'arms', 'core'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-dumbbell-row',
    name: 'Dumbbell Row',
    muscleGroups: ['back', 'arms'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-seated-cable-row',
    name: 'Seated Cable Row',
    muscleGroups: ['back', 'arms'],
    equipment: 'cable machine',
    type: 'strength',
  },
  {
    id: 'ex-face-pulls',
    name: 'Face Pulls',
    muscleGroups: ['back', 'shoulders'],
    equipment: 'cable machine',
    type: 'strength',
  },

  // Legs
  {
    id: 'ex-squat',
    name: 'Barbell Squat',
    muscleGroups: ['legs', 'core', 'back'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-leg-press',
    name: 'Leg Press',
    muscleGroups: ['legs'],
    equipment: 'leg press machine',
    type: 'strength',
  },
  {
    id: 'ex-lunges',
    name: 'Lunges',
    muscleGroups: ['legs', 'core'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-leg-curl',
    name: 'Leg Curl',
    muscleGroups: ['legs'],
    equipment: 'leg curl machine',
    type: 'strength',
  },
  {
    id: 'ex-leg-extension',
    name: 'Leg Extension',
    muscleGroups: ['legs'],
    equipment: 'leg extension machine',
    type: 'strength',
  },
  {
    id: 'ex-calf-raise',
    name: 'Calf Raise',
    muscleGroups: ['legs'],
    equipment: 'smith machine',
    type: 'strength',
  },
  {
    id: 'ex-bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroups: ['legs', 'core'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroups: ['legs', 'back'],
    equipment: 'barbell',
    type: 'strength',
  },

  // Shoulders
  {
    id: 'ex-overhead-press',
    name: 'Overhead Press',
    muscleGroups: ['shoulders', 'arms', 'core'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    muscleGroups: ['shoulders', 'arms', 'core'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-lateral-raise',
    name: 'Lateral Raise',
    muscleGroups: ['shoulders'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-front-raise',
    name: 'Front Raise',
    muscleGroups: ['shoulders'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-rear-delt-fly',
    name: 'Rear Delt Fly',
    muscleGroups: ['shoulders', 'back'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-shrugs',
    name: 'Shrugs',
    muscleGroups: ['shoulders', 'back'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-arnold-press',
    name: 'Arnold Press',
    muscleGroups: ['shoulders', 'arms'],
    equipment: 'dumbbells',
    type: 'strength',
  },

  // Arms
  {
    id: 'ex-barbell-curl',
    name: 'Barbell Curl',
    muscleGroups: ['arms'],
    equipment: 'barbell',
    type: 'strength',
  },
  {
    id: 'ex-dumbbell-curl',
    name: 'Dumbbell Curl',
    muscleGroups: ['arms'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-hammer-curl',
    name: 'Hammer Curl',
    muscleGroups: ['arms'],
    equipment: 'dumbbells',
    type: 'strength',
  },
  {
    id: 'ex-tricep-pushdown',
    name: 'Tricep Pushdown',
    muscleGroups: ['arms'],
    equipment: 'cable machine',
    type: 'strength',
  },
  {
    id: 'ex-skullcrushers',
    name: 'Skullcrushers',
    muscleGroups: ['arms'],
    equipment: 'ez-bar',
    type: 'strength',
  },
  {
    id: 'ex-tricep-dips',
    name: 'Tricep Dips',
    muscleGroups: ['arms', 'chest'],
    equipment: 'bench',
    type: 'strength',
  },
  {
    id: 'ex-preacher-curl',
    name: 'Preacher Curl',
    muscleGroups: ['arms'],
    equipment: 'ez-bar',
    type: 'strength',
  },
  {
    id: 'ex-overhead-tricep',
    name: 'Overhead Tricep Extension',
    muscleGroups: ['arms'],
    equipment: 'dumbbells',
    type: 'strength',
  },

  // Core
  {
    id: 'ex-plank',
    name: 'Plank',
    muscleGroups: ['core'],
    equipment: 'none',
    type: 'strength',
  },
  {
    id: 'ex-crunches',
    name: 'Crunches',
    muscleGroups: ['core'],
    equipment: 'none',
    type: 'strength',
  },
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroups: ['core'],
    equipment: 'pull-up bar',
    type: 'strength',
  },
  {
    id: 'ex-russian-twist',
    name: 'Russian Twist',
    muscleGroups: ['core'],
    equipment: 'none',
    type: 'strength',
  },
  {
    id: 'ex-cable-crunch',
    name: 'Cable Crunch',
    muscleGroups: ['core'],
    equipment: 'cable machine',
    type: 'strength',
  },
  {
    id: 'ex-deadbug',
    name: 'Deadbug',
    muscleGroups: ['core'],
    equipment: 'none',
    type: 'strength',
  },
  {
    id: 'ex-bicycle-crunch',
    name: 'Bicycle Crunch',
    muscleGroups: ['core'],
    equipment: 'none',
    type: 'strength',
  },
  {
    id: 'ex-ab-wheel',
    name: 'Ab Wheel Rollout',
    muscleGroups: ['core'],
    equipment: 'ab wheel',
    type: 'strength',
  },

  // Cardio
  {
    id: 'ex-running',
    name: 'Running',
    muscleGroups: ['cardio', 'legs'],
    equipment: 'none',
    type: 'cardio',
  },
  {
    id: 'ex-cycling',
    name: 'Cycling',
    muscleGroups: ['cardio', 'legs'],
    equipment: 'bike',
    type: 'cardio',
  },
  {
    id: 'ex-rowing',
    name: 'Rowing',
    muscleGroups: ['cardio', 'back', 'legs'],
    equipment: 'rowing machine',
    type: 'cardio',
  },
  {
    id: 'ex-jumping-rope',
    name: 'Jumping Rope',
    muscleGroups: ['cardio', 'legs'],
    equipment: 'jump rope',
    type: 'cardio',
  },
  {
    id: 'ex-burpees',
    name: 'Burpees',
    muscleGroups: ['cardio', 'full-body'],
    equipment: 'none',
    type: 'cardio',
  },
  {
    id: 'ex-box-jumps',
    name: 'Box Jumps',
    muscleGroups: ['cardio', 'legs'],
    equipment: 'plyo box',
    type: 'cardio',
  },

  // Flexibility
  {
    id: 'ex-yoga-flow',
    name: 'Yoga Flow',
    muscleGroups: ['flexibility', 'full-body'],
    equipment: 'mat',
    type: 'flexibility',
  },
  {
    id: 'ex-static-stretching',
    name: 'Static Stretching',
    muscleGroups: ['flexibility', 'full-body'],
    equipment: 'none',
    type: 'flexibility',
  },
  {
    id: 'ex-foam-rolling',
    name: 'Foam Rolling',
    muscleGroups: ['flexibility', 'full-body'],
    equipment: 'foam roller',
    type: 'flexibility',
  },
  {
    id: 'ex-dynamic-stretching',
    name: 'Dynamic Stretching',
    muscleGroups: ['flexibility', 'full-body'],
    equipment: 'none',
    type: 'flexibility',
  },
]

/**
 * Get all exercises from storage
 */
export function getExercises(): Exercise[] {
  const result =getItem<Exercise[]>(STORAGE_KEYS.EXERCISES)

  if (result.success && result.data && result.data.length > 0) {
    return result.data
  }

  // Initialize with seed exercises if empty
  setItem(STORAGE_KEYS.EXERCISES, SEED_EXERCISES)
  return SEED_EXERCISES
}

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): Exercise | undefined {
  const exercises = getExercises()
  return exercises.find((exercise) => exercise.id === id)
}

/**
 * Get exercises by muscle group
 */
export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  const exercises = getExercises()
  return exercises.filter((exercise) => exercise.muscleGroups.includes(muscleGroup))
}

/**
 * Get exercises by type
 */
export function getExercisesByType(type: ExerciseType): Exercise[] {
  const exercises = getExercises()
  return exercises.filter((exercise) => exercise.type === type)
}

/**
 * Search exercises by name
 */
export function searchExercises(query: string): Exercise[] {
  const exercises = getExercises()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) {
    return exercises
  }

  return exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.muscleGroups.some((mg) => mg.toLowerCase().includes(searchTerm)) ||
      exercise.equipment.toLowerCase().includes(searchTerm)
  )
}

/**
 * Add custom exercise
 */
export function addCustomExercise(exercise: Omit<Exercise, 'id' | 'isCustom'>): Exercise {
  const exercises = getExercises()

  const newExercise: Exercise = {
    ...exercise,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    isCustom: true,
  }

  const updatedExercises = [...exercises, newExercise]
  setItem(STORAGE_KEYS.EXERCISES, updatedExercises)

  return newExercise
}

/**
 * Update exercise
 */
export function updateExercise(id: string, updates: Partial<Exercise>): Exercise | null {
  const exercises = getExercises()
  const index = exercises.findIndex((exercise) => exercise.id === id)

  if (index === -1) {
    return null
  }

  const updatedExercises = [...exercises]
  updatedExercises[index] = { ...updatedExercises[index], ...updates }

  setItem(STORAGE_KEYS.EXERCISES, updatedExercises)

  return updatedExercises[index]
}

/**
 * Delete exercise
 */
export function deleteExercise(id: string): boolean {
  const exercises = getExercises()

  // Prevent deleting seed exercises
  const exercise = exercises.find((ex) => ex.id === id)
  if (exercise && !exercise.isCustom) {
    return false
  }

  const updatedExercises = exercises.filter((exercise) => exercise.id !== id)
  setItem(STORAGE_KEYS.EXERCISES, updatedExercises)

  return true
}

/**
 * Get all unique muscle groups
 */
export function getAllMuscleGroups(): MuscleGroup[] {
  const exercises = getExercises()
  const muscleGroupsSet = new Set<MuscleGroup>()

  exercises.forEach((exercise) => {
    exercise.muscleGroups.forEach((mg) => muscleGroupsSet.add(mg))
  })

  return Array.from(muscleGroupsSet).sort()
}

/**
 * Get all unique equipment
 */
export function getAllEquipment(): string[] {
  const exercises = getExercises()
  const equipmentSet = new Set<string>()

  exercises.forEach((exercise) => {
    equipmentSet.add(exercise.equipment)
  })

  return Array.from(equipmentSet).sort()
}

/**
 * Reset exercises to seed data
 */
export function resetExercisesToSeed(): void {
  setItem(STORAGE_KEYS.EXERCISES, SEED_EXERCISES)
}
