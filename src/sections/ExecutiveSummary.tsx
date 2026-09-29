import { ChevronDown, ChevronRight, Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { GhostButton, PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TrendIndicator } from '../components/ui/TrendIndicator'
import { useAuth } from '../context/AuthContext'
import { useReport } from '../context/ReportContext'
import { useChartTheme } from '../lib/chartTheme'
import { formatCurrency } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'
import type { KpiMetric } from '../types'

type OnlineRevenueRow = {
  name: string
  amount: number
  amountLabel: string
  share: number
  color: string
  qoq: number
  yoy: number
}

type OpportunityRow = {
  title: string
  kind: string
  detail: string
  value: number
  kpiId: string
}

function OnlineRevenueCard({ rows }: { rows: OnlineRevenueRow[] }) {
  const { colors: chartColors } = useChartTheme()
  const { compareWith } = useReport()
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  const pieData = rows.map((row) => ({ name: row.name, value: row.share, color: row.color }))
  const showQoq = compareWith === 'previous' || compareWith === 'both'
  const showYoy = compareWith === 'ly' || compareWith === 'both'
  const showCompare = showQoq || showYoy

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-navy">Online revenue</h3>
        <p className="text-xs text-navy-muted">Direct, indirect, and GDS</p>
      </div>

      <div className="relative mx-auto h-[180px] w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={68}
              outerRadius={80}
              paddingAngle={2}
              stroke={chartColors.white}
              strokeWidth={3}
            >
              {pieData.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-muted">Total</p>
          <p className="text-xl font-semibold tabular text-navy">{formatCurrency(total, true)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
        {rows.map((row) => (
          <div key={row.name}>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy">
              <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
              {row.name}
            </p>
            <p className="mt-1 text-base font-semibold tabular text-navy">{row.amountLabel}</p>
            <p className="text-[11px] text-navy-muted">{row.share.toFixed(1)}%</p>
            {showCompare && (
              <div className="mt-1.5 space-y-0.5">
                {showQoq && (
                  <div className="flex items-center gap-1 text-[10px] text-navy-muted">
                    <span>QoQ</span>
                    <TrendIndicator value={row.qoq} kind="pct" />
                  </div>
                )}
                {showYoy && (
                  <div className="flex items-center gap-1 text-[10px] text-navy-muted">
                    <span>YoY</span>
                    <TrendIndicator value={row.yoy} kind="pct" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  )
}

function RevenueOpportunitiesCard({
  rows,
  kpis,
}: {
  rows: OpportunityRow[]
  kpis: KpiMetric[]
}) {
  const { compareWith, previousCompareName, lyCompareName } = useReport()
  const combined = rows.reduce((sum, row) => sum + row.value, 0)
  const kpiById = useMemo(() => new Map(kpis.map((k) => [k.id, k])), [kpis])
  const showQoq = compareWith === 'previous' || compareWith === 'both'
  const showYoy = compareWith === 'ly' || compareWith === 'both'

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy">Revenue opportunities</h3>
          <p className="mt-0.5 text-xs text-navy-muted">
            Current KPI → what fixing it could return this period
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted">Combined</p>
          <p className="text-base font-semibold tabular text-navy">{formatCurrency(combined, true)}</p>
        </div>
      </div>

      <ul className="flex-1 space-y-0 divide-y divide-line">
        {rows.map((row) => {
          const metric = kpiById.get(row.kpiId)
          const invert =
            metric?.id === 'ota-comm' ||
            metric?.id === 'parity-leak' ||
            metric?.id === 'cx' ||
            metric?.id === 'cancel'

          return (
            <li key={row.title} className="flex items-start justify-between gap-4 py-3 first:pt-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">{row.title}</p>
                {metric ? (
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[11px] text-navy-muted">{metric.label}</span>
                    <span className="text-sm font-semibold tabular text-navy">{metric.value}</span>
                    {showQoq && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-navy-muted">
                        <span>vs {previousCompareName}</span>
                        <TrendIndicator
                          value={metric.comparisons.qoq}
                          kind={metric.comparisons.kind}
                          invert={invert}
                        />
                      </span>
                    )}
                    {showYoy && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-navy-muted">
                        <span>vs {lyCompareName}</span>
                        <TrendIndicator
                          value={metric.comparisons.yoy}
                          kind={metric.comparisons.kind}
                          invert={invert}
                        />
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="mt-0.5 text-xs text-navy-muted">{row.kind}</p>
                )}
                <p className="mt-1 text-xs leading-5 text-navy-muted">{row.detail}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular text-navy">{formatCurrency(row.value, true)}</p>
                <p className="mt-0.5 text-[10px] text-navy-muted">{row.kind}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function ExecutiveSummary() {
  const { isHotelier } = useAuth()
  const {
    isSupply,
    isFullStack,
    isInternal,
    narrative,
    setNarrative,
    scopeLevel,
    maxScopeLevel,
    partnerName,
    activeScopeLabel,
    visibleBrands,
    goToScope,
    canDrillScope,
    selectedBrandId,
    shouldShowModule,
  } = useReport()
  const scoped = useScopedReportData()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(narrative)
  const [narrativeOpen, setNarrativeOpen] = useState(false)

  const showMixCards = isSupply && isFullStack

  const kpis = useMemo(
    () =>
      scoped.kpis.filter((k) => {
        if (k.id === 'content-score') return shouldShowModule('content-score')
        if (k.id === 'ai-visibility') return shouldShowModule('ai-visibility')
        return true
      }),
    [scoped.kpis, shouldShowModule],
  )

  const showDrill = canDrillScope && isSupply

  const canGoChain = maxScopeLevel === 'chain'
  const canGoBrand = maxScopeLevel === 'chain' || maxScopeLevel === 'brand'
  const activeBrandName = visibleBrands.find((b) => b.id === selectedBrandId)?.name

  return (
    <section>
      <SectionHeader
        id="scorecard"
        moduleId="scorecard"
        title="Executive summary"
      >
        {showDrill ? (
          <nav className="flex flex-wrap items-center gap-1 text-xs" aria-label="Scope breadcrumb">
            {canGoChain ? (
              <button
                type="button"
                className={`font-semibold ${scopeLevel === 'chain' ? 'text-navy' : 'text-rg-blue hover:underline'}`}
                onClick={() => goToScope('chain')}
              >
                {partnerName}
              </button>
            ) : (
              <span className="font-semibold text-navy-muted">{partnerName}</span>
            )}
            {(scopeLevel === 'brand' || scopeLevel === 'property') && activeBrandName && (
              <>
                <ChevronRight size={12} className="text-navy-muted" />
                {canGoBrand ? (
                  <button
                    type="button"
                    className={`font-semibold ${scopeLevel === 'brand' ? 'text-navy' : 'text-rg-blue hover:underline'}`}
                    onClick={() => goToScope('brand')}
                  >
                    {activeBrandName}
                  </button>
                ) : (
                  <span className="font-semibold text-navy">{activeBrandName}</span>
                )}
              </>
            )}
            {scopeLevel === 'property' && (
              <>
                <ChevronRight size={12} className="text-navy-muted" />
                <span className="font-semibold text-navy">{activeScopeLabel}</span>
              </>
            )}
            <span className="ml-2 inline-flex items-center rounded border border-line bg-card px-1.5 py-0.5 text-[10px] font-medium capitalize tracking-wide text-navy-muted">
              {scopeLevel} view
            </span>
          </nav>
        ) : null}
      </SectionHeader>

      <div className="scroll-x-hover mb-4 pb-1">
        <div className="flex w-max min-w-full gap-3">
          {kpis.map((metric) => (
            <div key={metric.id} className="w-[220px] shrink-0">
              <KpiCard metric={metric} />
            </div>
          ))}
        </div>
      </div>

      {showMixCards && (
        <div className="mb-4 grid grid-cols-2 items-stretch gap-3">
          <OnlineRevenueCard rows={scoped.onlineRevenue} />
          <RevenueOpportunitiesCard rows={scoped.revenueOpportunities} kpis={scoped.kpis} />
        </div>
      )}

      {showDrill && scopeLevel === 'property' && (
        <p className="mt-4 rounded-xl border border-line bg-card px-4 py-3 text-sm text-navy-muted">
          You are viewing <span className="font-semibold text-navy">{activeScopeLabel}</span>
          {isHotelier ? '. This is the deepest level for your hotelier access.' : '. Use the breadcrumb to move back up.'}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-card">
        <div className="flex w-full items-center justify-between gap-3 px-5 py-3.5">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 text-left hover:opacity-90"
            onClick={() => setNarrativeOpen((v) => !v)}
            aria-expanded={narrativeOpen}
          >
            <span className="text-sm font-semibold text-navy">Executive narrative</span>
            <ChevronDown
              size={16}
              className={`ml-auto shrink-0 text-navy-muted transition-transform ${narrativeOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isInternal && (
            <GhostButton
              onClick={() => {
                setDraft(narrative)
                setEditing(true)
              }}
            >
              <Pencil size={13} />
              Edit
            </GhostButton>
          )}
        </div>
        {narrativeOpen && (
          <div className="border-t border-line px-5 py-4 text-sm leading-6 text-navy">{narrative}</div>
        )}
      </div>

      <ConfirmModal
        open={editing}
        title="Edit executive narrative"
        onClose={() => setEditing(false)}
        footer={
          <>
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setNarrative(draft)
                setEditing(false)
              }}
            >
              Save narrative
            </PrimaryButton>
          </>
        }
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-line p-3 text-sm text-navy"
        />
      </ConfirmModal>
    </section>
  )
}
