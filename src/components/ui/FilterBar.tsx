import { Check, ChevronDown, Search } from 'lucide-react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../design-system/utils/cn'

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-end gap-3">{children}</div>
}

export function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 text-xs font-medium text-navy-muted ${className}`}>
      <span>{label}</span>
      {children}
    </div>
  )
}

export function Select({
  value,
  onChange,
  options,
  disabled = false,
  searchable = true,
  searchPlaceholder,
  size = 'md',
  className = '',
  placeholder = 'Select',
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  size?: 'sm' | 'md'
  className?: string
  placeholder?: string
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})

  const selected = options.find((o) => o.value === value)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const updateMenuPosition = () => {
    const trigger = rootRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const width = Math.max(rect.width, 220)
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < 280 && rect.top > spaceBelow
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
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    if (!(searchable && options.length > 4)) return
    const t = window.setTimeout(() => searchRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open, searchable, options.length])

  const height = size === 'sm' ? 'h-8 text-xs' : 'h-9 text-sm'
  const searchLabel = searchPlaceholder ?? 'Search...'
  const showSearch = searchable && options.length > 4

  return (
    <div ref={rootRef} className={`relative ${className || 'min-w-[160px]'}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (!disabled) setOpen((v) => !v)
        }}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-card px-3 font-medium text-navy outline-none transition-colors focus-visible:ring-2 focus-visible:ring-rg-blue/30 disabled:cursor-not-allowed disabled:opacity-50 ${height} ${
          open ? 'border-rg-blue/40 ring-2 ring-rg-blue/15' : 'hover:border-[var(--ds-border-strong)]'
        }`}
      >
        <span className={`truncate ${selected ? 'text-navy' : 'text-navy-muted'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-navy-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={menuStyle}
              className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_12px_28px_rgba(15,31,51,0.12)]"
              role="presentation"
            >
              {showSearch ? (
                <>
                  <div className="p-2.5">
                    <div className="relative">
                      <Search
                        size={14}
                        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-muted"
                      />
                      <input
                        ref={searchRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchLabel}
                        className="h-9 w-full rounded-lg border-0 bg-canvas py-0 pl-8 pr-3 text-sm text-navy outline-none placeholder:text-navy-muted focus-visible:ring-2 focus-visible:ring-rg-blue/25"
                      />
                    </div>
                  </div>
                  <div className="h-px bg-line" />
                </>
              ) : null}

              <ul
                id={listId}
                role="listbox"
                aria-activedescendant={selected ? `${listId}-${value}` : undefined}
                className="max-h-56 overflow-y-auto p-1.5"
              >
                {filtered.length === 0 ? (
                  <li className="px-3 py-2.5 text-sm text-navy-muted">No matches</li>
                ) : (
                  filtered.map((opt) => {
                    const isSelected = opt.value === value
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        id={`${listId}-${opt.value}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onChange(opt.value)
                            setOpen(false)
                          }}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? 'bg-rg-blue-soft font-semibold text-rg-blue'
                              : 'font-medium text-navy hover:bg-canvas'
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected ? (
                            <Check size={15} className="shrink-0 text-rg-blue" strokeWidth={2.5} />
                          ) : null}
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'h-9 w-full rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-bg-elevated)] px-3 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/25',
        className,
      )}
    />
  )
}
