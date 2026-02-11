/**
 * Custom hook for managing body metrics
 */

import { useState, useEffect, useCallback } from 'react'
import type { BodyMetric, BodyMeasurements, WeightUnit, MeasurementUnit } from '../types'
import {
  getBodyMetrics,
  getBodyMetricById,
  getBodyMetricsByDateRange,
  getLatestBodyMetric,
  getLatestWeight,
  getWeightHistory,
  getWeightTrendData,
  getMeasurementTrendData,
  getMeasurementHistory,
  addBodyMetric,
  updateBodyMetric,
  deleteBodyMetric,
  getUnitPreferences,
  convertWeight,
  convertMeasurement,
  getWeightChange,
  getWeightStatistics,
  getMeasurementStats,
  getAvailableMeasurementTypes,
} from '../services/bodyMetrics'

export function useBodyMetrics() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setMetrics(getBodyMetrics())
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load body metrics')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    setMetrics(getBodyMetrics())
  }, [])

  const getById = useCallback((id: string) => getBodyMetricById(id), [])

  const getByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return getBodyMetricsByDateRange(startDate, endDate)
  }, [])

  const getLatest = useCallback(() => getLatestBodyMetric(), [])

  const add = useCallback((data: Omit<BodyMetric, 'id'>) => {
    const newMetric = addBodyMetric(data)
    refresh()
    return newMetric
  }, [refresh])

  const update = useCallback((id: string, updates: Partial<BodyMetric>) => {
    const updated = updateBodyMetric(id, updates)
    if (updated) {
      refresh()
    }
    return updated
  }, [refresh])

  const remove = useCallback((id: string) => {
    const success = deleteBodyMetric(id)
    if (success) {
      refresh()
    }
    return success
  }, [refresh])

  return {
    metrics,
    loading,
    error,
    refresh,
    getById,
    getByDateRange,
    getLatest,
    add,
    update,
    remove,
  }
}

/**
 * Hook for weight tracking
 */
export function useWeight() {
  const [weight, setWeight] = useState<number | undefined>(undefined)
  const [history, setHistory] = useState<Array<{ date: string; weight: number }>>([])
  const [trend, setTrend] = useState<Array<{ date: string; weight: number; movingAverage?: number }>>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setWeight(getLatestWeight())
    setHistory(getWeightHistory(30))
    setTrend(getWeightTrendData('month'))
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getChange = useCallback((days: number = 7) => {
    return getWeightChange(days)
  }, [])

  const getStats = useCallback(() => {
    return getWeightStatistics()
  }, [])

  return {
    weight,
    history,
    trend,
    loading,
    refresh,
    getChange,
    getStats,
  }
}

/**
 * Hook for body measurements
 */
export function useMeasurements(measurementType?: keyof BodyMeasurements) {
  const [history, setHistory] = useState<Array<{ date: string; value: number }>>([])
  const [trend, setTrend] = useState<Array<{ date: string; value: number; type: keyof BodyMeasurements }>>([])
  const [stats, setStats] = useState({
    current: undefined as number | undefined,
    average: 0,
    min: 0,
    max: 0,
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (measurementType) {
      setHistory(getMeasurementHistory(measurementType, 30))
      setTrend(getMeasurementTrendData(measurementType, 'month'))
      setStats(getMeasurementStats(measurementType))
    }
    setLoading(false)
  }, [measurementType])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    history,
    trend,
    stats,
    loading,
    refresh,
  }
}

/**
 * Hook for unit preferences
 */
export function useUnits() {
  const [preferences, setPreferences] = useState({
    weight: 'kg' as WeightUnit,
    measurement: 'cm' as MeasurementUnit,
  })

  useEffect(() => {
    setPreferences(getUnitPreferences())
  }, [])

  const convertWeightValue = useCallback((value: number, from: WeightUnit, to: WeightUnit) => {
    return convertWeight(value, from, to)
  }, [])

  const convertMeasurementValue = useCallback((value: number, from: MeasurementUnit, to: MeasurementUnit) => {
    return convertMeasurement(value, from, to)
  }, [])

  return {
    preferences,
    convertWeight: convertWeightValue,
    convertMeasurement: convertMeasurementValue,
  }
}

/**
 * Hook for available measurement types
 */
export function useAvailableMeasurements() {
  const [types, setTypes] = useState<(keyof BodyMeasurements)[]>([])

  useEffect(() => {
    setTypes(getAvailableMeasurementTypes())
  }, [])

  return types
}
