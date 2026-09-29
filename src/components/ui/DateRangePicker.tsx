import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDisplayDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function parseIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

export function DateRangePicker({
  from,
  to,
  onChange,
  placeholder = 'Select date range',
  allowClear = false,
  size = 'md',
  className = '',
}: {
  from: string
  to: string
  onChange: (from: string, to: string) => void
  placeholder?: string
  allowClear?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  const hasRange = Boolean(from && to)
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => {
    if (from) {
      const p = parseIso(from)
      return { y: p.y, m: p.m }
    }
    return { y: 2026, m: 5 }
  })
  const [draftFrom, setDraftFrom] = useState(from)
  const [draftTo, setDraftTo] = useState(to)
  const [picking, setPicking] = useState<'start' | 'end'>('start')
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setDraftFrom(from)
    setDraftTo(to)
    setPicking('start')
    if (from) {
      const p = parseIso(from)
      setCursor({ y: p.y, m: p.m })
    }
  }, [open, from, to])

  const updateMenuPosition = () => {
    const trigger = rootRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const width = 280
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < 320 && rect.top > spaceBelow
    setMenuStyle({
      position: 'fixed',
      left: Math.min(rect.left, window.innerWidth - width - 8),
      width,
      zIndex: 110,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
    })
  }

  useLayoutEffect(() => {
    if (!open) return
    updateMenuPosition()
    const onReposition = () => updateMenuPosition()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const cells = useMemo(() => {
    const firstDow = new Date(cursor.y, cursor.m, 1).getDay()
    const total = daysInMonth(cursor.y, cursor.m)
    const list: ({ day: number; iso: string } | null)[] = []
    for (let i = 0; i < firstDow; i++) list.push(null)
    for (let d = 1; d <= total; d++) list.push({ day: d, iso: toIso(cursor.y, cursor.m, d) })
    return list
  }, [cursor])

  const pick = (iso: string) => {
    if (picking === 'start' || !draftFrom || iso < draftFrom) {
      setDraftFrom(iso)
      setDraftTo(iso)
      setPicking('end')
      return
    }
    setDraftTo(iso)
    onChange(draftFrom, iso)
    setOpen(false)
  }

  const inRange = (iso: string) => Boolean(draftFrom && draftTo && iso >= draftFrom && iso <= draftTo)
  const isEdge = (iso: string) => iso === draftFrom || iso === draftTo

  const triggerClass =
    size === 'sm'
      ? 'inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-xs font-semibold text-navy hover:bg-rg-blue-soft/40'
      : 'inline-flex h-9 w-full min-w-[220px] items-center gap-1.5 rounded-lg border border-line bg-card px-3 text-sm font-medium text-navy outline-none hover:bg-rg-blue-soft/40 focus-visible:ring-2 focus-visible:ring-rg-blue/30'

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => setOpen((v) => !v)} className={triggerClass}>
          <CalendarDays size={size === 'sm' ? 13 : 14} className="shrink-0 text-navy-muted" />
          <span className="truncate">
            {hasRange ? `${formatDisplayDate(from)} – ${formatDisplayDate(to)}` : placeholder}
          </span>
        </button>
        {allowClear && hasRange && (
          <button
            type="button"
            aria-label="Clear date range"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy-muted hover:bg-card hover:text-navy"
            onClick={() => onChange('', '')}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={menuStyle}
              className="rounded-xl border border-line bg-card p-3 shadow-[0_12px_28px_rgba(15,31,51,0.12)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  className="rounded-lg p-1 text-navy-muted hover:bg-canvas"
                  onClick={() =>
                    setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))
                  }
                  aria-label="Previous month"
                >
                  <ChevronLeft size={14} />
                </button>
                <p className="text-xs font-semibold text-navy">
                  {MONTHS[cursor.m]} {cursor.y}
                </p>
                <button
                  type="button"
                  className="rounded-lg p-1 text-navy-muted hover:bg-canvas"
                  onClick={() =>
                    setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))
                  }
                  aria-label="Next month"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <p className="mb-2 text-[11px] text-navy-muted">
                {picking === 'start' ? 'Select start date' : 'Select end date'}
                {draftFrom && (
                  <span className="ml-1 font-semibold text-navy">
                    {formatDisplayDate(draftFrom)}
                    {draftTo ? ` – ${formatDisplayDate(draftTo)}` : ''}
                  </span>
                )}
              </p>

              <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase text-navy-muted">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((cell, i) =>
                  cell ? (
                    <button
                      key={cell.iso}
                      type="button"
                      onClick={() => pick(cell.iso)}
                      className={`h-8 rounded-lg text-xs font-medium transition-colors ${
                        isEdge(cell.iso)
                          ? 'bg-rg-blue text-white'
                          : inRange(cell.iso)
                            ? 'bg-rg-blue-soft text-rg-blue'
                            : 'text-navy hover:bg-canvas'
                      }`}
                    >
                      {cell.day}
                    </button>
                  ) : (
                    <span key={`e-${i}`} />
                  ),
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
