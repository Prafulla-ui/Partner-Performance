import { Info } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const TIP_WIDTH = 256
const STICKY_TOP_CLEARANCE = 130

export function MetricTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; placement: 'above' | 'below' } | null>(
    null,
  )
  const wrapRef = useRef<HTMLSpanElement>(null)
  const tipId = useId()

  const updatePosition = () => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const tipHeight = 72
    const spaceAbove = rect.top - STICKY_TOP_CLEARANCE
    const placement: 'above' | 'below' = spaceAbove >= tipHeight + 8 ? 'above' : 'below'
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - TIP_WIDTH - 8)
    setCoords({
      top: placement === 'above' ? rect.top - 8 : rect.bottom + 8,
      left,
      placement,
    })
  }

  const show = () => {
    updatePosition()
    setOpen(true)
  }

  const hide = () => setOpen(false)

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const onScroll = () => updatePosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <span
      className="relative inline-flex"
      ref={wrapRef}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type="button"
        className="text-navy-muted hover:text-rg-blue"
        aria-label="Metric definition"
        aria-describedby={open ? tipId : undefined}
        onFocus={show}
        onBlur={hide}
      >
        <Info size={13} />
      </button>
      {open &&
        coords &&
        createPortal(
          <span
            id={tipId}
            role="tooltip"
            className="pointer-events-none fixed w-64 rounded-lg border border-line bg-card p-2.5 text-xs leading-5 text-navy shadow-[0_12px_28px_rgb(15_31_51/0.18)]"
            style={{
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
              transform: coords.placement === 'above' ? 'translateY(-100%)' : undefined,
            }}
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  )
}
