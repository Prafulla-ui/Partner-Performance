import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export function AiInsightCard({
  title,
  children,
  actions,
  defaultOpen = true,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
  /** @deprecated Kept for call-site compatibility; badge no longer shown. */
  estimate?: boolean
  /** When false, card starts collapsed. Default true for backward compatibility. */
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-card">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-[var(--ds-surface-muted)]"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h3 className="min-w-0 text-sm font-semibold text-navy">{title}</h3>
        <ChevronDown
          size={16}
          className={`shrink-0 text-navy-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-line px-5 py-4">
          {actions && <div className="mb-3 flex flex-wrap items-center gap-2">{actions}</div>}
          <div className="text-sm leading-6 text-navy">{children}</div>
        </div>
      )}
    </section>
  )
}
