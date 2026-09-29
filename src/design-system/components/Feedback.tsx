import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-[var(--ds-border-default)]', className)} />
}

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--ds-brand-primary)] border-r-transparent',
        className,
      )}
    />
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-[var(--ds-radius-md)] bg-[var(--ds-surface-muted)]', className)}
    />
  )
}

export type AlertTone = 'info' | 'success' | 'warning' | 'error'

const alertTone: Record<AlertTone, string> = {
  info: 'border-[var(--ds-feedback-info)]/30 bg-[var(--ds-feedback-info-soft)] text-[var(--ds-feedback-info)]',
  success:
    'border-[var(--ds-feedback-success)]/30 bg-[var(--ds-feedback-success-soft)] text-[var(--ds-feedback-success)]',
  warning:
    'border-[var(--ds-feedback-warning)]/30 bg-[var(--ds-feedback-warning-soft)] text-[var(--ds-feedback-warning)]',
  error: 'border-[var(--ds-feedback-error)]/30 bg-[var(--ds-feedback-error-soft)] text-[var(--ds-feedback-error)]',
}

export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: AlertTone
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div role="status" className={cn('rounded-[var(--ds-radius-lg)] border px-3 py-2.5 text-sm', alertTone[tone], className)}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string
  body?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-[var(--ds-radius-2xl)] border border-dashed border-[var(--ds-border-default)] bg-[var(--ds-bg-elevated)] px-6 py-10 text-center',
        className,
      )}
    >
      <p className="text-sm font-semibold text-[var(--ds-text-primary)]">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-md text-sm text-[var(--ds-text-secondary)]">{body}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

export function Tabs({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex rounded-[var(--ds-radius-lg)] bg-[var(--ds-surface-muted)] p-1', className)}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-[var(--ds-radius-md)] px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focus)]',
              active
                ? 'bg-[var(--ds-bg-elevated)] text-[var(--ds-text-primary)] shadow-sm'
                : 'text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-[var(--ds-z-dropdown)] mb-1 hidden w-48 -translate-x-1/2 rounded-[var(--ds-radius-md)] bg-[var(--ds-bg-inverse)] px-2 py-1.5 text-[11px] font-medium text-[var(--ds-text-inverse)] group-hover:block group-focus-within:block"
      >
        {text}
      </span>
    </span>
  )
}

export function Table({
  headers,
  rows,
  className,
}: {
  headers: string[]
  rows: ReactNode[][]
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto rounded-[var(--ds-radius-2xl)] border border-[var(--ds-border-default)]', className)}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-[var(--ds-border-default)] bg-[var(--ds-surface-muted)] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ds-text-secondary)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-[var(--ds-bg-elevated)]' : 'bg-[var(--ds-surface-muted)]/60'}>
              {row.map((cell, j) => (
                <td key={j} className="border-b border-[var(--ds-border-subtle)] px-4 py-3 text-[var(--ds-text-primary)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Link({
  href,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        'font-semibold text-[var(--ds-brand-primary)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focus)]',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
