/**
 * RestTimer component - Countdown timer for rest periods
 * Dark Industrial styling with circular progress
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from './Button'
import { CircularProgress } from './ProgressBar'

export interface RestTimerProps {
  duration: number // in seconds
  onComplete?: () => void
  onCancel?: () => void
  autoStart?: boolean
  showControls?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RestTimer({
  duration,
  onComplete,
  onCancel,
  autoStart = true,
  showControls = true,
  size = 'md',
}: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  }

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, timeLeft, onComplete])

  const handleStart = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const handlePause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    setIsPaused(false)
  }, [])

  const handleReset = useCallback(() => {
    setTimeLeft(duration)
    setIsRunning(false)
    setIsPaused(false)
  }, [duration])

  const handleCancel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onCancel?.()
  }, [onCancel])

  const percentage = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center gap-4">
      <CircularProgress
        value={percentage}
        size={sizeMap[size]}
        variant={timeLeft <= 5 ? 'ember' : 'lime'}
        showLabel={false}
      />

      <div className="text-center">
        <div className="font-display text-4xl md:text-5xl text-foreground">
          {timeDisplay}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mt-1">
          Rest Timer
        </div>
      </div>

      {showControls && (
        <div className="flex gap-2">
          {!isRunning ? (
            <Button size="sm" onClick={handleStart}>
              Start
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button size="sm" onClick={handleResume}>
                  Resume
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={handlePause}>
                  Pause
                </Button>
              )}
              <Button size="sm" variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Quick rest timer with preset durations
 */
export interface QuickRestTimerProps {
  onDurationSelect: (seconds: number) => void
  onCancel?: () => void
}

const PRESET_DURATIONS = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
]

export function QuickRestTimer({ onDurationSelect, onCancel }: QuickRestTimerProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-surface border border-surface-elevated rounded-none">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
        Select Rest Duration
      </div>

      <div className="grid grid-cols-5 gap-2 w-full">
        {PRESET_DURATIONS.map((preset) => (
          <Button
            key={preset.seconds}
            variant="secondary"
            size="md"
            onClick={() => onDurationSelect(preset.seconds)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {onCancel && (
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  )
}
