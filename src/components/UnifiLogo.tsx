import { Link } from 'react-router-dom'
import { cn } from '../design-system/utils/cn'

/** Shared UNIFI mark — brand tile with inverted U + wordmark. */
export function UnifiLogo({
  to = '/',
  compact = false,
  className,
}: {
  to?: string | false
  compact?: boolean
  className?: string
}) {
  const mark = (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--ds-brand-primary)] font-bold tracking-wide text-white',
        compact ? 'h-8 px-2 text-[11px]' : 'h-9 px-2.5 text-xs',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-md bg-white font-bold text-[var(--ds-brand-primary)]',
          compact ? 'h-4 w-4 text-[8px]' : 'h-5 w-5 text-[9px]',
        )}
      >
        U
      </span>
      UNIFI
    </span>
  )

  if (to === false) return mark
  return (
    <Link to={to} className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/40 rounded-lg" aria-label="UNIFI home">
      {mark}
    </Link>
  )
}
