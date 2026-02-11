/**
 * ProgressBar component - Dark Industrial styling
 * Sharp corners, lime accent fill
 */

import { HTMLAttributes } from 'react'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'lime' | 'ember' | 'muted'
  showLabel?: boolean
  label?: string
  animated?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'lime',
  showLabel = false,
  label,
  animated = false,
  className = '',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const variantStyles = {
    lime: 'bg-lime',
    ember: 'bg-ember',
    muted: 'bg-text-secondary',
  }

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center justify-between mb-1">
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            {label}
          </span>
        )}
        {showLabel && (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div
        className={`w-full bg-surface-elevated rounded-none overflow-hidden ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full ${variantStyles[variant]} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Circular progress indicator
 */
export interface CircularProgressProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  variant?: 'lime' | 'ember' | 'muted'
  showLabel?: boolean
  className?: string
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'lime',
  showLabel = true,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const variantStyles = {
    lime: '#c8ff00',
    ember: '#ff4d00',
    muted: '#666666',
  }

  const color = variantStyles[variant]

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0e0e0e"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="square"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl text-foreground">
            {Math.round(percentage)}
          </span>
        </div>
      )}
    </div>
  )
}
