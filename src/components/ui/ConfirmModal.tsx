import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function ConfirmModal({
  open,
  title,
  children,
  onClose,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  width?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <button type="button" className="absolute inset-0 bg-navy/30" aria-label="Close dialog" onClick={onClose} />
      <div className={`relative w-full ${width} rounded-2xl bg-card shadow-[0_24px_60px_rgba(15,31,51,0.18)]`}>
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-navy">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-navy-muted hover:bg-canvas">
            <X size={18} />
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-line px-5 py-3">{footer}</footer>}
      </div>
    </div>
  )
}
