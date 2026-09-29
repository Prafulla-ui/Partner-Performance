import { AlertCircle, Clock, Database, Link2, Layers, Plug } from 'lucide-react'
import type { DataStateKind } from '../../types'

const copy: Record<DataStateKind, { title: string; body: string; Icon: typeof Database }> = {
  unavailable: {
    title: 'Data unavailable',
    body: 'This metric could not be assembled for the selected period. No value is shown because the source did not return a result.',
    Icon: Database,
  },
  not_subscribed: {
    title: 'Product not subscribed',
    body: 'This partner does not currently include this product. The section is omitted from the customer-facing view.',
    Icon: Layers,
  },
  integration: {
    title: 'Integration required',
    body: 'A source connection is needed before this section can populate automatically.',
    Icon: Plug,
  },
  processing: {
    title: 'Data processing',
    body: 'Overnight chain roll-up is still running for one or more properties.',
    Icon: Clock,
  },
  partial: {
    title: 'Partial property coverage',
    body: '8 of 12 properties are included in this roll-up. Remaining properties are still migrating.',
    Icon: Link2,
  },
  stale: {
    title: 'Last updated more than 24 hours ago',
    body: 'Treat these figures as directional until the next scheduled refresh.',
    Icon: AlertCircle,
  },
}

export function EmptyState({
  kind,
  compact = false,
  customerSafe = false,
}: {
  kind: DataStateKind
  compact?: boolean
  customerSafe?: boolean
}) {
  if (customerSafe && (kind === 'not_subscribed' || kind === 'integration')) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-card px-4 py-6 text-sm text-navy-muted">
        This section is not included in the shared report.
      </div>
    )
  }

  const item = copy[kind]
  return (
    <div
      className={`rounded-xl border border-dashed border-line bg-card text-navy-muted ${compact ? 'px-3 py-3' : 'px-4 py-8'}`}
    >
      <div className="flex items-start gap-3">
        <item.Icon size={18} className="mt-0.5 text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-navy">{item.title}</p>
          <p className={`mt-1 text-sm ${compact ? 'max-w-xl' : 'max-w-2xl'}`}>{item.body}</p>
        </div>
      </div>
    </div>
  )
}
