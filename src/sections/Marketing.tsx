import { OrganicSessionsChart, PaidSpendRevenueChart } from '../components/ChannelCharts'
import { ChartContainer } from '../components/ui/ChartContainer'
import { DataTable, type Column } from '../components/ui/DataTable'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useReport } from '../context/ReportContext'
import { formatCurrency, formatNumber } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'
import type { CampaignRow } from '../types'

export function Marketing() {
  const { isInternal, periodLabel } = useReport()
  const scoped = useScopedReportData()

  const columns: Column<CampaignRow>[] = [
    { key: 'name', header: 'Campaign', render: (r) => r.name },
    { key: 'book', header: 'Bookings', align: 'right', render: (r) => formatNumber(r.bookings) },
    { key: 'rev', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
  ]
  if (isInternal) {
    columns.splice(1, 0, { key: 'spend', header: 'Spend', align: 'right', render: (r) => formatCurrency(r.spend, true) })
    columns.push({ key: 'roas', header: 'ROAS', align: 'right', render: (r) => `${r.roas.toFixed(1)}x` })
  }

  return (
    <section>
      <SectionHeader
        id="marketing"
        moduleId="marketing"
        title="Digital marketing and SEO"
        description="Organic quality is compounding. Paid media remains efficient."
      />
      <div className="grid grid-cols-4 items-stretch gap-3">
        {scoped.marketingKpis.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ChartContainer
          title="Organic traffic trend"
          subtitle={`Sessions from unpaid search · ${periodLabel}`}
        >
          <OrganicSessionsChart data={scoped.organicTrend} />
        </ChartContainer>
        <ChartContainer
          title="Paid spend versus revenue"
          subtitle={
            isInternal
              ? `Internal media cost versus attributed revenue · ${periodLabel}`
              : `Attributed paid-media revenue · ${periodLabel}`
          }
        >
          <PaidSpendRevenueChart data={scoped.paidTrend} showSpend={isInternal} />
        </ChartContainer>
      </div>
      <div className="mt-4">
        <DataTable
          title={
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-navy">Campaign performance</h3>
              <span className="text-xs font-medium tabular text-navy-muted">
                {scoped.campaigns.length} campaigns
              </span>
            </div>
          }
          columns={columns}
          rows={scoped.campaigns}
          rowKey={(r) => r.name}
          maxBodyHeight={420}
        />
      </div>
    </section>
  )
}
