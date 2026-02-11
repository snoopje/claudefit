/**
 * Routines Page - Workout templates, create/edit/delete, start from routine
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout, PageSection, AmbientGlow } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Textarea'
import { ConfirmDialog } from '../../components/ui/Modal'
import { useRoutines } from '../../hooks/useRoutines'
import { useExercises } from '../../hooks/useExercises'
import type { Routine, RoutineExercise, Exercise } from '../../types'

const ROUTINE_TYPES = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'mixed', label: 'Mixed' },
]

export function RoutinesPage() {
  const navigate = useNavigate()
  const { routines, create, update, remove, toggleFavorite, duplicate, startWorkout } = useRoutines()
  const { exercises } = useExercises()

  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([])
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [routineToEdit, setRoutineToEdit] = useState<Routine | null>(null)
  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'strength' as Routine['type'],
    exercises: [] as RoutineExercise[],
  })

  useEffect(() => {
    applyFilters()
  }, [routines, filter])

  const applyFilters = useCallback(() => {
    let filtered = [...routines]

    if (filter === 'favorites') {
      filtered = filtered.filter((r) => r.isFavorite)
    }

    setFilteredRoutines(filtered)
  }, [routines, filter])

  const handleCreate = () => {
    if (!formData.name || formData.exercises.length === 0) return

    create(formData)

    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'strength',
      exercises: [],
    })
    setShowCreateModal(false)
  }

  const handleEdit = () => {
    if (!routineToEdit || !formData.name) return

    update(routineToEdit.id, formData)
    setShowEditModal(false)
    setRoutineToEdit(null)
  }

  const handleDeleteClick = (routineId: string) => {
    setRoutineToDelete(routineId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (routineToDelete) {
      remove(routineToDelete)
      setShowDeleteConfirm(false)
      setRoutineToDelete(null)
    }
  }

  const handleToggleFavorite = (routineId: string) => {
    toggleFavorite(routineId)
  }

  const handleDuplicate = (routineId: string) => {
    duplicate(routineId)
  }

  const handleStartWorkout = (routineId: string) => {
    startWorkout(routineId)
    navigate('/workouts')
  }

  const openEditModal = (routine: Routine) => {
    setRoutineToEdit(routine)
    setFormData({
      name: routine.name,
      description: routine.description || '',
      type: routine.type,
      exercises: routine.exercises,
    })
    setShowEditModal(true)
  }

  const addExerciseToForm = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        {
          exerciseId: '',
          defaultSets: 3,
          defaultReps: 10,
          defaultWeight: 0,
          restTime: 90,
        },
      ],
    })
  }

  const updateExerciseInForm = (index: number, updates: Partial<RoutineExercise>) => {
    const updatedExercises = [...formData.exercises]
    updatedExercises[index] = { ...updatedExercises[index], ...updates }
    setFormData({ ...formData, exercises: updatedExercises })
  }

  const removeExerciseFromForm = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    })
  }

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Routines"
        subtitle={`${filteredRoutines.length} templates`}
      >
        {/* Header with actions */}
        <PageSection>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
                  filter === 'all'
                    ? 'bg-lime text-background'
                    : 'bg-surface-elevated text-text-secondary hover:text-foreground'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
                  filter === 'favorites'
                    ? 'bg-lime text-background'
                    : 'bg-surface-elevated text-text-secondary hover:text-foreground'
                }`}
                onClick={() => setFilter('favorites')}
              >
                Favorites
              </button>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              + Create Routine
            </Button>
          </div>
        </PageSection>

        {/* Routines Grid */}
        <PageSection>
          {filteredRoutines.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center py-12">
              <p className="font-display text-xl text-text-dim mb-4">No routines found</p>
              <p className="font-mono text-sm text-text-dim mb-4">Create your first workout template</p>
              <Button onClick={() => setShowCreateModal(true)}>Create Routine</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  exercises={exercises}
                  onEdit={openEditModal}
                  onDelete={handleDeleteClick}
                  onFavorite={handleToggleFavorite}
                  onDuplicate={handleDuplicate}
                  onStart={handleStartWorkout}
                />
              ))}
            </div>
          )}
        </PageSection>
      </MainLayout>

      {/* Create Modal */}
      <RoutineFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreate}
        formData={formData}
        setFormData={setFormData}
        exercises={exercises}
        onAddExercise={addExerciseToForm}
        onUpdateExercise={updateExerciseInForm}
        onRemoveExercise={removeExerciseFromForm}
        title="Create Routine"
      />

      {/* Edit Modal */}
      <RoutineFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setRoutineToEdit(null)
        }}
        onSave={handleEdit}
        formData={formData}
        setFormData={setFormData}
        exercises={exercises}
        onAddExercise={addExerciseToForm}
        onUpdateExercise={updateExerciseInForm}
        onRemoveExercise={removeExerciseFromForm}
        title="Edit Routine"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setRoutineToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Routine"
        message="Are you sure you want to delete this routine? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}

function RoutineCard({
  routine,
  exercises,
  onEdit,
  onDelete,
  onFavorite,
  onDuplicate,
  onStart,
}: {
  routine: Routine
  exercises: Exercise[]
  onEdit: (routine: Routine) => void
  onDelete: (id: string) => void
  onFavorite: (id: string) => void
  onDuplicate: (id: string) => void
  onStart: (id: string) => void
}) {
  return (
    <Card variant="elevated" hover padding="md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-lg uppercase tracking-wide text-foreground">
              {routine.name}
            </h3>
            <button
              onClick={() => onFavorite(routine.id)}
              className={routine.isFavorite ? 'text-ember' : 'text-text-dim hover:text-ember'}
            >
              <svg className="w-4 h-4" fill={routine.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Badge size="sm" variant="muted">
              {routine.type}
            </Badge>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
              {routine.exercises.length} exercises
            </span>
            {routine.estimatedDuration && (
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                ~{routine.estimatedDuration} min
              </span>
            )}
          </div>
        </div>
      </div>

      {routine.description && (
        <p className="font-mono text-xs text-text-dim mb-4 line-clamp-2">
          {routine.description}
        </p>
      )}

      {/* Exercise preview */}
      <div className="mb-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-ghost mb-2">
          Exercises
        </div>
        <div className="flex flex-wrap gap-1">
          {routine.exercises.slice(0, 4).map((exercise, index) => {
            const exerciseData = exercises.find((e) => e.id === exercise.exerciseId)
            return (
              <span key={index} className="font-mono text-[9px] uppercase text-text-dim">
                {exerciseData?.name || 'Unknown'}
                {index < Math.min(routine.exercises.length - 1, 3) && ' / '}
              </span>
            )
          })}
          {routine.exercises.length > 4 && (
            <span className="font-mono text-[9px] uppercase text-lime">
              +{routine.exercises.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="primary" fullWidth onClick={() => onStart(routine.id)}>
          Start
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onEdit(routine)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDuplicate(routine.id)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(routine.id)}
          className="text-red-600 hover:text-red-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </Card>
  )
}

function RoutineFormModal({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  exercises,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  title,
}: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!formData.name || formData.exercises.length === 0}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <Input
          label="Routine Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Push Day A"
        />

        <Textarea
          label="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this routine..."
          rows={2}
        />

        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={ROUTINE_TYPES}
        />

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-secondary">
              Exercises
            </label>
            <Button size="sm" variant="ghost" onClick={onAddExercise}>
              + Add
            </Button>
          </div>

          <div className="space-y-3">
            {formData.exercises.map((exercise: RoutineExercise, index: number) => (
              <Card key={index} variant="bordered" padding="sm">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Select
                    label="Exercise"
                    value={exercise.exerciseId}
                    onChange={(e) => onUpdateExercise(index, { exerciseId: e.target.value })}
                    options={exercises.map((e: Exercise) => ({ value: e.id, label: e.name }))}
                    placeholder="Select exercise"
                  />
                  <Input
                    label="Sets"
                    type="number"
                    value={exercise.defaultSets.toString()}
                    onChange={(e) => onUpdateExercise(index, { defaultSets: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <Input
                    label="Reps"
                    type="number"
                    value={exercise.defaultReps?.toString() || ''}
                    onChange={(e) => onUpdateExercise(index, { defaultReps: parseInt(e.target.value) || undefined })}
                    placeholder="Optional"
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={exercise.defaultWeight?.toString() || ''}
                    onChange={(e) => onUpdateExercise(index, { defaultWeight: parseFloat(e.target.value) || undefined })}
                    placeholder="Optional"
                  />
                  <Input
                    label="Rest (sec)"
                    type="number"
                    value={exercise.restTime?.toString() || '90'}
                    onChange={(e) => onUpdateExercise(index, { restTime: parseInt(e.target.value) || 90 })}
                    min="0"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveExercise(index)}
                    className="text-red-600 hover:text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
