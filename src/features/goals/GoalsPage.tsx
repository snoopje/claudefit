/**
 * Goals Page - Create goals, track progress, mark complete/missed
 */

import { useState, useEffect } from 'react'
import { MainLayout, PageSection, AmbientGlow, PageGrid } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { ConfirmDialog } from '../../components/ui/Modal'
import { useGoals } from '../../hooks/useGoals'
import { getGoalTemplates, createGoalFromTemplate } from '../../services/goals'
import { format, differenceInDays, isAfter, isBefore } from 'date-fns'

const GOAL_CATEGORIES = [
  { value: 'workouts-per-week', label: 'Workouts Per Week' },
  { value: 'workouts-per-month', label: 'Workouts Per Month' },
  { value: 'calories-per-day', label: 'Daily Calories' },
  { value: 'protein-per-day', label: 'Daily Protein' },
  { value: 'bodyweight', label: 'Target Bodyweight' },
  { value: 'custom', label: 'Custom Goal' },
]

export function GoalsPage() {
  const { goals, getActive, getTemplates, create, createFromTemplate, complete, miss, pause, resume, remove, statistics } = useGoals()

  const [filteredGoals, setFilteredGoals] = useState(goals)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'workouts-per-week' as const,
    targetValue: '',
    unit: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  })

  const stats = statistics()

  useEffect(() => {
    applyFilters()
  }, [goals, filter])

  const applyFilters = () => {
    let filtered = [...goals]

    if (filter === 'active') {
      filtered = filtered.filter((g) => g.status === 'active' || g.status === 'in-progress')
    } else if (filter === 'completed') {
      filtered = filtered.filter((g) => g.status === 'completed')
    }

    // Sort by end date
    filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

    setFilteredGoals(filtered)
  }

  const handleCreateGoal = () => {
    if (!formData.name || !formData.targetValue) return

    create({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      period: formData.category.includes('per-day') ? 'daily' : formData.category.includes('per-week') ? 'weekly' : 'monthly',
      targetValue: parseFloat(formData.targetValue),
      unit: formData.unit,
      startDate: formData.startDate,
      endDate: formData.endDate,
    })

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'workouts-per-week',
      targetValue: '',
      unit: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    })
    setShowCreateModal(false)
  }

  const handleCreateFromTemplate = (templateId: string) => {
    createFromTemplate(templateId)
    setShowTemplateModal(false)
  }

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      remove(goalToDelete)
      setShowDeleteConfirm(false)
      setGoalToDelete(null)
    }
  }

  const daysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    return differenceInDays(end, now)
  }

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Goals"
        subtitle={`${filteredGoals.length} goals`}
      >
        {/* Stats */}
        <PageSection>
          <PageGrid columns={4}>
            <StatCard label="Active Goals" value={stats.activeGoals.toString()} />
            <StatCard label="Completed" value={stats.completedGoals.toString()} color="lime" />
            <StatCard label="Missed" value={stats.missedGoals.toString()} color="ember" />
            <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
          </PageGrid>
        </PageSection>

        {/* Header with actions */}
        <PageSection>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
                  filter === 'all'
                    ? 'bg-lime text-background'
                    : 'bg-surface-elevated text-text-secondary'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
                  filter === 'active'
                    ? 'bg-lime text-background'
                    : 'bg-surface-elevated text-text-secondary'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
                  filter === 'completed'
                    ? 'bg-lime text-background'
                    : 'bg-surface-elevated text-text-secondary'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowTemplateModal(true)}>
                From Template
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                + Create Goal
              </Button>
            </div>
          </div>
        </PageSection>

        {/* Goals List */}
        <PageSection>
          {filteredGoals.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center py-12">
              <p className="font-display text-xl text-text-dim mb-4">No goals found</p>
              <p className="font-mono text-sm text-text-dim mb-4">Set a target to track your progress</p>
              <Button onClick={() => setShowTemplateModal(true)}>Create from Template</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGoals.map((goal: any) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={() => complete(goal.id)}
                  onMiss={() => miss(goal.id)}
                  onPause={() => pause(goal.id)}
                  onResume={() => resume(goal.id)}
                  onDelete={() => handleDeleteClick(goal.id)}
                  daysRemaining={daysRemaining(goal.endDate)}
                />
              ))}
            </div>
          )}
        </PageSection>
      </MainLayout>

      {/* Create Goal Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Goal"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGoal} disabled={!formData.name || !formData.targetValue}>
              Create Goal
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Goal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Complete 4 workouts this week"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            options={GOAL_CATEGORIES}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Value"
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              placeholder="e.g., 4"
            />
            <Input
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., workouts, kg, kcal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <Input
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add details about your goal..."
          />
        </div>
      </Modal>

      {/* Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Create from Template"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getTemplates().map((template: any) => (
            <Card
              key={template.id}
              variant="bordered"
              hover
              padding="md"
              className="cursor-pointer"
              onClick={() => handleCreateFromTemplate(template.id)}
            >
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground mb-1">
                {template.name}
              </h3>
              <p className="font-mono text-xs text-text-dim mb-2">
                {template.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge size="sm" variant="muted">
                  {template.category}
                </Badge>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                  {template.defaultTarget} {template.unit}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setGoalToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color?: 'lime' | 'ember' }) {
  const colorClass = color === 'lime' ? 'text-lime' : color === 'ember' ? 'text-ember' : 'text-foreground'

  return (
    <Card variant="elevated" padding="lg" className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
        {label}
      </div>
      <div className={`font-display text-3xl ${colorClass}`}>
        {value}
      </div>
    </Card>
  )
}

function GoalCard({
  goal,
  onComplete,
  onMiss,
  onPause,
  onResume,
  onDelete,
  daysRemaining,
}: any) {
  const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
  const isOverdue = new Date(goal.endDate) < new Date() && percentage < 100

  return (
    <Card variant={isOverdue ? 'bordered' : 'elevated'} padding="md" className={isOverdue ? 'border-red-600/30' : ''}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-base uppercase tracking-wide text-foreground">
              {goal.name}
            </h3>
            {goal.status === 'completed' && <Badge size="sm" variant="lime">Done</Badge>}
            {goal.status === 'missed' && <Badge size="sm" variant="ember">Missed</Badge>}
            {goal.status === 'paused' && <Badge size="sm" variant="muted">Paused</Badge>}
            {isOverdue && goal.status === 'active' && <Badge size="sm" variant="ember">Overdue</Badge>}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-xl text-lime">
            {percentage}%
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
            {daysRemaining >= 0 ? `${daysRemaining}d left` : 'Overdue'}
          </div>
        </div>
      </div>

      <ProgressBar value={percentage} max={100} variant={percentage >= 100 ? 'lime' : isOverdue ? 'ember' : 'muted'} />

      {goal.status === 'active' && (
        <div className="flex gap-2 mt-4">
          {percentage >= 100 ? (
            <Button size="sm" fullWidth onClick={onComplete}>
              Complete
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={onPause}>
                Pause
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onComplete(goal.id)} className="text-amber-500">
                Mark Done
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="text-red-600 hover:text-red-500 ml-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </>
          )}
        </div>
      )}

      {goal.status === 'paused' && (
        <div className="flex gap-2 mt-4">
          <Button size="sm" fullWidth onClick={onResume}>
            Resume
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600">
            Delete
          </Button>
        </div>
      )}

      {goal.status === 'completed' && (
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="ghost" fullWidth onClick={() => {
            // Reset to active
            onResume()
          }}>
            Create Again
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600">
            Delete
          </Button>
        </div>
      )}
    </Card>
  )
}
