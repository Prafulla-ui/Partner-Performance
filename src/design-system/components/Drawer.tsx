import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { IconButton } from './IconButton'

export function Drawer({
  open,
  title,
  onClose,
  children,
  footer,
  width = 'max-w-md',
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[var(--ds-z-overlay)] flex justify-end" role="presentation">
      <button type="button" className="absolute inset-0 bg-[var(--ds-bg-inverse)]/30" aria-label="Close drawer" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative flex h-full w-full flex-col bg-[var(--ds-bg-elevated)] shadow-[var(--ds-shadow-lg)]',
          width,
        )}
      >
        <header className="flex items-center justify-between border-b border-[var(--ds-border-default)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--ds-text-primary)]">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="border-t border-[var(--ds-border-default)] px-5 py-4">{footer}</footer>
        )}
      </aside>
    </div>
  )
}
