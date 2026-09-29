import { Clock3 } from 'lucide-react'

export function DataFreshness({ label, stale = false }: { label: string; stale?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${stale ? 'text-warning' : 'text-navy-muted'}`}
      title={stale ? 'Last updated more than 24 hours ago' : 'Data is current for this mock'}
    >
      <Clock3 size={13} />
      {stale ? `Stale — ${label}` : label}
    </span>
  )
}
