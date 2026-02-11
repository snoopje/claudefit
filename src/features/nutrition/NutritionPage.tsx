/**
 * Nutrition Page - Log meals with macros, daily targets, summaries, quick-add
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
import { useNutrition, useTodaysNutrition, useQuickAddFoods } from '../../hooks/useNutrition'
import { MEAL_TYPE_LABELS } from '../../types'
import { format, isToday } from 'date-fns'

export function NutritionPage() {
  const {
    targets,
    updateTargets,
    getTodays,
    getSummary,
    add,
    update: updateMeal,
    remove,
    getProgress,
    getRemaining,
    getDistribution,
    getAverages,
  } = useNutrition()

  const { summary, refresh } = useTodaysNutrition()
  const { foods, quickAdd } = useQuickAddFoods()

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [showLogModal, setShowLogModal] = useState(false)
  const [showTargetsModal, setShowTargetsModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    mealType: 'snack' as const,
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  })

  const todaySummary = isToday(new Date(selectedDate))
    ? summary
    : getSummary(new Date(selectedDate))

  const progress = getProgress(new Date(selectedDate))
  const remaining = getRemaining(new Date(selectedDate))
  const distribution = getDistribution(new Date(selectedDate))
  const averages = getAverages()

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleLogMeal = () => {
    if (!formData.name || !formData.calories) return

    add({
      date: selectedDate,
      name: formData.name,
      mealType: formData.mealType,
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
    })

    // Reset form
    setFormData({
      name: '',
      mealType: 'snack',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    })
    setShowLogModal(false)
    refresh()
  }

  const handleQuickAdd = (foodId: string) => {
    quickAdd(foodId, isToday(new Date(selectedDate)) ? undefined : new Date(selectedDate))
    refresh()
  }

  const handleUpdateTargets = () => {
    updateTargets(targets)
    setShowTargetsModal(false)
  }

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Nutrition"
        subtitle="Track your daily intake"
      >
        {/* Date Selector */}
        <PageSection>
          <div className="flex items-center justify-between">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowTargetsModal(true)}>
                Set Targets
              </Button>
              <Button onClick={() => setShowLogModal(true)}>
                + Log Meal
              </Button>
            </div>
          </div>
        </PageSection>

        {/* Daily Summary */}
        <PageSection>
          <PageGrid columns={4}>
            <MacroCard
              label="Calories"
              current={todaySummary.totalCalories}
              target={targets.dailyCalories}
              remaining={remaining.calories}
              unit="kcal"
              color="lime"
            />
            <MacroCard
              label="Protein"
              current={todaySummary.totalProtein}
              target={targets.protein}
              remaining={remaining.protein}
              unit="g"
              color="ember"
            />
            <MacroCard
              label="Carbs"
              current={todaySummary.totalCarbs}
              target={targets.carbs}
              remaining={remaining.carbs}
              unit="g"
              color="text-secondary"
            />
            <MacroCard
              label="Fat"
              current={todaySummary.totalFat}
              target={targets.fat}
              remaining={remaining.fat}
              unit="g"
              color="text-secondary"
            />
          </PageGrid>
        </PageSection>

        <PageGrid columns={2}>
          {/* Progress Bars */}
          <PageSection label="Progress" title="Daily Targets">
            <div className="space-y-4">
              <ProgressBar
                value={progress.calories}
                max={targets.dailyCalories}
                label="Calories"
                variant={todaySummary.isWithinTarget ? 'lime' : 'ember'}
                showLabel
              />
              <ProgressBar
                value={progress.protein}
                max={targets.protein}
                label="Protein"
                variant="muted"
                showLabel
              />
              <ProgressBar
                value={progress.carbs}
                max={targets.carbs}
                label="Carbs"
                variant="muted"
                showLabel
              />
              <ProgressBar
                value={progress.fat}
                max={targets.fat}
                label="Fat"
                variant="muted"
                showLabel
              />
            </div>
          </PageSection>

          {/* Macro Distribution */}
          <PageSection label="Distribution" title="Macro Split">
            <div className="flex items-center justify-center">
              <MacroDistributionPie
                protein={distribution.protein}
                carbs={distribution.carbs}
                fat={distribution.fat}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <MacroSplitItem label="Protein" value={distribution.protein} color="bg-ember" />
              <MacroSplitItem label="Carbs" value={distribution.carbs} color="bg-blue-500" />
              <MacroSplitItem label="Fat" value={distribution.fat} color="bg-yellow-500" />
            </div>
          </PageSection>
        </PageGrid>

        {/* Today's Meals */}
        <PageSection label="Today" title="Meals Logged">
          {todaySummary.meals.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center py-8">
              <p className="font-mono text-sm text-text-dim mb-4">No meals logged today</p>
              <Button onClick={() => setShowLogModal(true)}>Log Your First Meal</Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {todaySummary.meals.map((meal) => (
                <MealItem key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </PageSection>

        {/* Quick Add */}
        <PageSection label="Quick Add" title="Common Foods">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {foods.slice(0, 8).map((food) => (
              <QuickAddFoodItem
                key={food.id}
                food={food}
                onAdd={() => handleQuickAdd(food.id)}
              />
            ))}
          </div>
        </PageSection>
      </MainLayout>

      {/* Log Meal Modal */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Meal"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowLogModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogMeal} disabled={!formData.name || !formData.calories}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Meal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Grilled Chicken Salad"
          />

          <Select
            label="Meal Type"
            value={formData.mealType}
            onChange={(e) => setFormData({ ...formData, mealType: e.target.value as any })}
            options={[
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'dinner', label: 'Dinner' },
              { value: 'snack', label: 'Snack' },
              { value: 'post-workout', label: 'Post-Workout' },
              { value: 'other', label: 'Other' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Calories"
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Protein (g)"
              type="number"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              placeholder="0"
            />
            <Input
              label="Fat (g)"
              type="number"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>
      </Modal>

      {/* Targets Modal */}
      <Modal
        isOpen={showTargetsModal}
        onClose={() => setShowTargetsModal(false)}
        title="Daily Nutrition Targets"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowTargetsModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTargets}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Daily Calories"
            type="number"
            value={targets.dailyCalories}
            onChange={(e) => updateTargets({ ...targets, dailyCalories: parseFloat(e.target.value) || 2000 })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Protein (g)"
              type="number"
              value={targets.protein}
              onChange={(e) => updateTargets({ ...targets, protein: parseFloat(e.target.value) || 150 })}
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={targets.carbs}
              onChange={(e) => updateTargets({ ...targets, carbs: parseFloat(e.target.value) || 200 })}
            />
            <Input
              label="Fat (g)"
              type="number"
              value={targets.fat}
              onChange={(e) => updateTargets({ ...targets, fat: parseFloat(e.target.value) || 65 })}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

function MacroCard({
  label,
  current,
  target,
  remaining,
  unit,
  color,
}: {
  label: string
  current: number
  target: number
  remaining: number
  unit: string
  color: string
}) {
  const percentage = Math.min(100, Math.round((current / target) * 100))
  const isOver = current > target

  return (
    <Card variant="elevated" padding="md" className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
        {label}
      </div>
      <div className="font-display text-2xl text-foreground mb-1">
        {current}
        <span className="text-sm text-text-dim">/{target}</span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim mb-2">
        {unit}
      </div>
      <ProgressBar value={percentage} max={100} variant={isOver ? 'ember' : color as any} />
      <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim mt-2">
        {remaining} {unit} left
      </div>
    </Card>
  )
}

function MealItem({ meal }: { meal: any }) {
  return (
    <Card variant="bordered" padding="sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-display text-base text-foreground">
              {meal.name}
            </h4>
            <Badge size="sm" variant="muted">
              {MEAL_TYPE_LABELS[meal.mealType]}
            </Badge>
          </div>
          <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            <span>{meal.calories} kcal</span>
            <span className="text-ember">{meal.protein}g P</span>
            <span>{meal.carbs}g C</span>
            <span>{meal.fat}g F</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function QuickAddFoodItem({ food, onAdd }: { food: any; onAdd: () => void }) {
  return (
    <Card
      variant="bordered"
      hover
      padding="sm"
      className="cursor-pointer"
      onClick={onAdd}
    >
      <div className="text-center">
        <div className="font-display text-sm text-foreground mb-1">
          {food.name}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
          {food.calories} kcal
        </div>
      </div>
    </Card>
  )
}

function MacroDistributionPie({
  protein,
  carbs,
  fat,
}: {
  protein: number
  carbs: number
  fat: number
}) {
  const total = protein + carbs + fat
  if (total === 0) return <div className="text-text-dim">No data</div>

  const proteinDeg = (protein / total) * 360
  const carbsDeg = (carbs / total) * 360
  const fatDeg = (fat / total) * 360

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* Protein */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#ff4d00"
          strokeWidth="20"
          strokeDasharray={`${proteinDeg * 2 * Math.PI * 40 / 360} ${2 * Math.PI * 40}`}
        />
        {/* Carbs */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="20"
          strokeDasharray={`${carbsDeg * 2 * Math.PI * 40 / 360} ${2 * Math.PI * 40}`}
          strokeDashoffset={-proteinDeg * 2 * Math.PI * 40 / 360}
        />
        {/* Fat */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#eab308"
          strokeWidth="20"
          strokeDasharray={`${fatDeg * 2 * Math.PI * 40 / 360} ${2 * Math.PI * 40}`}
          strokeDashoffset={-(proteinDeg + carbsDeg) * 2 * Math.PI * 40 / 360}
        />
      </svg>
    </div>
  )
}

function MacroSplitItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`w-3 h-3 ${color} mx-auto mb-1 rounded-full`} />
      <div className="font-display text-lg text-foreground">
        {value}%
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
        {label}
      </div>
    </div>
  )
}
