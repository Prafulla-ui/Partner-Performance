import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-24 w-full rounded-lg border bg-[var(--ds-bg-elevated)] p-3 text-sm text-[var(--ds-text-primary)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ds-border-focus)]/35 disabled:opacity-50',
        invalid
          ? 'border-[var(--ds-feedback-error)]'
          : 'border-[var(--ds-border-default)] focus-visible:border-[var(--ds-border-focus)]',
        className,
      )}
      {...props}
    />
  )
})
