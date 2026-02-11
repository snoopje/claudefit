/**
 * Body Metrics Page - Log weight/measurements, trend charts
 */

import { useState, useEffect } from 'react'
import { MainLayout, PageSection, AmbientGlow, PageGrid } from '../../components/layout/MainLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { LineChart } from '../../components/charts/LineChart'
import { useBodyMetrics, useWeight, useMeasurements, useUnits } from '../../hooks/useBodyMetrics'
import { format, subDays, startOfToday } from 'date-fns'

const MEASUREMENT_TYPES = [
  { value: 'weight', label: 'Weight' },
  { value: 'chest', label: 'Chest' },
  { value: 'waist', label: 'Waist' },
  { value: 'hips', label: 'Hips' },
  { value: 'leftArm', label: 'Left Arm' },
  { value: 'rightArm', label: 'Right Arm' },
  { value: 'leftThigh', label: 'Left Thigh' },
  { value: 'rightThigh', label: 'Right Thigh' },
  { value: 'neck', label: 'Neck' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'calves', label: 'Calves' },
]

const TIME_RANGES = [
  { value: 'week', label: 'Last Week' },
  { value: 'month', label: 'Last Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'Last Year' },
]

export function BodyMetricsPage() {
  const { metrics, add, getLatest } = useBodyMetrics()
  const { weight, trend: weightTrend, getChange, getStats, refresh } = useWeight()
  const { preferences } = useUnits()

  const [showLogModal, setShowLogModal] = useState(false)
  const [selectedMeasurement, setSelectedMeasurement] = useState<'weight' | keyof any>('weight')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months' | '6months' | 'year'>('month')

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    leftArm: '',
    rightArm: '',
    leftThigh: '',
    rightThigh: '',
    neck: '',
    shoulders: '',
    calves: '',
    notes: '',
  })

  const latest = getLatest()
  const weightChange = getChange(7)
  const weightStats = getStats()

  // Weight trend data
  const weightChartData = weightTrend.map((d) => ({
    date: d.date,
    value: d.weight,
  }))

  const handleLogMetrics = () => {
    const measurements: any = {}

    Object.keys(formData).forEach((key) => {
      if (key !== 'date' && key !== 'notes' && key !== 'weight') {
        const value = parseFloat(formData[key as keyof typeof formData])
        if (!isNaN(value)) {
          measurements[key] = value
        }
      }
    })

    add({
      date: formData.date,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
      notes: formData.notes || undefined,
    })

    // Reset form
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      chest: '',
      waist: '',
      hips: '',
      leftArm: '',
      rightArm: '',
      leftThigh: '',
      rightThigh: '',
      neck: '',
      shoulders: '',
      calves: '',
      notes: '',
    })

    setShowLogModal(false)
    refresh()
  }

  return (
    <>
      <AmbientGlow />
      <MainLayout
        title="Body Metrics"
        subtitle="Track your physical progress"
      >
        {/* Current Stats */}
        <PageSection>
          <PageGrid columns={4}>
            <WeightStatCard
              label="Current Weight"
              value={weight?.toFixed(1)}
              unit={preferences.weight}
              change={weightChange}
              stats={weightStats}
            />
            <StatCard
              label="Total Logs"
              value={metrics.length.toString()}
            />
            <StatCard
              label="Average"
              value={weightStats.average.toFixed(1)}
              unit={preferences.weight}
            />
            <StatCard
              label="Goal"
              value="--"
              unit={preferences.weight}
            />
          </PageGrid>
        </PageSection>

        <PageGrid columns={2}>
          {/* Weight Trend Chart */}
          <PageSection label="Weight" title="Weight Trend">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    className={`px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] rounded-none ${
                      timeRange === range.value
                        ? 'bg-lime text-background'
                        : 'bg-surface-elevated text-text-secondary'
                    }`}
                    onClick={() => setTimeRange(range.value as any)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <LineChart
              data={weightChartData}
              variant="area"
              height={200}
            />
          </PageSection>

          {/* Quick Log */}
          <PageSection label="Log" title="Log Metrics">
            <Card variant="elevated" padding="lg" className="text-center">
              <p className="font-mono text-sm text-text-dim mb-4">
                Track your weight and body measurements over time
              </p>
              <Button onClick={() => setShowLogModal(true)}>
                + Log Metrics
              </Button>
            </Card>
          </PageSection>
        </PageGrid>

        {/* Recent Logs */}
        <PageSection label="History" title="Recent Logs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.slice(-6).reverse().map((metric) => (
              <MetricLogCard key={metric.id} metric={metric} unit={preferences.weight} />
            ))}
          </div>
        </PageSection>
      </MainLayout>

      {/* Log Modal */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Body Metrics"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowLogModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogMetrics}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <Input
            label={`Weight (${preferences.weight})`}
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="Enter weight"
          />

          <div className="border-t border-surface-elevated pt-4">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary mb-3">
              / Measurements (cm)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Chest"
                type="number"
                step="0.1"
                value={formData.chest}
                onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
              />
              <Input
                label="Waist"
                type="number"
                step="0.1"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
              />
              <Input
                label="Hips"
                type="number"
                step="0.1"
                value={formData.hips}
                onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
              />
              <Input
                label="Left Arm"
                type="number"
                step="0.1"
                value={formData.leftArm}
                onChange={(e) => setFormData({ ...formData, leftArm: e.target.value })}
              />
              <Input
                label="Right Arm"
                type="number"
                step="0.1"
                value={formData.rightArm}
                onChange={(e) => setFormData({ ...formData, rightArm: e.target.value })}
              />
              <Input
                label="Left Thigh"
                type="number"
                step="0.1"
                value={formData.leftThigh}
                onChange={(e) => setFormData({ ...formData, leftThigh: e.target.value })}
              />
              <Input
                label="Right Thigh"
                type="number"
                step="0.1"
                value={formData.rightThigh}
                onChange={(e) => setFormData({ ...formData, rightThigh: e.target.value })}
              />
              <Input
                label="Neck"
                type="number"
                step="0.1"
                value={formData.neck}
                onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

function WeightStatCard({
  label,
  value,
  unit,
  change,
  stats,
}: {
  label: string
  value?: string
  unit: string
  change?: { change: number; percentage: number } | null
  stats?: { current?: number; average: number; min: number; max: number; trend: 'up' | 'down' | 'stable' }
}) {
  const trendIcon = stats?.trend === 'up'
    ? <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 15l7-7 7 7" />
    : stats?.trend === 'down'
    ? <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
    : null

  const trendColor = stats?.trend === 'up' ? 'text-ember' : stats?.trend === 'down' ? 'text-lime' : ''

  return (
    <Card variant="elevated" padding="lg" className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
        {label}
      </div>
      {value ? (
        <>
          <div className="font-display text-3xl text-foreground mb-1">
            {value}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
              {unit}
            </span>
            {change && change.change !== 0 && (
              <span className={`font-mono text-[10px] ${change.change > 0 ? 'text-ember' : 'text-lime'}`}>
                {change.change > 0 ? '+' : ''}{change.change.toFixed(1)} {unit}
              </span>
            )}
            {trendIcon && (
              <svg className={`w-3 h-3 ${trendColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {trendIcon}
              </svg>
            )}
          </div>
        </>
      ) : (
        <div className="text-text-dim">No data</div>
      )}
    </Card>
  )
}

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <Card variant="elevated" padding="lg" className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim mb-2">
        {label}
      </div>
      <div className="font-display text-3xl text-foreground mb-1">
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

function MetricLogCard({ metric, unit }: { metric: any; unit: string }) {
  const date = new Date(metric.date)
  const formattedDate = format(date, 'MMM dd, yyyy')

  return (
    <Card variant="bordered" padding="sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
          {formattedDate}
        </span>
        {metric.weight && (
          <Badge size="sm" variant="lime">
            {metric.weight} {unit}
          </Badge>
        )}
      </div>

      {metric.measurements && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(metric.measurements).slice(0, 6).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-ghost">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="font-display text-sm text-foreground">
                {value as number}
              </div>
            </div>
          ))}
        </div>
      )}

      {metric.notes && (
        <p className="font-mono text-[10px] text-text-dim mt-2 line-clamp-2">
          {metric.notes}
        </p>
      )}
    </Card>
  )
}
