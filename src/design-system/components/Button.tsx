import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--ds-brand-primary)] text-white hover:bg-[var(--ds-interactive-active)]',
  secondary:
    'border border-[var(--ds-border-default)] bg-card text-[var(--ds-text-primary)] hover:bg-[var(--ds-surface-muted)]',
  ghost:
    'text-[var(--ds-brand-primary)] hover:bg-[var(--ds-brand-primary-soft)]',
  destructive:
    'bg-[var(--ds-feedback-error)] text-white hover:brightness-110',
  link: 'h-auto px-0 text-[var(--ds-brand-primary)] underline-offset-2 hover:underline',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
  md: 'h-9 gap-2 rounded-lg px-4 text-sm',
  lg: 'h-11 gap-2 rounded-lg px-5 text-sm',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-[filter,background-color,opacity] duration-[var(--ds-duration-fast)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ds-border-focus)]/40 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        variant !== 'link' && sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
})
