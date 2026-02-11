/**
 * Goals service - manages fitness goals and progress tracking
 */

import type { Goal, GoalCategory, GoalPeriod, GoalStatus, GoalProgress, GoalTemplate } from '../types'
import { STORAGE_KEYS } from '../types'
import { getItem, setItem, removeItem } from './storage'
import { getWorkouts, getWorkoutsByDateRange } from './workouts'
import { getTodaysMeals, getDailyNutritionSummary } from './nutrition'
import { getLatestWeight } from './bodyMetrics'
import { getPersonalRecords } from './workouts'
import { format, startOfDay, endOfDay, differenceInDays, isAfter, isBefore } from 'date-fns'

/**
 * Generate unique goal ID
 */
function generateGoalId(): string {
  return `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Goal templates for quick creation
 */
export const GOAL_TEMPLATES: Omit<GoalTemplate, 'id'>[] = [
  {
    name: 'Workout 3 times per week',
    description: 'Complete 3 workouts every week',
    category: 'workouts-per-week',
    period: 'weekly',
    defaultTarget: 3,
    unit: 'workouts',
    suggestedDuration: 90,
  },
  {
    name: 'Workout 5 times per week',
    description: 'Complete 5 workouts every week',
    category: 'workouts-per-week',
    period: 'weekly',
    defaultTarget: 5,
    unit: 'workouts',
    suggestedDuration: 90,
  },
  {
    name: 'Monthly workout goal',
    description: 'Complete 12 workouts this month',
    category: 'workouts-per-month',
    period: 'monthly',
    defaultTarget: 12,
    unit: 'workouts',
    suggestedDuration: 30,
  },
  {
    name: 'Stay under calorie limit',
    description: 'Don\'t exceed daily calorie target',
    category: 'calories-per-day',
    period: 'daily',
    defaultTarget: 2000,
    unit: 'calories',
    suggestedDuration: 30,
  },
  {
    name: 'Hit protein target',
    description: 'Meet daily protein goal every day',
    category: 'protein-per-day',
    period: 'daily',
    defaultTarget: 150,
    unit: 'g',
    suggestedDuration: 30,
  },
  {
    name: 'Lose weight',
    description: 'Reach target body weight',
    category: 'bodyweight',
    period: 'one-time',
    defaultTarget: 75,
    unit: 'kg',
    suggestedDuration: 90,
  },
  {
    name: 'Gain weight',
    description: 'Reach target body weight',
    category: 'bodyweight',
    period: 'one-time',
    defaultTarget: 85,
    unit: 'kg',
    suggestedDuration: 90,
  },
]

/**
 * Get all goals
 */
export function getGoals(): Goal[] {
  const result = getItem<Goal[]>(STORAGE_KEYS.GOALS)
  return result.success && result.data ? result.data : []
}

/**
 * Get goal by ID
 */
export function getGoalById(id: string): Goal | undefined {
  const goals = getGoals()
  return goals.find((goal) => goal.id === id)
}

/**
 * Get active goals
 */
export function getActiveGoals(): Goal[] {
  const goals = getGoals()
  const now = new Date()

  return goals.filter(
    (goal) =>
      (goal.status === 'active' || goal.status === 'in-progress') &&
      new Date(goal.startDate) <= now &&
      new Date(goal.endDate) >= now
  )
}

/**
 * Get goals by category
 */
export function getGoalsByCategory(category: GoalCategory): Goal[] {
  const goals = getGoals()
  return goals.filter((goal) => goal.category === category)
}

/**
 * Search goals
 */
export function searchGoals(query: string): Goal[] {
  const goals = getGoals()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) {
    return goals
  }

  return goals.filter(
    (goal) =>
      goal.name.toLowerCase().includes(searchTerm) ||
      goal.description?.toLowerCase().includes(searchTerm)
  )
}

/**
 * Create new goal
 */
export function createGoal(data: Omit<Goal, 'id' | 'status' | 'createdAt' | 'currentValue' | 'progressHistory'>): Goal {
  const now = new Date().toISOString()

  const goal: Goal = {
    ...data,
    id: generateGoalId(),
    status: 'active',
    createdAt: now,
    currentValue: 0,
    progressHistory: [],
  }

  const goals = getGoals()
  const updatedGoals = [...goals, goal]
  setItem(STORAGE_KEYS.GOALS, updatedGoals)

  return goal
}

/**
 * Update goal
 */
export function updateGoal(id: string, updates: Partial<Goal>): Goal | null {
  const goals = getGoals()
  const index = goals.findIndex((goal) => goal.id === id)

  if (index === -1) {
    return null
  }

  const updatedGoal = { ...goals[index], ...updates }
  const updatedGoals = [...goals]
  updatedGoals[index] = updatedGoal

  setItem(STORAGE_KEYS.GOALS, updatedGoals)

  return updatedGoal
}

/**
 * Delete goal
 */
export function deleteGoal(id: string): boolean {
  const goals = getGoals()
  const updatedGoals = goals.filter((goal) => goal.id !== id)

  if (updatedGoals.length === goals.length) {
    return false
  }

  setItem(STORAGE_KEYS.GOALS, updatedGoals)
  return true
}

/**
 * Complete goal
 */
export function completeGoal(id: string): Goal | null {
  const goal = getGoalById(id)
  if (!goal) return null

  return updateGoal(id, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  })
}

/**
 * Mark goal as missed
 */
export function missGoal(id: string): Goal | null {
  const goal = getGoalById(id)
  if (!goal) return null

  return updateGoal(id, { status: 'missed' })
}

/**
 * Pause goal
 */
export function pauseGoal(id: string): Goal | null {
  const goal = getGoalById(id)
  if (!goal) return null

  return updateGoal(id, { status: 'paused' })
}

/**
 * Resume goal
 */
export function resumeGoal(id: string): Goal | null {
  const goal = getGoalById(id)
  if (!goal) return null

  return updateGoal(id, { status: 'active' })
}

/**
 * Calculate goal progress
 */
export function calculateGoalProgress(goal: Goal): GoalProgress {
  const now = new Date()
  const endDate = new Date(goal.endDate)
  const startDate = new Date(goal.startDate)

  // Calculate days remaining
  const daysRemaining = Math.max(0, differenceInDays(endDate, now))

  // Calculate current value based on goal type
  let currentValue = goal.currentValue

  switch (goal.category) {
    case 'workouts-per-week':
      currentValue = calculateWeeklyWorkouts(goal.startDate, goal.endDate)
      break
    case 'workouts-per-month':
      currentValue = calculateMonthlyWorkouts(goal.startDate, goal.endDate)
      break
    case 'calories-per-day':
      currentValue = calculateDailyCalories()
      break
    case 'protein-per-day':
      currentValue = calculateDailyProtein()
      break
    case 'bodyweight':
      currentValue = calculateBodyweight()
      break
    default:
      // For custom goals, use stored value
      break
  }

  // Update goal with current value
  if (currentValue !== goal.currentValue) {
    updateGoal(goal.id, { currentValue })
  }

  // Calculate percentage
  const percentage = Math.min(100, Math.round((currentValue / goal.targetValue) * 100))

  // Calculate remaining
  const remaining = Math.max(0, goal.targetValue - currentValue)

  // Check if complete
  const isComplete = currentValue >= goal.targetValue

  // Check if on track (based on time elapsed vs progress)
  const totalDuration = differenceInDays(endDate, startDate)
  const timeElapsed = differenceInDays(now, startDate)
  const expectedProgress = totalDuration > 0 ? (timeElapsed / totalDuration) * 100 : 0
  const isOnTrack = percentage >= expectedProgress * 0.8 // Allow 20% variance

  return {
    percentage,
    remaining,
    isComplete,
    isOnTrack,
    daysRemaining,
  }
}

/**
 * Calculate weekly workouts
 */
function calculateWeeklyWorkouts(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()

  // Get the current week within the goal period
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  const workouts = getWorkoutsByDateRange(
    weekStart < start ? start : weekStart,
    weekEnd > end ? end : weekEnd
  )

  return workouts.filter((w) => w.status === 'completed').length
}

/**
 * Calculate monthly workouts
 */
function calculateMonthlyWorkouts(startDate: string, endDate: string): number {
  const start = startOfDay(new Date(startDate))
  const end = endOfDay(new Date(endDate))
  const now = new Date()

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const adjustedStart = monthStart < start ? start : monthStart
  const adjustedEnd = monthEnd > end ? end : monthEnd

  const workouts = getWorkoutsByDateRange(adjustedStart, adjustedEnd)

  return workouts.filter((w) => w.status === 'completed').length
}

/**
 * Calculate today's calorie percentage vs target
 */
function calculateDailyCalories(): number {
  const summary = getDailyNutritionSummary()
  const targets = summary.target

  // Return the percentage of target consumed
  return targets.dailyCalories > 0
    ? Math.round((summary.totalCalories / targets.dailyCalories) * 100)
    : 0
}

/**
 * Calculate today's protein percentage vs target
 */
function calculateDailyProtein(): number {
  const summary = getDailyNutritionSummary()
  const targets = summary.target

  return targets.protein > 0
    ? Math.round((summary.totalProtein / targets.protein) * 100)
    : 0
}

/**
 * Calculate current bodyweight
 */
function calculateBodyweight(): number {
  const weight = getLatestWeight()
  return weight || 0
}

/**
 * Update all goals (should be called periodically)
 */
export function updateAllGoals(): void {
  const activeGoals = getActiveGoals()

  activeGoals.forEach((goal) => {
    const progress = calculateGoalProgress(goal)

    // Auto-complete if target reached
    if (progress.isComplete && goal.status !== 'completed') {
      completeGoal(goal.id)
    }

    // Add progress snapshot
    const today = format(new Date(), 'yyyy-MM-dd')
    const lastSnapshot = goal.progressHistory?.[goal.progressHistory.length - 1]

    if (!lastSnapshot || lastSnapshot.date !== today) {
      const updatedHistory = [
        ...(goal.progressHistory || []),
        { date: today, value: goal.currentValue },
      ].slice(-30) // Keep last 30 snapshots

      updateGoal(goal.id, { progressHistory: updatedHistory })
    }
  })

  // Check for missed goals
  const now = new Date()
  const goals = getGoals()

  goals.forEach((goal) => {
    if (
      (goal.status === 'active' || goal.status === 'in-progress') &&
      isAfter(now, new Date(goal.endDate)) &&
      !calculateGoalProgress(goal).isComplete
    ) {
      updateGoal(goal.id, { status: 'missed' })
    }
  })
}

/**
 * Get goal templates
 */
export function getGoalTemplates(): GoalTemplate[] {
  return GOAL_TEMPLATES.map((template, index) => ({
    ...template,
    id: `template-${index}`,
  }))
}

/**
 * Create goal from template
 */
export function createGoalFromTemplate(
  templateId: string,
  startDate?: Date,
  customTarget?: number
): Goal | null {
  const templates = getGoalTemplates()
  const template = templates.find((t) => t.id === templateId)

  if (!template) return null

  const start = startDate || new Date()
  const end = new Date(start)
  end.setDate(end.getDate() + (template.suggestedDuration || 30))

  return createGoal({
    name: template.name,
    description: template.description,
    category: template.category,
    period: template.period,
    targetValue: customTarget || template.defaultTarget,
    unit: template.unit,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    remindersEnabled: true,
  })
}

/**
 * Get goal statistics
 */
export function getGoalStatistics(): {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  missedGoals: number
  pausedGoals: number
  completionRate: number
} {
  const goals = getGoals()

  const active = goals.filter((g) => g.status === 'active' || g.status === 'in-progress').length
  const completed = goals.filter((g) => g.status === 'completed').length
  const missed = goals.filter((g) => g.status === 'missed').length
  const paused = goals.filter((g) => g.status === 'paused').length

  const finished = completed + missed
  const completionRate = finished > 0 ? Math.round((completed / finished) * 100) : 0

  return {
    totalGoals: goals.length,
    activeGoals: active,
    completedGoals: completed,
    missedGoals: missed,
    pausedGoals: paused,
    completionRate,
  }
}

/**
 * Get goals expiring soon
 */
export function getExpiringGoals(days: number = 7): Goal[] {
  const activeGoals = getActiveGoals()
  const now = new Date()
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + days)

  return activeGoals.filter((goal) => {
    const endDate = new Date(goal.endDate)
    return endDate <= expiryDate && endDate >= now
  })
}

/**
 * Get overdue goals
 */
export function getOverdueGoals(): Goal[] {
  const goals = getGoals()
  const now = new Date()

  return goals.filter(
    (goal) =>
      (goal.status === 'active' || goal.status === 'in-progress') &&
      isAfter(now, new Date(goal.endDate))
  )
}

// Helper imports
import { startOfWeek, endOfWeek } from 'date-fns'
