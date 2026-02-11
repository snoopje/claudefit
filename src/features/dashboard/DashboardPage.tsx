/**
 * Dashboard Page - Overview of fitness data
 * Recent workouts, streak, weekly volume, active goals, nutrition summary, PRs
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout, PageSection, PageGrid, AmbientGlow } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useWorkouts } from '../../hooks/useWorkouts'
import { useActiveGoals } from '../../hooks/useGoals'
import { useTodaysNutrition } from '../../hooks/useNutrition'
import { useWeight } from '../../hooks/useBodyMetrics'
import { format, startOfWeek, subDays } from 'date-fns'

export function DashboardPage() {
  const navigate = useNavigate()
  const { getRecent, statistics, weeklyVolume } = useWorkouts()
  const { activeGoals } = useActiveGoals()
  const { summary: nutrition } = useTodaysNutrition()
  const { weight, getChange } = useWeight()

  const [stats, setStats] = useState(statistics())
  const [recentWorkouts, setRecentWorkouts] = useState(getRecent(5))
  const [weeklyVol, setWeeklyVol] = useState(weeklyVolume(8))

  const refreshData = useCallback(() => {
    setStats(statistics())
    setRecentWorkouts(getRecent(5))
    setWeeklyVol(weeklyVolume(8))
  }, [statistics, getRecent, weeklyVolume])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const weightChange = getChange(7)

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Dashboard"
        containerWidth="xl"
      >
        {/* Stats Overview */}
        <PageSection>
          <PageGrid columns={4}>
            <StatCard
              label="Streak"
              value={stats.currentStreak.toString()}
              unit="days"
              color="lime"
            />
            <StatCard
              label="This Week"
              value={stats.workoutsThisWeek.toString()}
              unit="workouts"
              color="ember"
            />
            <StatCard
              label="Volume"
              value={weeklyVol.reduce((sum, w) => sum + w.volume, 0).toLocaleString()}
              unit="kg"
              color="lime"
            />
            <StatCard
              label="Weight"
              value={weight ? weight.toFixed(1) : '--'}
              unit={weightChange && weightChange.change !== 0 ? (weightChange.change > 0 ? '+kg' : 'kg') : 'kg'}
              trend={weightChange ? (weightChange.change > 0 ? 'up' : weightChange.change < 0 ? 'down' : 'stable') : undefined}
            />
          </PageGrid>
        </PageSection>

        <PageGrid columns={2}>
          {/* Recent Workouts */}
          <PageSection label="Activity" title="Recent Workouts">
            <div className="space-y-3">
              {recentWorkouts.length === 0 ? (
                <Card variant="bordered" padding="md" className="text-center py-8">
                  <p className="text-text-dim mb-4">No workouts yet</p>
                  <Button size="sm" onClick={() => navigate('/workouts')}>
                    Start Workout
                  </Button>
                </Card>
              ) : (
                recentWorkouts.map((workout) => (
                  <WorkoutListItem key={workout.id} workout={workout} />
                ))
              )}
            </div>
          </PageSection>

          {/* Active Goals */}
          <PageSection label="Targets" title="Active Goals">
            <div className="space-y-3">
              {activeGoals.length === 0 ? (
                <Card variant="bordered" padding="md" className="text-center py-8">
                  <p className="text-text-dim mb-4">No active goals</p>
                  <Button size="sm" onClick={() => navigate('/goals')}>
                    Create Goal
                  </Button>
                </Card>
              ) : (
                activeGoals.slice(0, 4).map(({ goal, progress }) => (
                  <GoalProgressItem key={goal.id} goal={goal} progress={progress} />
                ))
              )}
            </div>
          </PageSection>
        </PageGrid>

        <PageGrid columns={2}>
          {/* Nutrition Summary */}
          <PageSection label="Fuel" title="Today's Nutrition">
            <NutritionSummary summary={nutrition} />
          </PageSection>

          {/* Weekly Volume */}
          <PageSection label="Progress" title="Weekly Volume">
            <div className="h-40">
              <VolumeChart data={weeklyVol} />
            </div>
          </PageSection>
        </PageGrid>
      </MainLayout>
    </>
  )
}

interface StatCardProps {
  label: string
  value: string
  unit: string
  color?: 'lime' | 'ember'
  trend?: 'up' | 'down' | 'stable'
}

function StatCard({ label, value, unit, color = 'lime', trend }: StatCardProps) {
  const colorClass = color === 'lime' ? 'text-lime' : 'text-ember'

  return (
    <Card variant="elevated" hover padding="lg" className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
        {label}
      </div>
      <div className={`font-display text-3xl ${colorClass} mb-1`}>
        {value}
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
          {unit}
        </span>
        {trend && (
          <TrendIndicator trend={trend} />
        )}
      </div>
    </Card>
  )
}

function TrendIndicator({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'stable') return null

  const color = trend === 'up' ? 'text-lime' : 'text-ember'
  const icon = trend === 'up'
    ? <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 15l7-7 7 7" />
    : <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />

  return (
    <svg className={`w-3 h-3 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icon}
    </svg>
  )
}

function WorkoutListItem({ workout }: { workout: any }) {
  const date = new Date(workout.date)
  const formattedDate = format(date, 'MMM dd, yyyy')

  return (
    <Card variant="bordered" padding="sm" hover className="flex items-center justify-between">
      <div className="flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim mb-1">
          {formattedDate}
        </div>
        <div className="font-display text-lg text-foreground">
          {workout.type || 'Workout'}
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-xl text-lime">
          {workout.totalVolume?.toLocaleString() || '--'}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
          kg volume
        </div>
      </div>
    </Card>
  )
}

function GoalProgressItem({ goal, progress }: { goal: any; progress: any }) {
  return (
    <Card variant="bordered" padding="sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
          {goal.name}
        </span>
        <Badge size="sm" variant={progress.isOnTrack ? 'lime' : 'ember'}>
          {progress.percentage}%
        </Badge>
      </div>
      <div className="w-full bg-surface-elevated h-1 rounded-none overflow-hidden">
        <div
          className="h-full bg-lime transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </Card>
  )
}

function NutritionSummary({ summary }: { summary: any }) {
  const targets = summary.target

  return (
    <Card variant="elevated" padding="md">
      <div className="grid grid-cols-2 gap-4">
        <NutrientItem
          label="Calories"
          current={summary.totalCalories}
          target={targets.dailyCalories}
          color="lime"
        />
        <NutrientItem
          label="Protein"
          current={summary.totalProtein}
          target={targets.protein}
          unit="g"
          color="ember"
        />
        <NutrientItem
          label="Carbs"
          current={summary.totalCarbs}
          target={targets.carbs}
          unit="g"
          color="text-secondary"
        />
        <NutrientItem
          label="Fat"
          current={summary.totalFat}
          target={targets.fat}
          unit="g"
          color="text-secondary"
        />
      </div>
    </Card>
  )
}

function NutrientItem({
  label,
  current,
  target,
  unit = '',
  color = 'lime',
}: any) {
  const percentage = Math.min(100, Math.round((current / target) * 100))
  const colorClass = color === 'lime' ? 'text-lime' : color === 'ember' ? 'text-ember' : 'text-text-secondary'

  return (
    <div className="text-center">
      <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim mb-1">
        {label}
      </div>
      <div className={`font-display text-xl ${colorClass}`}>
        {current}
        <span className="text-sm text-text-dim">/{target}{unit}</span>
      </div>
    </div>
  )
}

function VolumeChart({ data }: { data: Array<{ weekStart: string; volume: number; workoutCount: number }> }) {
  const maxVolume = Math.max(...data.map((d) => d.volume), 1)

  return (
    <div className="flex items-end justify-between h-full gap-2">
      {data.map((week, index) => {
        const height = (week.volume / maxVolume) * 100
        const weekDate = new Date(week.weekStart)
        const label = format(weekDate, 'MMM dd')

        return (
          <div key={week.weekStart} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-surface-elevated rounded-none relative flex-1 flex items-end">
              <div
                className="w-full bg-lime/80 hover:bg-lime transition-colors"
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-dim -rotate-45 origin-top-left">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

