/**
 * Body measurement entry
 */
export interface BodyMetric {
  id: string
  date: string // ISO date string
  weight?: number // in user's preferred unit
  measurements?: BodyMeasurements
  notes?: string
  bodyFatPercentage?: number
}

/**
 * Body measurements in cm or inches
 */
export interface BodyMeasurements {
  chest?: number
  waist?: number
  hips?: number
  leftArm?: number
  rightArm?: number
  leftThigh?: number
  rightThigh?: number
  neck?: number
  shoulders?: number
  calves?: number
}

/**
 * Weight unit preference
 */
export type WeightUnit = 'kg' | 'lbs'

/**
 * Measurement unit preference
 */
export type MeasurementUnit = 'cm' | 'in'

/**
 * Unit preferences
 */
export interface UnitPreferences {
  weight: WeightUnit
  measurement: MeasurementUnit
}

/**
 * Weight trend data point
 */
export interface WeightTrend {
  date: string
  weight: number
  movingAverage?: number
}

/**
 * Measurement trend data point
 */
export interface MeasurementTrend {
  date: string
  value: number
  type: keyof BodyMeasurements
}
