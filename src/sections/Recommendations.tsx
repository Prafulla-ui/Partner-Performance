import { useMemo } from 'react'
import { RecommendationCard } from '../components/ui/RecommendationCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useReport } from '../context/ReportContext'
import { formatCurrency } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'

export function Recommendations() {
  const { recommendations, isSupply } = useReport()
  const { scaleRecommendations } = useScopedReportData()

  const visible = useMemo(() => scaleRecommendations(recommendations), [recommendations, scaleRecommendations])

  const upside = visible.reduce((sum, r) => sum + r.impactValue, 0)

  return (
    <section>
      <SectionHeader
        id="recommendations"
        moduleId="recommendations"
        title="Growth recommendations"
        description={
          isSupply
            ? 'Ranked by estimated recoverable value. Impact values are estimates — not booked revenue.'
            : 'Joint growth actions that expand production quality. Impact values are estimates — not booked revenue.'
        }
        action={
          <div className="flex shrink-0 flex-col items-end">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-muted">
              Combined estimated upside
            </span>
            <p className="mt-0.5 text-xl font-semibold tabular text-navy sm:text-2xl">
              {formatCurrency(upside, true)}
              <span className="ml-1.5 text-sm font-medium text-navy-muted">next quarter</span>
            </p>
          </div>
        }
      />

      <div className="space-y-2">
        {visible.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </section>
  )
}
