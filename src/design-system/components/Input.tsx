import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, disabled, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full rounded-lg border bg-[var(--ds-bg-elevated)] px-3 text-sm text-[var(--ds-text-primary)] outline-none transition-colors placeholder:text-[var(--ds-text-disabled)] focus-visible:ring-[3px] focus-visible:ring-[var(--ds-border-focus)]/35 disabled:cursor-not-allowed disabled:opacity-50',
        invalid
          ? 'border-[var(--ds-feedback-error)]'
          : 'border-[var(--ds-border-default)] focus-visible:border-[var(--ds-border-focus)]',
        className,
      )}
      {...props}
    />
  )
})
