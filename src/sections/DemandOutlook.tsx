import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useChartTheme } from '../lib/chartTheme'
import { useScopedReportData } from '../lib/scopedData'

const levelStyle = {
  High: 'bg-positive-soft text-positive',
  'Above average': 'bg-rg-blue-soft text-rg-blue',
  Soft: 'bg-warning-soft text-warning',
}

export function DemandOutlook() {
  const { colors: chartColors } = useChartTheme()
  const { demandMarkets } = useScopedReportData()

  return (
    <section>
      <SectionHeader
        id="demand-outlook"
        moduleId="outlook"
        title="Market demand outlook"
        description="Forward-looking 90-day demand. Index scored 1–100. Forecast, not actuals."
      />
      <div
        className={`grid gap-3 ${
          demandMarkets.length >= 3
            ? 'grid-cols-3'
            : demandMarkets.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-1'
        }`}
      >
        {demandMarkets.map((m) => (
          <article key={m.id} className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-navy">{m.market}</h3>
                <p className="mt-0.5 text-sm tabular text-navy">
                  <span className="font-semibold">{m.index}</span>
                  <span className="text-navy-muted"> / 100</span>
                </p>
              </div>
              <span
                className={`shrink-0 rounded border border-transparent px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${levelStyle[m.level]}`}
              >
                {m.level}
              </span>
            </div>

            <div className="my-3 h-12">
              <ResponsiveContainer>
                <LineChart data={m.trend.map((v, i) => ({ i, v }))}>
                  <Line type="monotone" dataKey="v" stroke={chartColors.primary} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="text-xs text-navy-muted">Events · peak</dt>
                <dd className="font-medium text-navy">
                  {m.events}
                  <span className="font-normal text-navy-muted"> · {m.peak}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-muted">Suggested posture</dt>
                <dd className="font-medium leading-5 text-navy">{m.posture}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}
