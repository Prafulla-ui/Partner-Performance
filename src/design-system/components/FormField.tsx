import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

export function Label({
  className,
  required,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean; children: ReactNode }) {
  return (
    <label
      className={cn('block text-xs font-semibold text-[var(--ds-text-secondary)]', className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[var(--ds-feedback-error)]" aria-hidden>
          *
        </span>
      )}
    </label>
  )
}

export function HelperText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('mt-1 text-xs text-[var(--ds-text-secondary)]', className)}>{children}</p>
}

export function ErrorMessage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn('mt-1 text-sm text-[var(--ds-feedback-error)]', className)}>
      {children}
    </p>
  )
}

export function FormField({
  label,
  htmlFor,
  required,
  helper,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  helper?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <Label htmlFor={htmlFor} required={required} className="mb-1">
        {label}
      </Label>
      {children}
      {error ? <ErrorMessage>{error}</ErrorMessage> : helper ? <HelperText>{helper}</HelperText> : null}
    </div>
  )
}
