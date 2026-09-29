import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

export function Card({
  className,
  children,
  padded = true,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode; padded?: boolean }) {
  return (
    <section
      className={cn(
        'rounded-[var(--ds-radius-2xl)] bg-[var(--ds-surface-default)]',
        padded && 'p-5',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-[var(--ds-text-primary)]">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-[var(--ds-text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
