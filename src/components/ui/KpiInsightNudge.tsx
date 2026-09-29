import { ArrowRight, ShieldAlert, X } from 'lucide-react'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KpiInsight } from '../../data/kpiInsights'
import { PrimaryButton, SecondaryButton } from './Buttons'
import { SideDrawer } from './SideDrawer'

const POPOVER_WIDTH = 280
/** Estimated popover height before measure — used for flip decision */
const POPOVER_EST_HEIGHT = 200
/** Sticky header + filter bar clearance from viewport top */
const STICKY_TOP_CLEARANCE = 130

type Placement = 'above' | 'below'

export function KpiInsightNudge({ insight }: { insight: KpiInsight }) {
  const [popover, setPopover] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; placement: Placement } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popoverId = useId()

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const updatePosition = () => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const measured = popoverRef.current?.offsetHeight ?? POPOVER_EST_HEIGHT
    const spaceAbove = rect.top - STICKY_TOP_CLEARANCE
    const spaceBelow = window.innerHeight - rect.bottom - 16
    const placement: Placement =
      spaceAbove >= measured + 12 || spaceAbove >= spaceBelow ? 'above' : 'below'

    const left = Math.min(
      Math.max(8, rect.right - POPOVER_WIDTH),
      window.innerWidth - POPOVER_WIDTH - 8,
    )

    setCoords({
      top: placement === 'above' ? rect.top - 12 : rect.bottom + 12,
      left,
      placement,
    })
  }

  const openPopover = () => {
    clearCloseTimer()
    updatePosition()
    setPopover(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setPopover(false), 150)
  }

  useLayoutEffect(() => {
    if (!popover) return
    updatePosition()
    // Re-measure after paint so flip uses real height
    const raf = requestAnimationFrame(() => updatePosition())
    const onScroll = () => updatePosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [popover])

  useEffect(() => {
    return () => clearCloseTimer()
  }, [])

  useEffect(() => {
    if (!popover) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopover(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [popover])

  return (
    <div
      className="relative z-10"
      ref={wrapRef}
      onMouseEnter={openPopover}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={popover}
        aria-controls={popoverId}
        aria-label={`${insight.eyebrow}: ${insight.riskLabel}`}
        onFocus={openPopover}
        onBlur={scheduleClose}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-warning-soft text-warning hover:bg-[#fde68a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/40"
      >
        <ShieldAlert size={13} />
      </button>

      {popover &&
        coords &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="tooltip"
            aria-label={insight.eyebrow}
            className="pointer-events-auto fixed w-[280px] rounded-2xl bg-[var(--ds-brand-primary)] p-4 text-white shadow-[0_16px_40px_rgb(15_31_51/0.35)]"
            style={{
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
              transform: coords.placement === 'above' ? 'translateY(-100%)' : undefined,
            }}
            onMouseEnter={openPopover}
            onMouseLeave={scheduleClose}
          >
            <span
              className={`absolute right-3 h-3 w-3 rotate-45 bg-[var(--ds-brand-primary)] ${
                coords.placement === 'above' ? '-bottom-1.5' : '-top-1.5'
              }`}
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                {insight.eyebrow}
              </p>
              <button
                type="button"
                className="rounded-full p-0.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close insight"
                onClick={() => setPopover(false)}
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-2 text-lg font-semibold leading-snug">{insight.riskLabel}</p>
            <p className="mt-1.5 text-xs leading-5 text-white/80">{insight.summary}</p>
            <button
              type="button"
              className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-card text-sm font-semibold text-[var(--ds-brand-primary)]"
              onClick={() => {
                setPopover(false)
                setDrawer(true)
              }}
            >
              View recommendation
              <ArrowRight size={14} />
            </button>
          </div>,
          document.body,
        )}

      <SideDrawer
        open={drawer}
        title={insight.eyebrow}
        onClose={() => setDrawer(false)}
        width="max-w-lg"
        footer={
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setDrawer(false)}>Close</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setDrawer(false)
                document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Go to recommendations
            </PrimaryButton>
          </div>
        }
      >
        <p className="text-2xl font-semibold tracking-tight text-navy">{insight.riskLabel}</p>
        <p className="mt-1 text-xs font-medium text-navy-muted">Suggested owner · {insight.owner}</p>

        <section className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-muted">What has happened</h3>
          <p className="mt-1.5 text-sm leading-6 text-navy">{insight.problem}</p>
        </section>
        <section className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-muted">Why it matters</h3>
          <p className="mt-1.5 text-sm leading-6 text-navy">{insight.whyItMatters}</p>
        </section>
        <section className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-muted">Likely causes</h3>
          <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-sm leading-6 text-navy">
            {insight.causes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="mt-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-muted">How to measure the result</h3>
          <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-sm leading-6 text-navy">
            {insight.measure.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </SideDrawer>
    </div>
  )
}
