/**
 * Workout History Page - List with filters, detail view, delete
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout, PageSection, AmbientGlow } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal, ConfirmDialog } from '../../components/ui/Modal'
import { useWorkouts } from '../../hooks/useWorkouts'
import { useExercises } from '../../hooks/useExercises'
import type { Workout, WorkoutFilters } from '../../types'
import { format, startOfDay, endOfDay, subDays, subMonths } from 'date-fns'

export function WorkoutHistoryPage() {
  const navigate = useNavigate()
  const { workouts, remove } = useWorkouts()
  const { exercises } = useExercises()

  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all-time')

  useEffect(() => {
    applyFilters()
  }, [workouts, searchTerm, typeFilter, dateFilter])

  const applyFilters = useCallback(() => {
    let filtered = [...workouts].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((workout) =>
        workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((workout) => workout.type === typeFilter)
    }

    // Date filter
    const now = new Date()
    if (dateFilter === 'today') {
      filtered = filtered.filter((w) => {
        const date = new Date(w.date)
        return date >= startOfDay(now) && date <= endOfDay(now)
      })
    } else if (dateFilter === 'last-7-days') {
      filtered = filtered.filter((w) => {
        const date = new Date(w.date)
        return date >= subDays(now, 7)
      })
    } else if (dateFilter === 'last-30-days') {
      filtered = filtered.filter((w) => {
        const date = new Date(w.date)
        return date >= subDays(now, 30)
      })
    } else if (dateFilter === 'last-90-days') {
      filtered = filtered.filter((w) => {
        const date = new Date(w.date)
        return date >= subDays(now, 90)
      })
    } else if (dateFilter === 'this-month') {
      filtered = filtered.filter((w) => {
        const date = new Date(w.date)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
    } else if (dateFilter === 'this-year') {
      filtered = filtered.filter((w) => {
        const date = new Date(w.date)
        return date.getFullYear() === now.getFullYear()
      })
    }

    setFilteredWorkouts(filtered)
  }, [workouts, searchTerm, typeFilter, dateFilter])

  const handleViewWorkout = (workout: Workout) => {
    setSelectedWorkout(workout)
    setShowDetailModal(true)
  }

  const handleDeleteClick = (workoutId: string) => {
    setWorkoutToDelete(workoutId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (workoutToDelete) {
      remove(workoutToDelete)
      setShowDeleteConfirm(false)
      setWorkoutToDelete(null)
      setShowDetailModal(false)
    }
  }

  const workoutTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'mixed', label: 'Mixed' },
  ]

  const dateRanges = [
    { value: 'all-time', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'this-month', label: 'This Month' },
    { value: 'this-year', label: 'This Year' },
  ]

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Workout History"
        subtitle={filteredWorkouts.length > 0 ? `${filteredWorkouts.length} workouts` : 'No workouts found'}
      >
        {/* Filters */}
        <PageSection>
          <Card variant="elevated" padding="md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={workoutTypes}
              />
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                options={dateRanges}
              />
            </div>
          </Card>
        </PageSection>

        {/* Workout List */}
        <PageSection>
          {filteredWorkouts.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center py-12">
              <div className="text-text-dim mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="font-display text-xl">No workouts found</p>
                <p className="font-mono text-sm mt-2">Try adjusting your filters or start a new workout</p>
              </div>
              <Button onClick={() => navigate('/workouts')}>Start Workout</Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredWorkouts.map((workout) => (
                <WorkoutListItem
                  key={workout.id}
                  workout={workout}
                  onView={handleViewWorkout}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </PageSection>
      </MainLayout>

      {/* Workout Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedWorkout?.name || 'Workout Details'}
        size="lg"
      >
        {selectedWorkout && <WorkoutDetail workout={selectedWorkout} exercises={exercises} />}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setWorkoutToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}

function WorkoutListItem({
  workout,
  onView,
  onDelete,
}: {
  workout: Workout
  onView: (workout: Workout) => void
  onDelete: (workoutId: string) => void
}) {
  const date = new Date(workout.date)
  const formattedDate = format(date, 'MMM dd, yyyy')

  return (
    <Card variant="bordered" hover padding="md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display text-lg text-foreground">
              {workout.name || workout.type}
            </h3>
            <Badge size="sm" variant="muted">
              {workout.type}
            </Badge>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            <span>{formattedDate}</span>
            <span>{workout.duration} min</span>
            <span>{workout.exercises.length} exercises</span>
            {workout.totalVolume && (
              <span className="text-lime">{workout.totalVolume.toLocaleString()} kg</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onView(workout)}>
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(workout.id)}
            className="text-red-600 hover:text-red-500"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}

function WorkoutDetail({ workout, exercises }: { workout: Workout; exercises: any[] }) {
  const date = new Date(workout.date)
  const formattedDate = format(date, 'MMM dd, yyyy')
  const formattedTime = workout.startTime ? format(new Date(workout.startTime), 'h:mm a') : ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="lime">{workout.type}</Badge>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
              {formattedDate} at {formattedTime}
            </span>
          </div>
          <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
            {workout.name || 'Workout'}
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatItem label="Duration" value={`${workout.duration} min`} />
        <StatItem label="Exercises" value={workout.exercises.length.toString()} />
        <StatItem label="Total Sets" value={workout.totalSets?.toString() || '--'} />
        <StatItem label="Volume" value={`${workout.totalVolume?.toLocaleString() || '--'} kg`} color="lime" />
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
          / Exercises
        </h3>

        {workout.exercises.map((workoutExercise, index) => {
          const exercise = exercises.find((e) => e.id === workoutExercise.exerciseId)

          return (
            <Card key={index} variant="bordered" padding="sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display text-base text-foreground">
                  {exercise?.name || 'Unknown Exercise'}
                </h4>
                {exercise?.muscleGroups && (
                  <div className="flex gap-1">
                    {exercise.muscleGroups.slice(0, 2).map((mg) => (
                      <Badge key={mg} size="sm" variant="muted">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-elevated">
                    <th className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim text-left py-1">
                      Set
                    </th>
                    <th className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim text-left py-1">
                      KG
                    </th>
                    <th className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim text-left py-1">
                      Reps
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workoutExercise.sets.map((set, setIndex) => (
                    <tr key={setIndex} className="border-b border-surface-elevated/50">
                      <td className="py-1 font-mono text-xs text-text-secondary">
                        {setIndex + 1}
                      </td>
                      <td className="py-1 font-mono text-xs text-foreground">
                        {set.weight || '--'}
                      </td>
                      <td className="py-1 font-mono text-xs text-foreground">
                        {set.reps || '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {workoutExercise.notes && (
                <p className="font-mono text-[10px] text-text-dim mt-2">
                  Note: {workoutExercise.notes}
                </p>
              )}
            </Card>
          )
        })}
      </div>

      {/* Notes */}
      {workout.notes && (
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary mb-2">
            / Notes
          </h3>
          <p className="text-text-dim font-mono text-sm">{workout.notes}</p>
        </div>
      )}
    </div>
  )
}

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim mb-1">
        {label}
      </div>
      <div className={`font-display text-lg ${color === 'lime' ? 'text-lime' : 'text-foreground'}`}>
        {value}
      </div>
    </div>
  )
}
