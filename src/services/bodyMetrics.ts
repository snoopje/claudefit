/**
 * Body metrics service - manages body weight and measurements
 */

import type {
  BodyMetric,
  BodyMeasurements,
  WeightUnit,
  MeasurementUnit,
  UnitPreferences,
  WeightTrend,
  MeasurementTrend,
} from '../types'
import { STORAGE_KEYS } from '../types'
import { getItem, setItem } from './storage'
import { format, subDays, startOfWeek, startOfMonth, subMonths } from 'date-fns'

/**
 * Generate unique body metric ID
 */
function generateMetricId(): string {
  return `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all body metrics
 */
export function getBodyMetrics(): BodyMetric[] {
  const result = getItem<BodyMetric[]>(STORAGE_KEYS.BODY_METRICS)
  return result.success && result.data ? result.data : []
}

/**
 * Get body metric by ID
 */
export function getBodyMetricById(id: string): BodyMetric | undefined {
  const metrics = getBodyMetrics()
  return metrics.find((metric) => metric.id === id)
}

/**
 * Get body metrics by date range
 */
export function getBodyMetricsByDateRange(startDate: Date, endDate: Date): BodyMetric[] {
  const metrics = getBodyMetrics()
  return metrics.filter((metric) => {
    const metricDate = new Date(metric.date)
    return metricDate >= startDate && metricDate <= endDate
  })
}

/**
 * Get latest body metric
 */
export function getLatestBodyMetric(): BodyMetric | undefined {
  const metrics = getBodyMetrics()
  if (metrics.length === 0) return undefined

  return metrics
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

/**
 * Get latest weight
 */
export function getLatestWeight(): number | undefined {
  const latest = getLatestBodyMetric()
  return latest?.weight
}

/**
 * Get weight history
 */
export function getWeightHistory(days: number = 30): Array<{ date: string; weight: number }> {
  const metrics = getBodyMetrics()
  const cutoffDate = subDays(new Date(), days)

  return metrics
    .filter((metric) => metric.weight && new Date(metric.date) >= cutoffDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((metric) => ({
      date: metric.date,
      weight: metric.weight!,
    }))
}

/**
 * Get weight trend data for charts
 */
export function getWeightTrendData(period: 'week' | 'month' | '3months' | '6months' | 'year' = 'month'): WeightTrend[] {
  const metrics = getBodyMetrics()
  const now = new Date()

  let startDate: Date
  let dateFormat: string

  switch (period) {
    case 'week':
      startDate = subDays(now, 7)
      dateFormat = 'MMM dd'
      break
    case '3months':
      startDate = subMonths(now, 3)
      dateFormat = 'MMM dd'
      break
    case '6months':
      startDate = subMonths(now, 6)
      dateFormat = 'MMM dd'
      break
    case 'year':
      startDate = subMonths(now, 12)
      dateFormat = 'MMM'
      break
    case 'month':
    default:
      startDate = subMonths(now, 1)
      dateFormat = 'MMM dd'
      break
  }

  const filteredMetrics = metrics
    .filter((metric) => metric.weight && new Date(metric.date) >= startDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate moving average (7-day)
  const trendData: WeightTrend[] = []
  const windowSize = 7

  for (let i = 0; i < filteredMetrics.length; i++) {
    const metric = filteredMetrics[i]
    if (!metric.weight) continue

    // Calculate moving average
    let sum = 0
    let count = 0
    for (let j = Math.max(0, i - windowSize + 1); j <= Math.min(filteredMetrics.length - 1, i + windowSize - 1); j++) {
      if (filteredMetrics[j].weight) {
        sum += filteredMetrics[j].weight!
        count++
      }
    }

    trendData.push({
      date: format(new Date(metric.date), dateFormat),
      weight: metric.weight,
      movingAverage: count > 0 ? Math.round((sum / count) * 10) / 10 : undefined,
    })
  }

  return trendData
}

/**
 * Get measurement trend data
 */
export function getMeasurementTrendData(
  measurementType: keyof BodyMeasurements,
  period: 'week' | 'month' | '3months' | '6months' | 'year' = 'month'
): MeasurementTrend[] {
  const metrics = getBodyMetrics()
  const now = new Date()

  let startDate: Date
  let dateFormat: string

  switch (period) {
    case 'week':
      startDate = subDays(now, 7)
      dateFormat = 'MMM dd'
      break
    case '3months':
      startDate = subMonths(now, 3)
      dateFormat = 'MMM dd'
      break
    case '6months':
      startDate = subMonths(now, 6)
      dateFormat = 'MMM dd'
      break
    case 'year':
      startDate = subMonths(now, 12)
      dateFormat = 'MMM'
      break
    case 'month':
    default:
      startDate = subMonths(now, 1)
      dateFormat = 'MMM dd'
      break
  }

  return metrics
    .filter((metric) => {
      const metricDate = new Date(metric.date)
      return (
        metricDate >= startDate &&
        metric.measurements &&
        measurementType in metric.measurements &&
        metric.measurements[measurementType] !== undefined
      )
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((metric) => ({
      date: format(new Date(metric.date), dateFormat),
      value: metric.measurements![measurementType]!,
      type: measurementType,
    }))
}

/**
 * Get all measurements for a specific type
 */
export function getMeasurementHistory(
  measurementType: keyof BodyMeasurements,
  days: number = 30
): Array<{ date: string; value: number }> {
  const metrics = getBodyMetrics()
  const cutoffDate = subDays(new Date(), days)

  return metrics
    .filter(
      (metric) =>
        metric.measurements &&
        measurementType in metric.measurements &&
        metric.measurements[measurementType] !== undefined &&
        new Date(metric.date) >= cutoffDate
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((metric) => ({
      date: metric.date,
      value: metric.measurements![measurementType]!,
    }))
}

/**
 * Add body metric entry
 */
export function addBodyMetric(data: Omit<BodyMetric, 'id'>): BodyMetric {
  const metric: BodyMetric = {
    ...data,
    id: generateMetricId(),
  }

  const metrics = getBodyMetrics()
  const updatedMetrics = [...metrics, metric]
  setItem(STORAGE_KEYS.BODY_METRICS, updatedMetrics)

  return metric
}

/**
 * Update body metric
 */
export function updateBodyMetric(id: string, updates: Partial<BodyMetric>): BodyMetric | null {
  const metrics = getBodyMetrics()
  const index = metrics.findIndex((metric) => metric.id === id)

  if (index === -1) {
    return null
  }

  const updatedMetric = { ...metrics[index], ...updates }
  const updatedMetrics = [...metrics]
  updatedMetrics[index] = updatedMetric

  setItem(STORAGE_KEYS.BODY_METRICS, updatedMetrics)

  return updatedMetric
}

/**
 * Delete body metric
 */
export function deleteBodyMetric(id: string): boolean {
  const metrics = getBodyMetrics()
  const updatedMetrics = metrics.filter((metric) => metric.id !== id)

  if (updatedMetrics.length === metrics.length) {
    return false
  }

  setItem(STORAGE_KEYS.BODY_METRICS, updatedMetrics)
  return true
}

/**
 * Get unit preferences
 */
export function getUnitPreferences(): UnitPreferences {
  const result = getItem<any>(STORAGE_KEYS.SETTINGS)
  const settings = result.success && result.data ? result.data : null

  return {
    weight: settings?.units?.weight || settings?.weight || 'kg',
    measurement: settings?.units?.measurement || settings?.measurement || 'cm',
  }
}

/**
 * Convert weight between units
 */
export function convertWeight(weight: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return weight

  // Convert to kg first
  const inKg = from === 'lbs' ? weight / 2.20462 : weight

  // Convert to target
  return to === 'lbs' ? Math.round(inKg * 2.20462 * 10) / 10 : Math.round(inKg * 10) / 10
}

/**
 * Convert measurement between units
 */
export function convertMeasurement(
  measurement: number,
  from: MeasurementUnit,
  to: MeasurementUnit
): number {
  if (from === to) return measurement

  // Convert to cm first
  const inCm = from === 'in' ? measurement * 2.54 : measurement

  // Convert to target
  return to === 'in' ? Math.round((inCm / 2.54) * 10) / 10 : Math.round(inCm * 10) / 10
}

/**
 * Get weight change over period
 */
export function getWeightChange(days: number = 7): { change: number; percentage: number } | null {
  const history = getWeightHistory(days)

  if (history.length < 2) {
    return null
  }

  const start = history[0].weight
  const end = history[history.length - 1].weight
  const change = end - start
  const percentage = start !== 0 ? Math.round((change / start) * 1000) / 10 : 0

  return {
    change: Math.round(change * 10) / 10,
    percentage,
  }
}

/**
 * Get body weight statistics
 */
export function getWeightStatistics(): {
  current: number | undefined
  average: number
  min: number
  max: number
  trend: 'up' | 'down' | 'stable'
} {
  const history = getWeightHistory(30)

  if (history.length === 0) {
    return {
      current: undefined,
      average: 0,
      min: 0,
      max: 0,
      trend: 'stable',
    }
  }

  const weights = history.map((h) => h.weight)
  const current = weights[weights.length - 1]
  const average = weights.reduce((sum, w) => sum + w, 0) / weights.length
  const min = Math.min(...weights)
  const max = Math.max(...weights)

  // Determine trend based on first vs last half average
  const midPoint = Math.floor(weights.length / 2)
  const firstHalfAvg = weights.slice(0, midPoint).reduce((sum, w) => sum + w, 0) / midPoint
  const secondHalfAvg = weights.slice(midPoint).reduce((sum, w) => sum + w, 0) / (weights.length - midPoint)

  const threshold = 0.5 // Weight change threshold in kg
  let trend: 'up' | 'down' | 'stable' = 'stable'

  if (secondHalfAvg - firstHalfAvg > threshold) {
    trend = 'up'
  } else if (firstHalfAvg - secondHalfAvg > threshold) {
    trend = 'down'
  }

  return {
    current,
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    trend,
  }
}

/**
 * Get measurement statistics
 */
export function getMeasurementStats(measurementType: keyof BodyMeasurements): {
  current: number | undefined
  average: number
  min: number
  max: number
} {
  const history = getMeasurementHistory(measurementType, 30)

  if (history.length === 0) {
    return {
      current: undefined,
      average: 0,
      min: 0,
      max: 0,
    }
  }

  const values = history.map((h) => h.value)
  const current = values[values.length - 1]
  const average = values.reduce((sum, v) => sum + v, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)

  return {
    current,
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
  }
}

/**
 * Get all available measurement types that have data
 */
export function getAvailableMeasurementTypes(): (keyof BodyMeasurements)[] {
  const metrics = getBodyMetrics()
  const types = new Set<keyof BodyMeasurements>()

  metrics.forEach((metric) => {
    if (metric.measurements) {
      Object.keys(metric.measurements).forEach((key) => {
        types.add(key as keyof BodyMeasurements)
      })
    }
  })

  return Array.from(types)
}

/**
 * Get BMI calculation (if height is available)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) {
    return { category: 'Underweight', color: '#3b82f6' }
  } else if (bmi < 25) {
    return { category: 'Normal', color: '#10b981' }
  } else if (bmi < 30) {
    return { category: 'Overweight', color: '#f59e0b' }
  } else {
    return { category: 'Obese', color: '#ef4444' }
  }
}
