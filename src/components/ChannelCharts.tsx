import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useChartTheme } from '../lib/chartTheme'
import { formatCurrency, formatNumber } from '../lib/format'
import type { ChannelRow } from '../types'

interface MixItem {
  name: string
  value: number
  color: string
}

function MixTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: MixItem }[]
  unit: string
}) {
  if (!active || !payload?.[0]) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-[var(--shadow-card-hover)]">
      <p className="font-semibold text-navy">{item.name}</p>
      <p className="mt-0.5 tabular text-navy-muted">
        {item.value}% {unit}
      </p>
    </div>
  )
}

export function ChannelMixChart({
  data,
  centerLabel = 'All channels',
  centerValue = '100%',
  unit = 'of room revenue',
}: {
  data: MixItem[]
  centerLabel?: string
  centerValue?: string
  unit?: string
}) {
  const { colors: chartColors } = useChartTheme()

  return (
    <div className="flex h-full min-h-64 w-full items-center gap-4">
      <div className="relative h-full min-w-0 flex-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={92}
              paddingAngle={3}
              stroke={chartColors.white}
              strokeWidth={3}
            >
              {data.map((c) => (
                <Cell key={c.name} fill={c.color} />
              ))}
            </Pie>
            <Tooltip content={<MixTooltip unit={unit} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[11px] font-semibold text-navy-muted">{centerLabel}</p>
          <p className="text-lg font-semibold tabular text-navy">{centerValue}</p>
        </div>
      </div>
      <ul className="w-44 shrink-0 space-y-2.5">
        {data.map((c) => (
          <li key={c.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-2 text-navy">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </span>
            <span className="font-semibold tabular">{c.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BarTooltip({
  active,
  payload,
  label,
  formatters,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string; dataKey?: string }[]
  label?: string
  formatters?: Record<string, (v: number) => string>
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2.5 shadow-[var(--shadow-card-hover)]">
      <p className="mb-1.5 text-xs font-semibold text-navy">{label}</p>
      <ul className="space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name)
          const format = formatters?.[key] ?? ((v: number) => formatCurrency(v, true))
          return (
            <li key={item.name} className="flex items-center justify-between gap-6 text-xs">
              <span className="inline-flex items-center gap-1.5 text-navy-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold tabular text-navy">{format(item.value)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const shortName: Record<string, string> = {
  'Booking.com': 'Booking',
  'Expedia Group': 'Expedia',
  Agoda: 'Agoda',
  'Trip.com': 'Trip.com',
  'GDS / Wholesale': 'GDS',
}

export type ChannelCompareMetric =
  | 'commission'
  | 'roomNights'
  | 'share'
  | 'cancelRate'
  | 'commissionPct'
  | 'leadTime'

const compareMetricMeta: Record<
  ChannelCompareMetric,
  {
    label: string
    shortLabel: string
    dataKey: ChannelCompareMetric
    axis: 'currency' | 'count' | 'pct' | 'days'
    format: (v: number) => string
  }
> = {
  commission: {
    label: 'Commission',
    shortLabel: 'Commission',
    dataKey: 'commission',
    axis: 'currency',
    format: (v) => formatCurrency(v, true),
  },
  roomNights: {
    label: 'Room nights',
    shortLabel: 'Room nights',
    dataKey: 'roomNights',
    axis: 'count',
    format: (v) => formatNumber(v),
  },
  share: {
    label: 'Revenue share',
    shortLabel: 'Rev. share',
    dataKey: 'share',
    axis: 'pct',
    format: (v) => `${v.toFixed(1)}%`,
  },
  cancelRate: {
    label: 'Cancellation rate',
    shortLabel: 'Cancel rate',
    dataKey: 'cancelRate',
    axis: 'pct',
    format: (v) => `${v.toFixed(1)}%`,
  },
  commissionPct: {
    label: 'Commission %',
    shortLabel: 'Comm. %',
    dataKey: 'commissionPct',
    axis: 'pct',
    format: (v) => `${v}%`,
  },
  leadTime: {
    label: 'Avg lead time',
    shortLabel: 'Lead time',
    dataKey: 'leadTime',
    axis: 'days',
    format: (v) => `${v}d`,
  },
}

export const channelCompareOptions = (Object.keys(compareMetricMeta) as ChannelCompareMetric[]).map(
  (value) => ({
    value,
    label: compareMetricMeta[value].shortLabel,
  }),
)

export function RevenueCommissionChart({
  rows,
  compareMetric = 'commission',
}: {
  rows: ChannelRow[]
  compareMetric?: ChannelCompareMetric
}) {
  const { colors: chartColors, gradients: chartGradients } = useChartTheme()
  const compare = compareMetricMeta[compareMetric]
  const sameAxis = compare.axis === 'currency'
  const data = rows.map((r) => ({
    ...r,
    label: shortName[r.channel] ?? r.channel,
  }))

  const formatLeft = (v: number) => formatCurrency(v, true)
  const formatRight = compare.format

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={4}
          barCategoryGap="22%"
          margin={{ top: 8, right: sameAxis ? 8 : 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartGradients.primaryBar.from} />
              <stop offset="100%" stopColor={chartGradients.primaryBar.to} />
            </linearGradient>
            <linearGradient id="compareBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartGradients.accentBar.from} />
              <stop offset="100%" stopColor={chartGradients.accentBar.to} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartColors.axis, fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            width={52}
            tick={{ fill: chartColors.axis, fontSize: 11 }}
            tickFormatter={formatLeft}
          />
          {!sameAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              width={44}
              tick={{ fill: chartColors.axis, fontSize: 11 }}
              tickFormatter={formatRight}
            />
          )}
          <Tooltip
            content={
              <BarTooltip
                formatters={{
                  revenue: formatLeft,
                  [compare.dataKey]: formatRight,
                }}
              />
            }
            cursor={{ fill: 'rgb(27 79 156 / 0.05)' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: chartColors.axis, paddingBottom: 6 }}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            fill="url(#revBar)"
            radius={[6, 6, 0, 0]}
            maxBarSize={22}
          />
          <Bar
            yAxisId={sameAxis ? 'left' : 'right'}
            dataKey={compare.dataKey}
            name={compare.label}
            fill="url(#compareBar)"
            radius={[6, 6, 0, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PaidSpendRevenueChart({
  data,
  showSpend,
}: {
  data: { month: string; spend: number; revenue: number }[]
  showSpend: boolean
}) {
  const { colors: chartColors, gradients: chartGradients } = useChartTheme()

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap="28%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="paidRevBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartGradients.primaryBar.from} />
              <stop offset="100%" stopColor={chartGradients.primaryBar.to} />
            </linearGradient>
            <linearGradient id="paidSpendBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartGradients.mutedBar.from} />
              <stop offset="100%" stopColor={chartGradients.mutedBar.to} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartColors.axis, fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={52}
            tick={{ fill: chartColors.axis, fontSize: 11 }}
            tickFormatter={(v: number) => formatCurrency(v, true)}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgb(27 79 156 / 0.05)' }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: chartColors.axis, paddingBottom: 6 }}
          />
          {showSpend && (
            <Bar dataKey="spend" name="Spend" fill="url(#paidSpendBar)" radius={[6, 6, 0, 0]} maxBarSize={28} />
          )}
          <Bar dataKey="revenue" name="Revenue" fill="url(#paidRevBar)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function SessionTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-[var(--shadow-card-hover)]">
      <p className="font-semibold text-navy">{label}</p>
      <p className="mt-0.5 tabular text-navy-muted">{formatNumber(payload[0].value)} sessions</p>
    </div>
  )
}

export function OrganicSessionsChart({ data }: { data: { month: string; sessions: number }[] }) {
  const { colors: chartColors, gradients: chartGradients } = useChartTheme()

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="orgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartGradients.primaryArea} stopOpacity={0.28} />
              <stop offset="100%" stopColor={chartGradients.primaryArea} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: chartColors.axis, fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={48}
            tick={{ fill: chartColors.axis, fontSize: 11 }}
            tickFormatter={(v: number) => formatNumber(v)}
          />
          <Tooltip content={<SessionTooltip />} cursor={{ stroke: chartColors.primary, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="sessions"
            name="Organic sessions"
            stroke={chartColors.primary}
            strokeWidth={2.5}
            fill="url(#orgFill)"
            dot={{ r: 3.5, fill: chartColors.primary, stroke: chartColors.white, strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
