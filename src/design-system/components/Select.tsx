import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, invalid, disabled, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-9 w-full rounded-lg border bg-[var(--ds-bg-elevated)] py-0 pl-3 pr-8 text-sm text-[var(--ds-text-primary)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ds-border-focus)]/35 disabled:cursor-not-allowed disabled:opacity-50',
        invalid
          ? 'border-[var(--ds-feedback-error)]'
          : 'border-[var(--ds-border-default)] focus-visible:border-[var(--ds-border-focus)]',
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
})
