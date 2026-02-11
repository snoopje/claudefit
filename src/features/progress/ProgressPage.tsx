/**
 * Progress Page - Charts, PRs, volume summaries, frequency/streak tracking
 */

import { useState, useEffect } from 'react'
import { MainLayout, PageSection, AmbientGlow, PageGrid } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Select'
import { LineChart, MultiLineChart } from '../../components/charts/LineChart'
import { BarChart } from '../../components/charts/BarChart'
import { useWorkouts, usePersonalRecords, useWorkoutStats } from '../../hooks/useWorkouts'
import { useExercises } from '../../hooks/useExercises'
import { format, subDays, subMonths, startOfMonth } from 'date-fns'

const TIME_RANGES = [
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'Last Year' },
]

export function ProgressPage() {
  const { weeklyVolume, getRecent } = useWorkouts()
  const { records } = usePersonalRecords()
  const { stats, refresh: refreshStats } = useWorkoutStats()
  const { exercises } = useExercises()

  const [timeRange, setTimeRange] = useState('month')
  const [volumeData, setVolumeData] = useState(weeklyVolume(12))
  const [recentPRs, setRecentPRs] = useState(records.slice(0, 10))

  useEffect(() => {
    refreshStats()
    setVolumeData(weeklyVolume(12))
    setRecentPRs(records.slice(0, 10))
  }, [refreshStats, weeklyVolume, records])

  const recentWorkouts = getRecent(20)

  // Prepare volume chart data
  const volumeChartData = volumeData.map((week) => ({
    date: format(new Date(week.weekStart), 'MMM dd'),
    value: week.volume,
    workouts: week.workoutCount,
  }))

  // Prepare workout frequency data
  const workoutFrequencyData = recentWorkouts.reduce((acc: any, workout) => {
    const date = format(new Date(workout.date), 'MMM dd')
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const frequencyChartData = Object.entries(workoutFrequencyData)
    .slice(-14)
    .map(([date, count]) => ({
      name: date,
      date,
      value: count as number,
    }))

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Progress"
        subtitle="Track your fitness journey"
      >
        {/* Stats Overview */}
        <PageSection>
          <PageGrid columns={4}>
            <StatCard label="Total Workouts" value={stats.totalWorkouts.toString()} />
            <StatCard label="Current Streak" value={stats.currentStreak.toString()} unit="days" color="lime" />
            <StatCard label="Longest Streak" value={stats.longestStreak.toString()} unit="days" />
            <StatCard label="Total Volume" value={(stats.totalVolume / 1000).toFixed(1)} unit="k kg" color="ember" />
          </PageGrid>
        </PageSection>

        <PageGrid columns={2}>
          {/* Weekly Volume Chart */}
          <PageSection label="Volume" title="Weekly Training Volume">
            <LineChart
              data={volumeChartData}
              variant="area"
              height={200}
            />
          </PageSection>

          {/* Workout Frequency */}
          <PageSection label="Frequency" title="Workout Frequency">
            <BarChart
              data={frequencyChartData}
              height={200}
            />
          </PageSection>
        </PageGrid>

        {/* Personal Records */}
        <PageSection label="Records" title="Recent Personal Records">
          {recentPRs.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center py-8">
              <p className="font-mono text-sm text-text-dim">No personal records yet. Keep training!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentPRs.map((pr: any) => {
                const exercise = exercises.find((e) => e.id === pr.exerciseId)
                return (
                  <PRCard key={pr.id} pr={pr} exercise={exercise} />
                )
              })}
            </div>
          )}
        </PageSection>

        {/* Exercise Progress Selector */}
        <PageSection label="Exercise" title="Progress by Exercise">
          <ExerciseProgressSelector exercises={exercises} workouts={recentWorkouts} />
        </PageSection>
      </MainLayout>
    </>
  )
}

function StatCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: 'lime' | 'ember' }) {
  const colorClass = color === 'lime' ? 'text-lime' : color === 'ember' ? 'text-ember' : 'text-foreground'

  return (
    <Card variant="elevated" padding="lg" className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
        {label}
      </div>
      <div className={`font-display text-3xl ${colorClass} mb-1`}>
        {value}
      </div>
      {unit && (
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
          {unit}
        </div>
      )}
    </Card>
  )
}

function PRCard({ pr, exercise }: { pr: any; exercise?: any }) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'oneRepMax': return '1RM'
      case 'maxWeight': return 'Max Weight'
      case 'maxVolume': return 'Max Volume'
      case 'maxReps': return 'Max Reps'
      case 'longestDuration': return 'Longest'
      default: return type
    }
  }

  return (
    <Card variant="bordered" padding="sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-base text-foreground mb-1">
            {exercise?.name || 'Unknown Exercise'}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            {getTypeLabel(pr.type)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-xl text-lime">
            {pr.value.toLocaleString()}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
            {format(new Date(pr.date), 'MMM dd')}
          </div>
        </div>
      </div>
    </Card>
  )
}

function ExerciseProgressSelector({ exercises, workouts }: { exercises: any[]; workouts: any[] }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id || '')
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'volume'>('weight')

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId)

  // Get progress data for selected exercise
  const exerciseProgress = workouts
    .filter((workout) =>
      workout.exercises.some((e: any) => e.exerciseId === selectedExerciseId)
    )
    .map((workout) => {
      const exerciseData = workout.exercises.find((e: any) => e.exerciseId === selectedExerciseId)
      const maxWeight = Math.max(...(exerciseData?.sets || []).map((s: any) => s.weight || 0))
      const totalVolume = (exerciseData?.sets || []).reduce((sum: number, s: any) => sum + (s.weight || 0) * (s.reps || 0), 0)

      return {
        date: format(new Date(workout.date), 'MMM dd'),
        weight: maxWeight,
        volume: totalVolume,
      }
    })

  return (
    <Card variant="elevated" padding="md">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim mb-1 block">
            Exercise
          </label>
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full bg-surface border border-surface-elevated rounded-none px-3 py-2 text-foreground focus:outline-none focus:border-lime"
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
              selectedMetric === 'weight'
                ? 'bg-lime text-background'
                : 'bg-surface-elevated text-text-secondary'
            }`}
            onClick={() => setSelectedMetric('weight')}
          >
            Weight
          </button>
          <button
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
              selectedMetric === 'volume'
                ? 'bg-lime text-background'
                : 'bg-surface-elevated text-text-secondary'
            }`}
            onClick={() => setSelectedMetric('volume')}
          >
            Volume
          </button>
        </div>
      </div>

      {exerciseProgress.length > 0 ? (
        <LineChart
          data={exerciseProgress.map((d) => ({
            date: d.date,
            value: selectedMetric === 'weight' ? d.weight : d.volume,
          }))}
          height={200}
          showDots={true}
        />
      ) : (
        <div className="text-center py-8">
          <p className="font-mono text-sm text-text-dim">
            No data for {selectedExercise?.name} yet
          </p>
        </div>
      )}
    </Card>
  )
}
