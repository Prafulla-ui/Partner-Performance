import type { ViewPeriod } from '../types'

export const TREND_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const

/** Display ranges shown next to Month / Quarter / YTD in Period selectors. */
export const PRESET_PERIOD_RANGES: Record<Exclude<ViewPeriod, 'custom'>, string> = {
  month: '1 Jun – 30 Jun 2026',
  quarter: '1 Apr – 30 Jun 2026',
  ytd: '1 Jan – 30 Jun 2026',
}

export const PERIOD_LABELS: Record<Exclude<ViewPeriod, 'custom'>, string> = {
  month: 'June 2026 (1–30 Jun 2026)',
  quarter: 'Q2 2026 (1 Apr – 30 Jun 2026)',
  ytd: 'YTD 2026 (1 Jan – 30 Jun 2026)',
}

export function formatCustomPeriodLabel(from: string, to: string) {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${d} ${months[(m ?? 1) - 1]} ${y}`
  }
  return `Custom (${fmt(from)} – ${fmt(to)})`
}

/** Scales period totals (KPIs, tables). Month ≈ 1/3 of quarter, YTD ≈ 2×. */
export function periodFactor(viewPeriod: ViewPeriod, customFrom: string, customTo: string) {
  if (viewPeriod === 'month') return 1 / 3
  if (viewPeriod === 'quarter') return 1
  if (viewPeriod === 'ytd') return 2
  const start = Date.parse(customFrom)
  const end = Date.parse(customTo)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 1
  const days = (end - start) / 86_400_000 + 1
  return Math.min(3, Math.max(0.15, days / 91))
}

/**
 * Months shown on monthly trend charts for the selected Period control.
 * Same rules everywhere: Month → Jun, Quarter → Apr–Jun, YTD → Jan–Jun, Custom → months in range.
 */
export function monthsForPeriod(viewPeriod: ViewPeriod, customFrom: string, customTo: string): string[] {
  if (viewPeriod === 'month') return ['Jun']
  if (viewPeriod === 'quarter') return ['Apr', 'May', 'Jun']
  if (viewPeriod === 'ytd') return [...TREND_MONTHS]

  const start = new Date(customFrom)
  const end = new Date(customTo)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return ['Apr', 'May', 'Jun']
  }
  const months: string[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const last = new Date(end.getFullYear(), end.getMonth(), 1)
  while (cursor <= last) {
    const label = TREND_MONTHS[cursor.getMonth()]
    if (label && !months.includes(label)) months.push(label)
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return months.length ? months : ['Apr', 'May', 'Jun']
}

type TrendSeries = { current: number[]; previous: number[]; ly: number[] }

/** Slice a labeled monthly trend object to the months in the active period. */
export function sliceMonthlyTrend<T extends { labels: string[] } & Record<string, unknown>>(
  trend: T & {
    labels: string[]
    revenue: TrendSeries
    reservations: TrendSeries
    roomNights: TrendSeries
    adr: TrendSeries
  },
  months: string[],
) {
  const indices = trend.labels
    .map((label, i) => (months.includes(label) ? i : -1))
    .filter((i) => i >= 0)

  const pick = (series: TrendSeries): TrendSeries => ({
    current: indices.map((i) => series.current[i] ?? 0),
    previous: indices.map((i) => series.previous[i] ?? 0),
    ly: indices.map((i) => series.ly[i] ?? 0),
  })

  return {
    labels: indices.map((i) => trend.labels[i]),
    revenue: pick(trend.revenue),
    reservations: pick(trend.reservations),
    roomNights: pick(trend.roomNights),
    adr: pick(trend.adr),
  }
}
