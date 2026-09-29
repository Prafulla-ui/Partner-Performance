import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ds-text-primary)]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-end gap-3', className)}>{children}</div>
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3 rounded-[var(--ds-radius-2xl)] border border-[var(--ds-border-default)] bg-[var(--ds-bg-elevated)] p-5">
      <div>
        <h3 className="text-sm font-semibold text-[var(--ds-text-primary)]">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-[var(--ds-text-secondary)]">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--ds-text-secondary)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--ds-brand-primary)] border-r-transparent" />
      {label}
    </div>
  )
}

export function ErrorState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-[var(--ds-radius-xl)] border border-[var(--ds-feedback-error)]/30 bg-[var(--ds-feedback-error-soft)] px-4 py-3 text-sm text-[var(--ds-feedback-error)]">
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-0.5 opacity-90">{body}</p>}
    </div>
  )
}
