/**
 * Exercises Page - Pre-built exercises, categorized, search, custom exercises
 */

import { useState, useEffect, useCallback } from 'react'
import { MainLayout, PageSection, AmbientGlow } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Textarea'
import { ConfirmDialog } from '../../components/ui/Modal'
import { useExercises } from '../../hooks/useExercises'
import type { Exercise, MuscleGroup, ExerciseType } from '../../types'

const MUSCLE_GROUPS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Muscles' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
]

const EXERCISE_TYPES: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
]

export function ExercisesPage() {
  const { exercises, search, getByMuscleGroup, getByType, add, remove } = useExercises()

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null)

  // New exercise form
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscleGroups: [] as string[],
    equipment: '',
    type: 'strength' as ExerciseType,
  })

  useEffect(() => {
    applyFilters()
  }, [exercises, searchTerm, muscleFilter, typeFilter])

  const applyFilters = useCallback(() => {
    let filtered = [...exercises]

    // Search
    if (searchTerm) {
      filtered = search(searchTerm)
    }

    // Muscle group filter
    if (muscleFilter !== 'all') {
      filtered = getByMuscleGroup(muscleFilter as MuscleGroup)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = getByType(typeFilter as ExerciseType)
    }

    // Combine filters
    if (searchTerm && muscleFilter !== 'all') {
      const bySearch = search(searchTerm)
      const byMuscle = getByMuscleGroup(muscleFilter as MuscleGroup)
      filtered = bySearch.filter((e) => byMuscle.some((m) => m.id === e.id))
    }

    if (searchTerm && typeFilter !== 'all') {
      const bySearch = search(searchTerm)
      const byType = getByType(typeFilter as ExerciseType)
      filtered = bySearch.filter((e) => byType.some((t) => t.id === e.id))
    }

    if (muscleFilter !== 'all' && typeFilter !== 'all') {
      const byMuscle = getByMuscleGroup(muscleFilter as MuscleGroup)
      const byType = getByType(typeFilter as ExerciseType)
      filtered = byMuscle.filter((e) => byType.some((t) => t.id === e.id))
    }

    setFilteredExercises(filtered)
  }, [exercises, searchTerm, muscleFilter, typeFilter, search, getByMuscleGroup, getByType])

  const handleAddExercise = () => {
    if (!newExercise.name || newExercise.muscleGroups.length === 0) return

    add({
      ...newExercise,
      muscleGroups: newExercise.muscleGroups as MuscleGroup[],
    })

    // Reset form
    setNewExercise({
      name: '',
      muscleGroups: [],
      equipment: '',
      type: 'strength',
    })
    setShowAddModal(false)
  }

  const handleDeleteClick = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId)
    if (exercise?.isCustom) {
      setExerciseToDelete(exerciseId)
      setShowDeleteConfirm(true)
    }
  }

  const handleConfirmDelete = () => {
    if (exerciseToDelete) {
      remove(exerciseToDelete)
      setShowDeleteConfirm(false)
      setExerciseToDelete(null)
    }
  }

  const toggleMuscleGroup = (mg: string) => {
    setNewExercise((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(mg)
        ? prev.muscleGroups.filter((g) => g !== mg)
        : [...prev.muscleGroups, mg],
    }))
  }

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Exercise Library"
        subtitle={`${filteredExercises.length} exercises`}
      >
        {/* Search and Filters */}
        <PageSection>
          <Card variant="elevated" padding="md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={muscleFilter}
                onChange={(e) => setMuscleFilter(e.target.value)}
                options={MUSCLE_GROUPS}
              />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={EXERCISE_TYPES}
              />
            </div>
          </Card>
        </PageSection>

        {/* Exercise List */}
        <PageSection>
          {filteredExercises.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center py-12">
              <p className="font-display text-xl text-text-dim mb-4">No exercises found</p>
              <p className="font-mono text-sm text-text-dim">Try adjusting your filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </PageSection>

        {/* Add Exercise Button */}
        <Button
          className="fixed bottom-20 right-4 lg:right-8 z-30 shadow-lg"
          onClick={() => setShowAddModal(true)}
        >
          + Add Exercise
        </Button>
      </MainLayout>

      {/* Add Exercise Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Custom Exercise"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExercise} disabled={!newExercise.name || newExercise.muscleGroups.length === 0}>
              Add Exercise
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Exercise Name"
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            placeholder="e.g., Incline Dumbbell Press"
          />

          <Select
            label="Exercise Type"
            value={newExercise.type}
            onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value as ExerciseType })}
            options={[
              { value: 'strength', label: 'Strength' },
              { value: 'cardio', label: 'Cardio' },
              { value: 'flexibility', label: 'Flexibility' },
            ]}
          />

          <Input
            label="Equipment"
            value={newExercise.equipment}
            onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
            placeholder="e.g., Dumbbells, Barbell, Cable Machine"
          />

          <div>
            <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-secondary mb-2 block">
              Target Muscle Groups
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.filter((mg) => mg.value !== 'all').map((mg) => (
                <button
                  key={mg.value}
                  type="button"
                  onClick={() => toggleMuscleGroup(mg.value)}
                  className={`
                    px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none transition-colors
                    ${newExercise.muscleGroups.includes(mg.value)
                      ? 'bg-lime text-background'
                      : 'bg-surface-elevated text-text-secondary hover:text-foreground'
                    }
                  `}
                >
                  {mg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setExerciseToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Exercise"
        message="Are you sure you want to delete this exercise? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}

function ExerciseCard({ exercise, onDelete }: { exercise: Exercise; onDelete: (id: string) => void }) {
  return (
    <Card variant="elevated" hover padding="md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-display text-lg uppercase tracking-wide text-foreground mb-1">
            {exercise.name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            {exercise.equipment}
          </p>
        </div>
        {exercise.isCustom && (
          <button
            onClick={() => onDelete(exercise.id)}
            className="p-1 text-text-dim hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge size="sm" variant="muted">
          {exercise.type}
        </Badge>
        {exercise.muscleGroups.map((mg) => (
          <Badge key={mg} size="sm" variant="outline">
            {mg}
          </Badge>
        ))}
      </div>
    </Card>
  )
}
