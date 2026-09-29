import { CalendarDays } from 'lucide-react'
import { useReport } from '../../context/ReportContext'
import { PRESET_PERIOD_RANGES } from '../../lib/period'
import type { ViewPeriod } from '../../types'
import { DateRangePicker } from './DateRangePicker'
import { Select } from './FilterBar'

export function PeriodSelector({
  value,
  onPeriodChange,
  customFrom,
  customTo,
  onCustomRangeChange,
  size = 'sm',
}: {
  /** Optional controlled mode for Generate Report (defaults to report context). */
  value?: ViewPeriod
  onPeriodChange?: (v: ViewPeriod) => void
  customFrom?: string
  customTo?: string
  onCustomRangeChange?: (from: string, to: string) => void
  size?: 'sm' | 'md'
}) {
  const ctx = useReport()
  const viewPeriod = value ?? ctx.viewPeriod
  const from = customFrom ?? ctx.customFrom
  const to = customTo ?? ctx.customTo

  const setPeriod = (next: ViewPeriod) => {
    if (onPeriodChange) onPeriodChange(next)
    else ctx.setViewPeriod(next)
  }

  const setRange = (nextFrom: string, nextTo: string) => {
    if (onCustomRangeChange) onCustomRangeChange(nextFrom, nextTo)
    else ctx.setCustomRange(nextFrom, nextTo)
  }

  const controlHeight = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm'

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-navy-muted">Period</span>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={viewPeriod}
          onChange={(v) => setPeriod(v as ViewPeriod)}
          size={size}
          className="min-w-[120px]"
          options={[
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
            { value: 'ytd', label: 'YTD' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {viewPeriod === 'custom' ? (
          <DateRangePicker from={from} to={to} onChange={setRange} size={size} />
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 font-semibold text-navy ${controlHeight}`}
          >
            <CalendarDays size={size === 'sm' ? 13 : 14} className="shrink-0 text-navy-muted" />
            {PRESET_PERIOD_RANGES[viewPeriod]}
          </span>
        )}
      </div>
    </div>
  )
}
