import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getChartColors, useChartTheme } from '../lib/chartTheme'
import { formatCurrency, formatNumber } from '../lib/format'
import type { ChartMetric } from '../types'

interface Point {
  month: string
  current: number
  previous: number
  ly: number
}

function buildSeries(series: ReturnType<typeof useChartTheme>['series']) {
  return {
    current: { key: 'current', label: 'Current', color: series.current, dashed: false },
    previous: { key: 'previous', label: 'Prior period', color: series.previous, dashed: true },
    ly: { key: 'ly', label: 'Last year', color: series.ly, dashed: false },
  } as const
}

function formatAxis(value: number, metric: ChartMetric) {
  if (metric === 'revenue') return formatCurrency(value, true)
  if (metric === 'adr') return `$${value}`
  return formatNumber(value)
}

function metricUnit(metric: ChartMetric) {
  if (metric === 'revenue') return 'Revenue'
  if (metric === 'reservations') return 'Reservations'
  if (metric === 'roomNights') return 'Room nights'
  return 'ADR'
}

function pctChange(current: number, baseline: number) {
  if (!baseline) return 0
  return ((current - baseline) / baseline) * 100
}

function TrendTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string; dataKey?: string }[]
  label?: string
  metric: ChartMetric
}) {
  if (!active || !payload?.length) return null
  const chartColors = getChartColors()
  return (
    <div className="rounded-xl border border-line bg-card px-3.5 py-2.5 shadow-[0_12px_28px_rgb(15_31_51/0.12)]">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-muted">{label}</p>
      <ul className="space-y-1.5">
        {payload.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-8 text-xs">
            <span className="inline-flex items-center gap-2 text-navy-muted">
              <span
                className="h-0.5 w-3 rounded-full"
                style={{
                  background: item.color,
                  borderTop: item.dataKey === 'previous' ? `1.5px dashed ${item.color}` : undefined,
                }}
              />
              {item.name}
            </span>
            <span
              className="font-semibold tabular"
              style={{ color: item.color === chartColors.primary ? chartColors.primary : chartColors.ink }}
            >
              {formatAxis(item.value, metric)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SeriesPill({
  label,
  color,
  dashed,
  active,
  onClick,
}: {
  label: string
  color: string
  dashed?: boolean
  active: boolean
  onClick: () => void
}) {
  const chartColors = getChartColors()
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? 'bg-rg-blue-soft text-navy' : 'bg-canvas text-navy-muted'
      }`}
    >
      <span
        className="h-0.5 w-4 rounded-full"
        style={{
          background: active ? color : chartColors.muted,
          backgroundImage: dashed
            ? `repeating-linear-gradient(90deg, ${active ? color : chartColors.muted} 0 3px, transparent 3px 5px)`
            : undefined,
        }}
        aria-hidden
      />
      {label}
    </button>
  )
}

export function MonthlyTrendChart({
  data,
  metric,
  showPrevious,
  showLy,
}: {
  data: Point[]
  metric: ChartMetric
  showPrevious: boolean
  showLy: boolean
}) {
  const { colors: chartColors, series } = useChartTheme()
  const SERIES = buildSeries(series)
  const [visible, setVisible] = useState({ current: true, previous: true, ly: true })
  const [activeMonth, setActiveMonth] = useState<string | null>(null)

  const summary = useMemo(() => {
    const last = data[data.length - 1]
    const first = data[0]
    if (!last || !first) return null
    const vsStart = pctChange(last.current, first.current)
    const vsPrior = showPrevious ? pctChange(last.current, last.previous) : null
    const rising = vsStart >= 0
    return {
      latest: last.current,
      month: last.month,
      vsStart,
      vsPrior,
      insight: rising
        ? `${metricUnit(metric)} is building through the quarter — keep the conversion work funded.`
        : `${metricUnit(metric)} softened late in the quarter — check funnel and channel mix.`,
    }
  }, [data, metric, showPrevious])

  const toggle = (key: 'current' | 'previous' | 'ly') => {
    setVisible((v) => ({ ...v, [key]: !v[key] }))
  }

  return (
    <div className="flex h-full min-h-[380px] flex-col">
      {summary && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-muted">
                {metricUnit(metric)} · {summary.month}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-[28px] font-semibold tracking-tight tabular text-navy">
                  {formatAxis(summary.latest, metric)}
                </p>
                <span className={`text-xs font-semibold ${summary.vsStart >= 0 ? 'text-positive' : 'text-danger'}`}>
                  {summary.vsStart >= 0 ? '+' : ''}
                  {summary.vsStart.toFixed(0)}% vs Apr
                </span>
              </div>
            </div>
            {summary.vsPrior != null && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-muted">Vs prior period</p>
                <p
                  className={`mt-1 text-lg font-semibold tabular ${
                    summary.vsPrior >= 0 ? 'text-positive' : 'text-danger'
                  }`}
                >
                  {summary.vsPrior >= 0 ? '+' : ''}
                  {summary.vsPrior.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <SeriesPill
              label={SERIES.current.label}
              color={SERIES.current.color}
              active={visible.current}
              onClick={() => toggle('current')}
            />
            {showPrevious && (
              <SeriesPill
                label={SERIES.previous.label}
                color={SERIES.previous.color}
                dashed
                active={visible.previous}
                onClick={() => toggle('previous')}
              />
            )}
            {showLy && (
              <SeriesPill
                label={SERIES.ly.label}
                color={SERIES.ly.color}
                active={visible.ly}
                onClick={() => toggle('ly')}
              />
            )}
          </div>
        </div>
      )}

      {summary && <p className="mb-3 text-sm text-navy-muted">{summary.insight}</p>}

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
            onMouseMove={(state) => {
              const label = state?.activeLabel
              setActiveMonth(typeof label === 'string' ? label : null)
            }}
            onMouseLeave={() => setActiveMonth(null)}
          >
            <defs>
              <linearGradient id="trendCurrentFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.22} />
                <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.track} vertical={false} strokeDasharray="0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={(props) => {
                const x = Number(props.x ?? 0)
                const y = Number(props.y ?? 0)
                const value = String(props.payload?.value ?? '')
                const active = value === (activeMonth ?? data[data.length - 1]?.month)
                return (
                  <text
                    x={x}
                    y={y + 12}
                    textAnchor="middle"
                    fill={active ? chartColors.ink : chartColors.axisMuted}
                    fontSize={12}
                    fontWeight={active ? 700 : 500}
                  >
                    {value}
                  </text>
                )
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={58}
              tick={{ fill: chartColors.axisMuted, fontSize: 11 }}
              tickFormatter={(v: number) => formatAxis(v, metric)}
              label={{
                value: metricUnit(metric).toUpperCase(),
                position: 'top',
                offset: 8,
                style: { fill: chartColors.axisMuted, fontSize: 10, fontWeight: 600 },
              }}
            />
            <Tooltip
              content={<TrendTooltip metric={metric} />}
              cursor={{ stroke: chartColors.muted, strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            {showPrevious && visible.previous && (
              <Line
                type="monotone"
                dataKey="previous"
                name={SERIES.previous.label}
                stroke={SERIES.previous.color}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3.5, fill: chartColors.white, stroke: SERIES.previous.color, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            )}
            {showLy && visible.ly && (
              <Line
                type="monotone"
                dataKey="ly"
                name={SERIES.ly.label}
                stroke={SERIES.ly.color}
                strokeWidth={2}
                dot={{ r: 3.5, fill: chartColors.white, stroke: SERIES.ly.color, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            )}
            {visible.current && (
              <Area
                type="monotone"
                dataKey="current"
                name={SERIES.current.label}
                stroke={SERIES.current.color}
                strokeWidth={2.75}
                fill="url(#trendCurrentFill)"
                dot={{ r: 4, fill: chartColors.white, stroke: SERIES.current.color, strokeWidth: 2.5 }}
                activeDot={{ r: 6, fill: chartColors.white, stroke: SERIES.current.color, strokeWidth: 2.5 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-[11px] text-navy-muted">
        Hover to inspect a month · toggle series above
        {showPrevious || showLy ? ' · comparisons follow the Compare with filter' : ''}
      </p>
    </div>
  )
}
