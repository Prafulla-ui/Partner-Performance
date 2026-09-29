import { DataTable, type Column } from '../components/ui/DataTable'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formatCurrency, formatNumber } from '../lib/format'
import { useScopedReportData } from '../lib/scopedData'

export function DemandCoverage() {
  const { coverage } = useScopedReportData()

  const columns: Column<(typeof coverage)[number]>[] = [
    { key: 'm', header: 'Market', render: (r) => r.market },
    { key: 'p', header: 'Properties covered', align: 'right', render: (r) => `${r.properties}` },
    { key: 'b', header: 'Bookings', align: 'right', render: (r) => formatNumber(r.bookings) },
    { key: 'n', header: 'Room nights', align: 'right', render: (r) => formatNumber(r.nights) },
    { key: 'r', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
    {
      key: 'i',
      header: 'Est. incremental',
      align: 'right',
      render: (r) => (
        <span>
          {formatCurrency(r.incremental, true)}{' '}
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ai">Est.</span>
        </span>
      ),
    },
  ]

  return (
    <section>
      <SectionHeader
        id="indirect-channels"
        moduleId="indirect"
        title="Market and property coverage"
        description="Live production across the selected scope."
      />
      <DataTable title="Market coverage" columns={columns} rows={coverage} rowKey={(r) => r.market} />
    </section>
  )
}
