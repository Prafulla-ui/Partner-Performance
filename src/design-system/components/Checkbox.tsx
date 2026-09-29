import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-start gap-2 text-sm text-[var(--ds-text-primary)]', className)}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-[var(--ds-border-default)] text-[var(--ds-brand-primary)] focus-visible:ring-[var(--ds-border-focus)]"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}

export function Switch({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-[var(--ds-text-primary)]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ds-border-focus)]/40 disabled:opacity-50',
          checked ? 'bg-[var(--ds-brand-primary)]' : 'bg-[var(--ds-border-strong)]',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-card transition-transform',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>
      <span aria-hidden>{label}</span>
    </div>
  )
}
