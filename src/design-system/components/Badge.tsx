import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--ds-surface-muted)] text-[var(--ds-text-secondary)]',
  brand: 'bg-[var(--ds-brand-primary-soft)] text-[var(--ds-brand-primary)]',
  success: 'bg-[var(--ds-feedback-success-soft)] text-[var(--ds-feedback-success)]',
  warning: 'bg-[var(--ds-feedback-warning-soft)] text-[var(--ds-feedback-warning)]',
  danger: 'bg-[var(--ds-feedback-error-soft)] text-[var(--ds-feedback-error)]',
  info: 'bg-[var(--ds-feedback-info-soft)] text-[var(--ds-feedback-info)]',
}

export function Badge({
  tone = 'neutral',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
