import { ChartColumn, ExternalLink, Table2 } from 'lucide-react'
import { useState } from 'react'
import {
  channelCompareOptions,
  RevenueCommissionChart,
  type ChannelCompareMetric,
} from '../components/ChannelCharts'
import { GhostButton } from '../components/ui/Buttons'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { TrendIndicator } from '../components/ui/TrendIndicator'
import { formatCurrency, formatNumber } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'
import type { ChannelRow } from '../types'

type ChannelView = 'table' | 'chart'

const compareSubtitles: Record<ChannelCompareMetric, string> = {
  commission: 'Where production is expensive relative to yield',
  roomNights: 'Revenue against volume by channel',
  share: 'Revenue against each channel’s share of the mix',
  cancelRate: 'Revenue against cancellation quality by channel',
  commissionPct: 'Revenue against commission rate by channel',
  leadTime: 'Revenue against booking lead time by channel',
}

export function IndirectChannels() {
  const scoped = useScopedReportData()
  const [dashOpen, setDashOpen] = useState(false)
  const [view, setView] = useState<ChannelView>('table')
  const [compareMetric, setCompareMetric] = useState<ChannelCompareMetric>('commission')

  const columns: Column<ChannelRow>[] = [
    { key: 'ch', header: 'Channel', render: (r) => r.channel },
    { key: 'rn', header: 'Room nights', align: 'right', render: (r) => formatNumber(r.roomNights) },
    { key: 'rev', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
    { key: 'share', header: 'Revenue share', align: 'right', render: (r) => `${r.share.toFixed(1)}%` },
    { key: 'cp', header: 'Commission %', align: 'right', render: (r) => `${r.commissionPct}%` },
    { key: 'ca', header: 'Commission amount', align: 'right', render: (r) => formatCurrency(r.commission, true) },
    { key: 'ly', header: 'Revenue vs last year', align: 'right', render: (r) => <TrendIndicator value={r.vsLy} kind="pct" /> },
    { key: 'cx', header: 'Cancellation rate', align: 'right', render: (r) => `${r.cancelRate.toFixed(1)}%` },
    { key: 'lt', header: 'Average lead time', align: 'right', render: (r) => `${r.leadTime} days` },
  ]

  return (
    <section>
      <SectionHeader
        id="indirect-channels"
        moduleId="indirect"
        title="Indirect channel performance"
        description="OTA and wholesale production alongside commission."
        action={
          <GhostButton onClick={() => setDashOpen(true)}>
            <ExternalLink size={14} />
            Open source dashboard
          </GhostButton>
        }
      />

      <div className="mb-3 grid grid-cols-3 gap-3">
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs text-navy-muted">Total indirect revenue</p>
          <p className="mt-1 text-2xl font-semibold tabular">{scoped.summaryCards.indirectRevenue}</p>
        </article>
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs text-navy-muted">Total commission</p>
          <p className="mt-1 text-2xl font-semibold tabular">{scoped.summaryCards.commission}</p>
          <p className="text-[11px] uppercase tracking-wide text-ai">Estimate</p>
        </article>
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs text-navy-muted">OTA revenue share</p>
          <p className="mt-1 text-2xl font-semibold tabular">{scoped.summaryCards.otaShare}</p>
        </article>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-navy">Channel production</h3>
            <p className="mt-0.5 text-xs text-navy-muted">
              {view === 'table'
                ? 'Tabular view of OTA and wholesale production'
                : compareSubtitles[compareMetric]}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {view === 'chart' ? (
              <SegmentedControl
                value={compareMetric}
                onChange={setCompareMetric}
                options={channelCompareOptions}
              />
            ) : null}
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                {
                  value: 'table',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Table2 size={12} />
                      Table
                    </span>
                  ),
                },
                {
                  value: 'chart',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <ChartColumn size={12} />
                      Chart
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {view === 'table' ? (
          <DataTable columns={columns} rows={scoped.channelRows} rowKey={(r) => r.channel} />
        ) : (
          <div className="p-5">
            <RevenueCommissionChart rows={scoped.channelRows} compareMetric={compareMetric} />
          </div>
        )}
      </div>

      <ConfirmModal open={dashOpen} title="Open source dashboard" onClose={() => setDashOpen(false)}>
        <p className="text-sm text-navy-muted">
          In production this would deep-link to the channel-manager reporting module for Grand Meridian. This prototype
          keeps the jump in-app so the pitch can stay on one screen.
        </p>
      </ConfirmModal>
    </section>
  )
}
