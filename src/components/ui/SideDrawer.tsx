import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function SideDrawer({
  open,
  title,
  titleBadge,
  onClose,
  children,
  footer,
  width = 'max-w-md',
}: {
  open: boolean
  title: string
  titleBadge?: ReactNode
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
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button type="button" className="absolute inset-0 bg-navy/30" aria-label="Close drawer" onClick={onClose} />
      <aside
        className={`relative flex h-full w-full ${width} flex-col bg-card shadow-[0_16px_48px_rgba(15,31,51,0.2)]`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-navy">{title}</h2>
            {titleBadge}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-navy-muted hover:bg-canvas"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-line px-6 py-4">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  )
}
