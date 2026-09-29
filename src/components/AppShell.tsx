import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { ArrowLeft, ChevronDown, LogOut, User, type LucideIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../design-system/utils/cn'
import { UnifiLogo } from './UnifiLogo'

export interface AppNavItem {
  id: string
  label: string
  href: string
  active?: boolean
  muted?: boolean
  icon?: LucideIcon
  children?: AppNavItem[]
}

function ReportNavLink({ item }: { item: AppNavItem }) {
  const className = cn(
    'block py-1.5 text-left text-sm leading-5',
    item.active
      ? 'font-semibold text-[var(--ds-brand-primary)]'
      : item.muted
        ? 'font-normal text-navy-muted/40'
        : 'font-normal text-navy-muted underline-offset-2 hover:text-navy hover:underline',
  )

  const label = (
    <>
      {item.label}
      {item.muted ? <span className="ml-1 text-[10px]">· hidden</span> : null}
    </>
  )

  const scrollToSection = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!item.href.startsWith('#')) return
    const id = item.href.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    event.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', item.href)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  if (item.href.startsWith('/')) {
    return (
      <Link to={item.href} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <a href={item.href} className={className} onClick={scrollToSection}>
      {label}
    </a>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userMenuOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setUserMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [userMenuOpen])

  if (!user) return null

  function signOut() {
    setUserMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative ml-2 flex items-center gap-3" ref={userMenuRef}>
      <span className="hidden h-8 w-px shrink-0 bg-[var(--ds-border-strong)] sm:block" aria-hidden />
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-0.5 text-left transition-colors hover:bg-canvas"
        aria-haspopup="menu"
        aria-expanded={userMenuOpen}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setUserMenuOpen((open) => !open)}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ds-surface-muted)] text-navy-muted"
          aria-hidden
        >
          <User size={18} strokeWidth={1.75} />
        </span>
        <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-navy sm:inline">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 text-navy-muted transition-transform', userMenuOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {userMenuOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[220px] overflow-hidden rounded-xl border border-line bg-card py-1 shadow-[0_12px_28px_rgba(15,31,51,0.12)]"
        >
          <div className="border-b border-line px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-navy">{user.name}</p>
            <p className="mt-0.5 truncate text-xs text-navy-muted">{user.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-canvas"
            onClick={signOut}
          >
            <LogOut size={15} className="text-navy-muted" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function AppShell({
  contextLabel,
  contextBadge,
  title,
  titleBadge,
  description,
  meta,
  actions,
  toolbar,
  navItems = [],
  children,
  hideNav = false,
  backTo,
}: {
  contextLabel?: string
  contextBadge?: ReactNode
  title?: string
  titleBadge?: ReactNode
  description?: string
  meta?: ReactNode
  actions?: ReactNode
  /** Filter bar rendered in the main column under the header. */
  toolbar?: ReactNode
  navItems?: AppNavItem[]
  children: ReactNode
  hideNav?: boolean
  backTo?: { label: string; href: string }
}) {
  const headerRef = useRef<HTMLElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const updateStickyOffset = () => {
      const headerH = headerRef.current?.offsetHeight ?? 64
      const toolbarH = toolbarRef.current?.offsetHeight ?? 0
      const chrome = `${headerH + toolbarH}px`
      const scrollPad = `${headerH + toolbarH + 12}px`
      document.documentElement.style.setProperty('--report-chrome-height', chrome)
      document.documentElement.style.setProperty('--report-sticky-offset', scrollPad)
      document.documentElement.style.scrollPaddingTop = scrollPad
    }

    updateStickyOffset()
    const observer = new ResizeObserver(updateStickyOffset)
    if (headerRef.current) observer.observe(headerRef.current)
    if (toolbarRef.current) observer.observe(toolbarRef.current)
    window.addEventListener('resize', updateStickyOffset)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateStickyOffset)
      document.documentElement.style.removeProperty('--report-chrome-height')
      document.documentElement.style.removeProperty('--report-sticky-offset')
      document.documentElement.style.scrollPaddingTop = ''
    }
  }, [toolbar])

  const mainHeader = (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--ds-border-strong)] bg-[var(--ds-surface-muted)] px-6 sm:px-8"
    >
      <div className="flex min-w-0 items-center gap-3">
        {hideNav ? (
          <div className="min-w-0 shrink-0">
            <UnifiLogo to="/" compact />
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-muted">
              Partner platform
            </p>
          </div>
        ) : null}
        {backTo ? (
          <Link
            to={backTo.href}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-rg-blue hover:underline"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">{backTo.label}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        ) : null}
        {(backTo || hideNav) && contextLabel ? (
          <span className="hidden h-4 w-px shrink-0 bg-[var(--ds-border-strong)] sm:block" aria-hidden />
        ) : null}
        {contextLabel ? (
          <>
            <h1 className="hidden min-w-0 truncate text-base font-semibold tracking-tight text-navy sm:block">
              {contextLabel}
            </h1>
            {contextBadge ? <span className="hidden shrink-0 sm:inline-flex">{contextBadge}</span> : null}
          </>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        {actions && <div className="mr-1 hidden items-center gap-2 md:flex">{actions}</div>}
        <UserMenu />
      </div>
    </header>
  )

  const mainBody = (
    <>
      {toolbar ? (
        <div
          ref={toolbarRef}
          data-report-toolbar
          className="sticky top-16 z-30 shrink-0 border-b border-[var(--ds-border-default)] bg-[var(--ds-surface-muted)] px-6 py-3 sm:px-8"
        >
          {toolbar}
        </div>
      ) : null}

      <div className="min-w-0 flex-1 px-6 pb-16 pt-0 sm:px-8">
        {(title || description || titleBadge || meta) && (
          <div className="mb-4 pt-5">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                {(title || titleBadge) && (
                  <div className="flex flex-wrap items-center gap-2.5">
                    {title ? (
                      <h1 className="text-lg font-semibold leading-snug tracking-tight text-navy">{title}</h1>
                    ) : null}
                    {titleBadge}
                  </div>
                )}
                {description && (
                  <p className="mt-1 max-w-2xl text-sm leading-5 text-navy-muted">{description}</p>
                )}
              </div>
              {meta && <div className="shrink-0">{meta}</div>}
            </div>
          </div>
        )}
        <div className={title || description || titleBadge || meta ? '' : 'pt-5'}>{children}</div>
      </div>
    </>
  )

  /* Library / pages without report anchors — logo stays in the top header. */
  if (hideNav) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--ds-surface-muted)]">
        {mainHeader}
        {mainBody}
      </div>
    )
  }

  /* Report layout — reference: left report rail + main column (header, filters, content). */
  return (
    <div className="flex min-h-screen bg-[var(--ds-surface-muted)]">
      <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col self-start overflow-y-auto border-r border-[var(--ds-border-strong)] bg-[var(--ds-surface-muted)] px-4">
        <div className="flex h-16 shrink-0 items-center border-b border-[var(--ds-border-strong)]">
          <div className="min-w-0">
            <UnifiLogo to="/" compact />
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-muted">
              Partner platform
            </p>
          </div>
        </div>

        <p className="mb-3 mt-5 text-[10px] font-medium uppercase tracking-[0.12em] text-navy-muted/70">
          On this page
        </p>

        <nav aria-label="Report sections" className="flex flex-col gap-0.5 pb-8">
          {navItems.map((item) => (
            <ReportNavLink key={item.id} item={item} />
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {mainHeader}
        {mainBody}
      </div>
    </div>
  )
}
