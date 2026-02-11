/**
 * LineChart component - Recharts wrapper with Dark Industrial styling
 */

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

export interface ChartData {
  date: string
  value: number
  label?: string
  [key: string]: string | number | undefined
}

export interface LineChartProps {
  data: ChartData[]
  dataKey?: string
  xAxisKey?: string
  lineColor?: string
  areaColor?: string
  showGrid?: boolean
  showDots?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  height?: number
  curved?: boolean
  variant?: 'line' | 'area'
}

export function LineChart({
  data,
  dataKey = 'value',
  xAxisKey = 'date',
  lineColor = '#c8ff00',
  areaColor = '#c8ff00',
  showGrid = true,
  showDots = false,
  showTooltip = true,
  showLegend = false,
  height = 200,
  curved = true,
  variant = 'line',
}: LineChartProps) {
  const strokeDasharray = showGrid ? '2 2' : '0'

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

  const commonProps = {
    data,
    height,
    margin: { top: 10, right: 10, left: 0, bottom: 20 },
  }

  if (variant === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...commonProps}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray={strokeDasharray}
              stroke="#1a1a1a"
              horizontal={true}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={<CustomXAxis />}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={<CustomYAxis />}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={areaColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type={curved ? 'monotone' : 'linear'}
            dataKey={dataKey}
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
            dot={showDots ? { fill: lineColor, strokeWidth: 2, r: 3 } : false}
            activeDot={{ r: 4, fill: lineColor, stroke: '#050505', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart {...commonProps}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray={strokeDasharray}
            stroke="#1a1a1a"
            horizontal={true}
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={<CustomXAxis />}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={<CustomYAxis />}
        />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && <Legend />}
        <Line
          type={curved ? 'monotone' : 'linear'}
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={showDots ? { fill: lineColor, strokeWidth: 2, r: 3 } : false}
          activeDot={{ r: 4, fill: lineColor, stroke: '#050505', strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

/**
 * Multi-line chart for comparing data series
 */
export interface MultiLineChartProps {
  data: ChartData[]
  lines: Array<{
    dataKey: string
    name: string
    color: string
  }>
  xAxisKey?: string
  height?: number
}

export function MultiLineChart({
  data,
  lines,
  xAxisKey = 'date',
  height = 200,
}: MultiLineChartProps) {
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
      <RechartsLineChart
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
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: line.color, stroke: '#050505', strokeWidth: 2 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
