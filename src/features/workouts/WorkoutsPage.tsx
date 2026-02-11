/**
 * Workouts Page - Start workout, active session with set logger, rest timer
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout, PageSection, AmbientGlow } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { RestTimer, QuickRestTimer } from '../../components/ui/RestTimer'
import { Select } from '../../components/ui/Select'
import { useActiveWorkout, useWorkouts } from '../../hooks/useWorkouts'
import { useExercises } from '../../hooks/useExercises'
import { useRoutines } from '../../hooks/useRoutines'
import type { WorkoutExercise, ExerciseSet } from '../../types'
import { format } from 'date-fns'

export function WorkoutsPage() {
  const navigate = useNavigate()
  const { session, isActive, start, update, completeSet, setRest, cancel } = useActiveWorkout()
  const { exercises } = useExercises()
  const { routines } = useRoutines()

  const [showStartModal, setShowStartModal] = useState(false)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [restDuration, setRestDuration] = useState(90)
  const [restTimeRemaining, setRestTimeRemaining] = useState(0)
  const [restEndTime, setRestEndTime] = useState<string | null>(null)

  // Check for active rest timer from session
  useEffect(() => {
    if (session?.restTimerEndTime) {
      const endTime = new Date(session.restTimerEndTime).getTime()
      const now = Date.now()

      if (endTime > now) {
        setRestTimeRemaining(Math.floor((endTime - now) / 1000))
        setRestEndTime(session.restTimerEndTime)
        setShowRestTimer(true)
      }
    }
  }, [session])

  // Rest timer countdown
  useEffect(() => {
    if (showRestTimer && restTimeRemaining > 0) {
      const interval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowRestTimer(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [showRestTimer, restTimeRemaining])

  const handleStartWorkout = (selectedExercises: WorkoutExercise[]) => {
    start(selectedExercises)
    setShowStartModal(false)
  }

  const handleCompleteSet = () => {
    completeSet()
  }

  const handleSetRest = (duration: number) => {
    setRestDuration(duration)
    setRestTimeRemaining(duration)
    setRestEndTime(new Date(Date.now() + duration * 1000).toISOString())
    setRest(duration)
    setShowRestTimer(true)
  }

  const handleSkipRest = () => {
    setShowRestTimer(false)
    setRestTimeRemaining(0)
  }

  const handleFinishWorkout = () => {
    finish()
    navigate('/workouts/history')
  }

  const handleCancelWorkout = () => {
    cancel()
    setShowRestTimer(false)
  }

  const finish = () => {
    cancel()
  }

  if (!isActive) {
    return (
      <>
        <AmbientGlow />
        <MainLayout
          title="Workouts"
          subtitle="Start a new training session"
        >
          <PageSection>
            <PageGrid columns={3}>
              <StartCard
                title="Quick Start"
                description="Start an empty workout"
                icon="plus"
                onClick={() => setShowStartModal(true)}
              />
              <StartCard
                title="From Routine"
                description="Use a saved routine"
                icon="routine"
                onClick={() => navigate('/routines')}
              />
              <StartCard
                title="History"
                description="View past workouts"
                icon="history"
                onClick={() => navigate('/workouts/history')}
              />
            </PageGrid>
          </PageSection>

          <StartWorkoutModal
            isOpen={showStartModal}
            onClose={() => setShowStartModal(false)}
            onStart={handleStartWorkout}
            exercises={exercises}
            routines={routines}
          />
        </MainLayout>
      </>
    )
  }

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Active Workout"
        subtitle={format(new Date(), 'MMM dd, yyyy')}
      >
        {/* Rest Timer Overlay */}
        {showRestTimer && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <Card padding="lg" className="max-w-sm w-full">
              <RestTimer
                duration={restDuration}
                onComplete={() => setShowRestTimer(false)}
                onCancel={handleSkipRest}
                autoStart={true}
                showControls={true}
              />
            </Card>
          </div>
        )}

        {/* Active Session */}
        <div className="space-y-4">
          {session?.exercises.map((exercise, exerciseIndex) => (
            <ExerciseCard
              key={exerciseIndex}
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              isCurrentExercise={exerciseIndex === session?.currentExerciseIndex}
              exercisesList={exercises}
              onUpdate={(updatedExercise) => {
                const updatedExercises = [...session.exercises]
                updatedExercises[exerciseIndex] = updatedExercise
                update({ exercises: updatedExercises })
              }}
              onSetRest={handleSetRest}
            />
          ))}

          {/* Workout Actions */}
          <Card padding="md" className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCancelWorkout}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleFinishWorkout}
            >
              Finish Workout
            </Button>
          </Card>
        </div>
      </MainLayout>
    </>
  )
}

function StartCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: string
  onClick: () => void
}) {
  return (
    <Card
      variant="elevated"
      hover
      padding="lg"
      className="cursor-pointer text-center"
      onClick={onClick}
    >
      <div className="w-12 h-12 bg-surface-elevated mx-auto mb-4 flex items-center justify-center">
        {icon === 'plus' && (
          <svg className="w-6 h-6 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
        {icon === 'routine' && (
          <svg className="w-6 h-6 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )}
        {icon === 'history' && (
          <svg className="w-6 h-6 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <h3 className="font-display text-xl uppercase tracking-wide text-foreground mb-2">
        {title}
      </h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
        {description}
      </p>
    </Card>
  )
}

function StartWorkoutModal({
  isOpen,
  onClose,
  onStart,
  exercises,
  routines,
}: any) {
  const [selectedTab, setSelectedTab] = useState<'exercises' | 'routines'>('exercises')
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [setsPerExercise, setSetsPerExercise] = useState('3')

  const muscleGroups = Array.from(new Set(exercises.flatMap((e: any) => e.muscleGroups)))

  const handleToggleExercise = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const handleStart = () => {
    const workoutExercises: WorkoutExercise[] = selectedExercises.map((exerciseId) => {
      const setsCount = parseInt(setsPerExercise) || 3
      return {
        exerciseId,
        sets: Array.from({ length: setsCount }, () => ({
          completed: false,
        })),
      }
    })

    onStart(workoutExercises)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Workout"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStart} disabled={selectedExercises.length === 0}>
            Start ({selectedExercises.length} exercises)
          </Button>
        </>
      }
    >
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
            selectedTab === 'exercises'
              ? 'bg-lime text-background'
              : 'bg-surface-elevated text-text-secondary'
          }`}
          onClick={() => setSelectedTab('exercises')}
        >
          Exercises
        </button>
        <button
          className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
            selectedTab === 'routines'
              ? 'bg-lime text-background'
              : 'bg-surface-elevated text-text-secondary'
          }`}
          onClick={() => setSelectedTab('routines')}
        >
          Routines
        </button>
      </div>

      <div className="mb-4">
        <Input
          label="Sets per exercise"
          type="number"
          value={setsPerExercise}
          onChange={(e) => setSetsPerExercise(e.target.value)}
          min="1"
          max="10"
        />
      </div>

      {selectedTab === 'exercises' && (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {muscleGroups.map((group: string) => (
            <div key={group}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
                / {group}
              </h4>
              {exercises
                .filter((e: any) => e.muscleGroups.includes(group))
                .map((exercise: any) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleToggleExercise(exercise.id)}
                    className={`w-full text-left px-3 py-2 rounded-none transition-colors ${
                      selectedExercises.includes(exercise.id)
                        ? 'bg-lime/10 text-lime'
                        : 'bg-surface hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="font-display text-sm">{exercise.name}</div>
                  </button>
                ))}
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'routines' && (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {routines.map((routine: any) => (
            <button
              key={routine.id}
              onClick={() => {
                const routineExercises = routine.exercises.map((e: any) => e.exerciseId)
                setSelectedExercises(routineExercises)
              }}
              className="w-full text-left px-3 py-2 bg-surface hover:bg-surface-elevated rounded-none transition-colors"
            >
              <div className="font-display text-sm">{routine.name}</div>
              <div className="font-mono text-[10px] text-text-dim">
                {routine.exercises.length} exercises
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}

function ExerciseCard({
  exercise,
  exerciseIndex,
  isCurrentExercise,
  exercisesList,
  onUpdate,
  onSetRest,
}: any) {
  const exerciseData = exercisesList.find((e: any) => e.id === exercise.exerciseId)

  if (!exerciseData) return null

  const handleSetChange = (setIndex: number, field: string, value: any) => {
    const updatedSets = [...exercise.sets]
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value }
    onUpdate({ ...exercise, sets: updatedSets })
  }

  const handleToggleComplete = (setIndex: number) => {
    const updatedSets = [...exercise.sets]
    updatedSets[setIndex] = { ...updatedSets[setIndex], completed: !updatedSets[setIndex].completed }
    onUpdate({ ...exercise, sets: updatedSets })
  }

  const handleAddSet = () => {
    const updatedSets = [...exercise.sets, { completed: false }]
    onUpdate({ ...exercise, sets: updatedSets })
  }

  const handleRemoveSet = () => {
    if (exercise.sets.length > 1) {
      const updatedSets = exercise.sets.slice(0, -1)
      onUpdate({ ...exercise, sets: updatedSets })
    }
  }

  const allCompleted = exercise.sets.every((set: ExerciseSet) => set.completed)
  const completedCount = exercise.sets.filter((set: ExerciseSet) => set.completed).length

  return (
    <Card
      variant={isCurrentExercise ? 'accent' : 'default'}
      padding="md"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl uppercase tracking-wide text-foreground">
            {exerciseData.name}
          </h3>
          <div className="flex gap-2 mt-1">
            {exerciseData.muscleGroups.map((mg: string) => (
              <Badge key={mg} size="sm" variant="muted">
                {mg}
              </Badge>
            ))}
          </div>
        </div>
        {allCompleted && (
          <Badge variant="lime">DONE</Badge>
        )}
      </div>

      {/* Sets Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-elevated">
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim text-left py-2">
                Set
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim text-left py-2">
                KG
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim text-left py-2">
                Reps
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim text-center py-2">
                Done
              </th>
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((set: ExerciseSet, setIndex: number) => (
              <tr key={setIndex} className="border-b border-surface-elevated/50">
                <td className="py-2 font-mono text-sm text-text-secondary">
                  {setIndex + 1}
                </td>
                <td className="py-2">
                  <Input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => handleSetChange(setIndex, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-20"
                    containerClassName="m-0"
                  />
                </td>
                <td className="py-2">
                  <Input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => handleSetChange(setIndex, 'reps', parseFloat(e.target.value) || 0)}
                    className="w-20"
                    containerClassName="m-0"
                  />
                </td>
                <td className="py-2 text-center">
                  <button
                    onClick={() => handleToggleComplete(setIndex)}
                    className={`w-6 h-6 rounded-none flex items-center justify-center transition-colors ${
                      set.completed
                        ? 'bg-lime text-background'
                        : 'bg-surface-elevated text-text-dim hover:text-foreground'
                    }`}
                  >
                    {set.completed && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Set Actions */}
      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="ghost" onClick={handleAddSet}>
          + Set
        </Button>
        <Button size="sm" variant="ghost" onClick={handleRemoveSet} disabled={exercise.sets.length <= 1}>
          - Set
        </Button>
        <div className="flex-1" />
        <Button size="sm" variant="secondary" onClick={() => onSetRest(90)}>
          Rest 90s
        </Button>
      </div>
    </Card>
  )
}

// Add PageGrid import
import { PageGrid } from '../../components/layout/MainLayout'
