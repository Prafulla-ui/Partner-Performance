import { AlertTriangle, ChevronRight } from 'lucide-react'
import { useChartTheme } from '../lib/chartTheme'
import { formatNumber } from '../lib/format'
import type { FunnelStage } from '../types'

export function ConversionFunnel({
  stages,
  onSelect,
}: {
  stages: FunnelStage[]
  onSelect: (stage: FunnelStage) => void
}) {
  const { colors: chartColors, gradients: chartGradients } = useChartTheme()
  const max = stages[0]?.value ?? 1
  const primaryGradient = `linear-gradient(90deg, ${chartGradients.primaryBar.from}, ${chartGradients.primaryBar.to})`
  const accentGradient = `linear-gradient(90deg, ${chartGradients.accentBar.from}, ${chartGradients.accentBar.to})`

  return (
    <div className="flex h-full min-h-[360px] flex-col justify-center gap-3 py-1">
      {stages.map((stage) => {
        const fillPct = Math.max(4, (stage.value / max) * 100)
        const isLeak = Boolean(stage.highlight)

        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage)}
            aria-label={`View details for ${stage.label}`}
            className={`group w-full rounded-lg px-2 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/35 focus-visible:ring-offset-2 ${
              isLeak
                ? 'bg-warning-soft/60 ring-1 ring-warning/25 hover:bg-warning-soft hover:ring-warning/40'
                : 'hover:bg-canvas'
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span
                  className={`text-[11px] font-semibold ${
                    isLeak ? 'text-warning underline decoration-warning/40 underline-offset-2' : 'text-navy'
                  }`}
                >
                  {stage.label}
                </span>
                {isLeak && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-card px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-warning">
                    <AlertTriangle size={9} />
                    Largest leak
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2 text-[11px]">
                <span className="font-semibold tabular text-navy">{formatNumber(stage.value)}</span>
                {stage.dropOff != null ? (
                  <span className="tabular text-danger">−{stage.dropOff.toFixed(1)}%</span>
                ) : (
                  <span className="tabular text-navy-muted">100%</span>
                )}
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold ${
                    isLeak
                      ? 'text-warning'
                      : 'text-rg-blue opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  View
                  <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>

            <div
              className={`h-1 overflow-hidden rounded-full ${isLeak ? 'ring-1 ring-warning/25' : ''}`}
              style={{ background: chartColors.track }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-300 group-hover:brightness-95"
                style={{
                  width: `${fillPct}%`,
                  background: isLeak ? accentGradient : primaryGradient,
                }}
              />
            </div>
          </button>
        )
      })}

      <p className="mt-1 text-center text-[11px] text-navy-muted">
        Bar length = share of site sessions · click a stage for detail
      </p>
    </div>
  )
}
