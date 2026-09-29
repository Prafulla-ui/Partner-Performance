import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ConversionFunnel } from '../components/ConversionFunnel'
import { MonthlyTrendChart } from '../components/MonthlyTrendChart'
import { InternalOnlyBadge } from '../components/ui/Badges'
import { ChartContainer } from '../components/ui/ChartContainer'
import { DataTable, type Column } from '../components/ui/DataTable'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { SideDrawer } from '../components/ui/SideDrawer'
import { TrendIndicator } from '../components/ui/TrendIndicator'
import { useReport } from '../context/ReportContext'
import { formatCurrency, formatNumber } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'
import type { AttributionRow, ChartMetric, FunnelStage } from '../types'

const metricOptions: { value: ChartMetric; label: string }[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'reservations', label: 'Reservations' },
  { value: 'roomNights', label: 'Room nights' },
  { value: 'adr', label: 'ADR' },
]

export function DirectPerformance() {
  const { isSupply, isInternal, chartMetric, setChartMetric, compareWith, periodLabel } = useReport()
  const location = useLocation()
  const isSharedPreview = location.pathname.includes('/shared/')
  const showInternalAttribution = isInternal && !isSharedPreview
  const scoped = useScopedReportData()
  const kpis = isSupply ? scoped.bookingCards : scoped.kpis
  const [stage, setStage] = useState<FunnelStage | null>(null)
  const series = scoped.monthlyTrend[chartMetric]
  const chartData = scoped.monthlyTrend.labels.map((month, i) => ({
    month,
    current: series.current[i],
    previous: series.previous[i],
    ly: series.ly[i],
  }))

  const columns: Column<AttributionRow>[] = [
    { key: 'source', header: 'Source', render: (r) => r.source },
    { key: 'sessions', header: 'Sessions', align: 'right', render: (r) => formatNumber(r.sessions) },
    { key: 'bookings', header: 'Bookings', align: 'right', render: (r) => formatNumber(r.bookings) },
    { key: 'revenue', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
    { key: 'conv', header: 'Conversion rate', align: 'right', render: (r) => `${r.conversion.toFixed(2)}%` },
    {
      key: 'trend',
      header: 'Trend',
      align: 'right',
      render: (r) => <TrendIndicator value={r.trend} kind="pct" />,
    },
  ]

  if (showInternalAttribution) {
    columns.push(
      {
        key: 'type',
        header: (
          <span className="inline-flex flex-col items-start gap-1">
            Paid / organic
            <InternalOnlyBadge compact />
          </span>
        ),
        render: (r) => r.type,
      },
      {
        key: 'paid',
        header: (
          <span className="inline-flex flex-col items-start gap-1">
            Paid source
            <InternalOnlyBadge compact />
          </span>
        ),
        render: (r) => r.paidSource,
      },
      {
        key: 'spend',
        header: (
          <span className="inline-flex flex-col items-end gap-1">
            Media spend
            <InternalOnlyBadge compact />
          </span>
        ),
        align: 'right',
        render: (r) => (r.spend == null ? '—' : formatCurrency(r.spend, true)),
      },
      {
        key: 'roas',
        header: (
          <span className="inline-flex flex-col items-end gap-1">
            ROAS
            <InternalOnlyBadge compact />
          </span>
        ),
        align: 'right',
        render: (r) => (r.roas == null ? '—' : `${r.roas.toFixed(1)}x`),
      },
    )
  }

  return (
    <section>
      <SectionHeader
        id="direct-performance"
        moduleId="direct"
        title={isSupply ? 'Direct channel performance' : 'Contribution performance'}
        description={
          isSupply
            ? 'Booking-engine production, conversion quality and traffic mix.'
            : 'How the demand partnership is producing bookings, room nights and conversion quality.'
        }
      />
      <div className="grid grid-cols-4 items-stretch gap-3">
        {kpis.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={`mt-4 grid items-stretch gap-3 ${isSupply ? 'grid-cols-5' : 'grid-cols-1'}`}>
        <div className={isSupply ? 'col-span-3 h-full' : ''}>
          <ChartContainer
            title="Monthly trend"
            subtitle={`${periodLabel} · booking-engine production by month`}
            action={<SegmentedControl value={chartMetric} onChange={setChartMetric} options={metricOptions} />}
          >
            <MonthlyTrendChart
              data={chartData}
              metric={chartMetric}
              showPrevious={compareWith === 'previous' || compareWith === 'both'}
              showLy={compareWith === 'ly' || compareWith === 'both'}
            />
          </ChartContainer>
        </div>
        {isSupply && (
          <div className="col-span-2 h-full">
            <ChartContainer title="Conversion funnel" subtitle="Where guests leave the booking path · click a stage">
              <ConversionFunnel stages={scoped.funnelStages} onSelect={setStage} />
            </ChartContainer>
          </div>
        )}
      </div>

      {isSupply && (
        <div className="mt-4">
          <DataTable
            title={
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h3 className="text-sm font-semibold text-navy">Traffic and attribution</h3>
                {showInternalAttribution ? (
                  <p className="max-w-md text-xs leading-5 text-navy-muted sm:text-right">
                    Columns with the <span className="font-semibold text-navy">Internal</span> badge are for
                    account managers. They are hidden in Client preview and on shared report links.
                  </p>
                ) : null}
              </div>
            }
            columns={columns}
            rows={scoped.attributionRows}
            rowKey={(r) => r.source}
          />
        </div>
      )}

      <SideDrawer open={!!stage} title={stage?.label ?? 'Funnel stage'} onClose={() => setStage(null)}>
        {stage && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Stage definition</p>
              <p className="mt-1 text-navy">{stage.definition}</p>
            </div>
            {stage.dropOff != null && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Drop-off from previous stage</p>
                <p className="mt-1 text-lg font-semibold tabular text-navy">{stage.dropOff.toFixed(1)}%</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Device split</p>
              <ul className="mt-2 space-y-1">
                {stage.deviceSplit.map((d) => (
                  <li key={d.device} className="flex justify-between">
                    <span>{d.device}</span>
                    <span className="tabular">{d.share}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Top affected properties</p>
              <ul className="mt-2 space-y-1">
                {stage.properties.map((p) => (
                  <li key={p.name} className="flex justify-between">
                    <span>{p.name}</span>
                    <span className="tabular">{p.dropOff ? `${p.dropOff}% drop-off` : '—'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-ai-soft p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ai">Suggested action</p>
              <p className="mt-1">{stage.action}</p>
            </div>
          </div>
        )}
      </SideDrawer>
    </section>
  )
}
