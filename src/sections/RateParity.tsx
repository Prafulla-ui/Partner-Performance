import { ExternalLink, FilePlus2, Search } from 'lucide-react'
import { useState } from 'react'
import { ChannelMixChart } from '../components/ChannelCharts'
import { AiInsightCard } from '../components/ui/AiInsightCard'
import { GhostButton, PrimaryButton } from '../components/ui/Buttons'
import { ChartContainer } from '../components/ui/ChartContainer'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useReport } from '../context/ReportContext'
import { useChartTheme } from '../lib/chartTheme'
import { formatCurrency, formatNumber } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'
import type { ParityOtaLoss } from '../types'

export function RateParity() {
  const { colors: chartColors } = useChartTheme()
  const { updateRecommendation, isInternal } = useReport()
  const { parityScore, parityLosses } = useScopedReportData()
  const [evidence, setEvidence] = useState(false)
  const [dash, setDash] = useState(false)
  const mix = [
    { name: 'Win', value: parityScore.win, color: chartColors.positive },
    { name: 'Meet', value: parityScore.meet, color: chartColors.tertiary },
    { name: 'Loss', value: parityScore.loss, color: chartColors.danger },
  ]

  const columns: Column<ParityOtaLoss>[] = [
    { key: 'ota', header: 'OTA', render: (r) => r.ota },
    { key: 'loss', header: 'Loss events', align: 'right', render: (r) => formatNumber(r.lossEvents) },
    { key: 'cut', header: 'Average undercut', align: 'right', render: (r) => `${r.avgUndercut.toFixed(1)}%` },
    { key: 'prop', header: 'Worst property', render: (r) => r.worstProperty },
  ]

  return (
    <section>
      <SectionHeader
        id="rate-parity"
        moduleId="parity"
        title="Rate parity and competitiveness"
        description={`Win rate is ${parityScore.target - parityScore.win} points below the ${parityScore.target}% target.`}
      />
      <div className="grid grid-cols-5 gap-3">
        <Score label="Parity checks" value={formatNumber(parityScore.checks)} />
        <Score label="Win rate" value={`${parityScore.win}%`} note={`Target ${parityScore.target}%`} />
        <Score label="Loss / meet rate" value={`${parityScore.loss}% / ${parityScore.meet}%`} />
        <Score label="Average undercut" value={`${parityScore.undercut}%`} />
        <Score
          label="Estimated direct revenue leakage"
          value={formatCurrency(parityScore.leakage, true)}
          estimate
        />
      </div>

      <div className="mt-4 grid grid-cols-2 items-stretch gap-3">
        <ChartContainer title="Win, meet and loss mix" subtitle={`Share of ${formatNumber(parityScore.checks)} parity checks`}>
          <div className="flex h-full min-h-[280px] items-center">
            <ChannelMixChart
              data={mix}
              centerLabel="Checks"
              centerValue={formatNumber(parityScore.checks)}
              unit="of parity checks"
            />
          </div>
        </ChartContainer>
        <DataTable title="OTA loss table" columns={columns} rows={parityLosses} rowKey={(r) => r.ota} />
      </div>

      <div className="mt-4">
        <AiInsightCard
          title="Root-cause insight"
          estimate
          defaultOpen={false}
          actions={
            <div className="flex gap-2">
              <GhostButton onClick={() => setEvidence(true)}>
                <Search size={13} />
                View evidence
              </GhostButton>
              <GhostButton onClick={() => setDash(true)}>
                <ExternalLink size={13} />
                Open parity dashboard
              </GhostButton>
              {isInternal && (
                <GhostButton
                  onClick={() =>
                    updateRecommendation('r1', { status: 'accepted', customerVisible: true })
                  }
                >
                  <FilePlus2 size={13} />
                  Create recommendation
                </GhostButton>
              )}
            </div>
          }
        >
          61% of Agoda undercuts are associated with unmapped mobile-only rates, while another 24% appear connected to
          wholesale leakage through two B2B partners. This is a modelled estimate from SHIELD / BPA patterns, not a
          confirmed booking-level audit.
        </AiInsightCard>
      </div>

      <ConfirmModal open={evidence} title="Parity evidence (demo)" onClose={() => setEvidence(false)}>
        <p className="text-sm leading-6 text-navy">
          Sample of 200 Agoda loss events on GM Bangkok Riverside shows mobile-only member rates live on Agoda and
          unmapped in the booking engine. A second cluster traces to two wholesale partners whose contracted BAR leaked
          into public OTA cache.
        </p>
      </ConfirmModal>
      <ConfirmModal
        open={dash}
        title="Open parity dashboard"
        onClose={() => setDash(false)}
        footer={<PrimaryButton onClick={() => setDash(false)}>Stay in report</PrimaryButton>}
      >
        <p className="text-sm text-navy-muted">
          Production would open the weekly parity digest and SHIELD feed. This prototype keeps reviewers on the unified
          report.
        </p>
      </ConfirmModal>
    </section>
  )
}

function Score({ label, value, note, estimate }: { label: string; value: string; note?: string; estimate?: boolean }) {
  return (
    <article className="surface-card rounded-2xl p-4">
      <p className="text-xs text-navy-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular text-navy">{value}</p>
      {note && <p className="mt-1 text-xs text-navy-muted">{note}</p>}
      {estimate && <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-ai">Estimate</p>}
    </article>
  )
}
