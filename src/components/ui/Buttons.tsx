import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function PrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--ds-brand-primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--ds-interactive-active)] disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-card px-4 text-sm font-semibold text-navy hover:bg-[var(--ds-surface-muted)] disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-rg-blue hover:bg-rg-blue-soft ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
