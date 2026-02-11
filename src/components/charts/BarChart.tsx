/**
 * BarChart component - Recharts wrapper with Dark Industrial styling
 */

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export interface ChartData {
  name: string
  value: number
  date?: string
  label?: string
  [key: string]: string | number | undefined
}

export interface BarChartProps {
  data: ChartData[]
  dataKey?: string
  xAxisKey?: string
  barColor?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  height?: number
  horizontal?: boolean
  variant?: 'default' | 'volume' | 'distribution'
}

const LIME_COLOR = '#c8ff00'
const EMBER_COLOR = '#ff4d00'
const MUTED_COLOR = '#666666'

export function BarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  barColor = LIME_COLOR,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  height = 200,
  horizontal = false,
  variant = 'default',
}: BarChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-elevated border border-surface-elevated p-3 rounded-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
            {payload[0].payload[xAxisKey]}
          </p>
          <p className="font-display text-lg text-lime">
            {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  const CustomXAxis = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          className="font-mono text-[10px] uppercase tracking-[0.15em]"
        >
          {payload.value}
        </text>
      </g>
    )
  }

  const CustomYAxis = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#666"
          className="font-mono text-[10px] uppercase tracking-[0.15em]"
        >
          {payload.value}
        </text>
      </g>
    )
  }

  const strokeDasharray = showGrid ? '2 2' : '0'

  // For volume variant - gradient colors based on value
  const getBarColor = (entry: ChartData, index: number) => {
    if (variant === 'volume') {
      const maxValue = Math.max(...data.map((d) => d.value))
      const ratio = entry.value / maxValue
      if (ratio > 0.8) return EMBER_COLOR
      if (ratio > 0.5) return LIME_COLOR
      return MUTED_COLOR
    }
    return barColor
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        height={height}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
            stroke="#1a1a1a"
            horizontal={!horizontal}
            vertical={horizontal}
          />
        )}
        <XAxis
          dataKey={horizontal ? dataKey : xAxisKey}
          type={horizontal ? 'number' : 'category'}
          axisLine={false}
          tickLine={false}
          tick={horizontal ? <CustomYAxis /> : <CustomXAxis />}
        />
        <YAxis
          type={horizontal ? 'category' : 'number'}
          axisLine={false}
          tickLine={false}
          tick={horizontal ? <CustomXAxis /> : <CustomYAxis />}
        />
        {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 255, 0, 0.05)' }} />}
        {showLegend && <Legend />}
        <Bar
          dataKey={horizontal ? xAxisKey : dataKey}
          radius={[0, 0, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry, index)} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

/**
 * Stacked bar chart for distribution data
 */
export interface StackedBarChartProps {
  data: ChartData[]
  stacks: Array<{
    dataKey: string
    name: string
    color: string
  }>
  xAxisKey?: string
  height?: number
}

export function StackedBarChart({
  data,
  stacks,
  xAxisKey = 'name',
  height = 200,
}: StackedBarChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-elevated border border-surface-elevated p-3 rounded-none">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim mb-2">
            {payload[0].payload[xAxisKey]}
          </p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-2 h-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                {entry.name}:
              </span>
              <span className="font-display text-sm" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        height={height}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="2 2" stroke="#1a1a1a" horizontal={true} vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 255, 0, 0.05)' }} />
        <Legend />
        {stacks.map((stack) => (
          <Bar key={stack.dataKey} dataKey={stack.dataKey} name={stack.name} stackId="a" fill={stack.color} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

/**
 * Weekly volume chart - specialized for workout tracking
 */
export interface WeeklyVolumeChartProps {
  data: Array<{
    weekStart: string
    volume: number
    workoutCount: number
  }>
  height?: number
}

export function WeeklyVolumeChart({ data, height = 200 }: WeeklyVolumeChartProps) {
  const chartData = data.map((d) => ({
    name: new Date(d.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: d.volume,
    workouts: d.workoutCount,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
          / Weekly Volume
        </h4>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lime" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
              Volume
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-ember" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
              Workouts
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          height={height}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="2 2" stroke="#1a1a1a" horizontal={true} vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            yAxisId="volume"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            yAxisId="workouts"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(200, 255, 0, 0.05)' }}
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-surface-elevated border border-surface-elevated p-3 rounded-none">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim mb-2">
                      {payload[0].payload.name}
                    </p>
                    {payload.map((entry: any) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2 h-2" style={{ backgroundColor: entry.color }} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                          {entry.name}:
                        </span>
                        <span className="font-display text-sm" style={{ color: entry.color }}>
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          <Bar yAxisId="volume" dataKey="volume" fill={LIME_COLOR} radius={[0, 0, 0, 0]} />
          <Bar yAxisId="workouts" dataKey="workouts" fill={EMBER_COLOR} radius={[0, 0, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
