import {
  CalendarRange,
  ChartColumn,
  Check,
  ChevronDown,
  Copy,
  Download,
  Globe2,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Pencil,
  Scale,
  Share2,
  Eye,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ComparisonSelector } from '../components/ui/ComparisonSelector'
import { DownloadReportModal } from '../components/DownloadReportModal'
import { EditReportModal } from '../components/EditReportModal'
import { EmptyState } from '../components/ui/EmptyState'
import { ShareReportModal } from '../components/ShareReportModal'
import { PeriodSelector } from '../components/ui/PeriodSelector'
import { Select } from '../components/ui/FilterBar'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { useAuth } from '../context/AuthContext'
import { useReport } from '../context/ReportContext'
import { libraryReports, getPartnerHierarchy } from '../data/grandMeridian'
import { DemandCoverage } from '../sections/DemandCoverage'
import { DemandOutlook } from '../sections/DemandOutlook'
import { DirectPerformance } from '../sections/DirectPerformance'
import { ExecutiveSummary } from '../sections/ExecutiveSummary'
import { IndirectChannels } from '../sections/IndirectChannels'
import { Marketing } from '../sections/Marketing'
import { RateParity } from '../sections/RateParity'
import { Recommendations } from '../sections/Recommendations'
import type { ViewMode } from '../types'

export function ReportDetail({ publicView = false }: { publicView?: boolean }) {
  const { id } = useParams()
  const { user, isHotelier, isAccountManager } = useAuth()
  const report = libraryReports.find((r) => r.id === id) ?? libraryReports[0]
  const ctx = useReport()
  const canOpen =
    publicView || !user?.allowedReportIds || !id || user.allowedReportIds.includes(id)

  const [editOpen, setEditOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const publicUrl = useMemo(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    return `${window.location.origin}${base}/shared/${report.id}`
  }, [report.id])

  const copyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
    } catch {
      window.prompt('Copy public report URL', publicUrl)
    }
    setLinkCopied(true)
    window.setTimeout(() => setLinkCopied(false), 1600)
  }

  useLayoutEffect(() => {
    if (publicView || isHotelier) ctx.setViewMode('customer')
  }, [publicView, isHotelier, ctx.setViewMode])

  useEffect(() => {
    ctx.setPartnerName(report.partner)
    ctx.setPerspective(report.perspective)
    ctx.setAccountType(report.accountType)
    ctx.resetScope()
    // Sync once per opened report.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report.id, report.partner, report.perspective, report.accountType])

  useEffect(() => {
    if (!shareMenuOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (!shareMenuRef.current?.contains(event.target as Node)) setShareMenuOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShareMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [shareMenuOpen])

  const shareMenu = !publicView ? (
    <div className="relative" ref={shareMenuRef}>
      <PrimaryButton
        onClick={() => setShareMenuOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={shareMenuOpen}
      >
        <Share2 size={14} />
        Share
        <ChevronDown
          size={14}
          className={`transition-transform ${shareMenuOpen ? 'rotate-180' : ''}`}
        />
      </PrimaryButton>
      {shareMenuOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[200px] overflow-hidden rounded-xl border border-line bg-card py-1 shadow-[0_12px_28px_rgba(15,31,51,0.12)]"
        >
          {ctx.isInternal ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-canvas"
              onClick={() => {
                setShareMenuOpen(false)
                setEditOpen(true)
              }}
            >
              <Pencil size={15} className="text-navy-muted" />
              Modify report
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-canvas"
            onClick={() => {
              setShareMenuOpen(false)
              const base = import.meta.env.BASE_URL.replace(/\/$/, '')
              window.open(
                `${window.location.origin}${base}/shared/${report.id}`,
                '_blank',
                'noopener,noreferrer',
              )
            }}
          >
            <Eye size={15} className="text-navy-muted" />
            Preview
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-canvas"
            onClick={() => {
              setShareMenuOpen(false)
              setDownloadOpen(true)
            }}
          >
            <Download size={15} className="text-navy-muted" />
            Download
          </button>
          {isAccountManager ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-canvas"
              onClick={() => {
                setShareMenuOpen(false)
                setShareOpen(true)
              }}
            >
              <Share2 size={15} className="text-navy-muted" />
              Share with customer
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null

  const nav = useMemo(() => {
    const items: {
      id: string
      label: string
      moduleId: typeof ctx.enabledModules[number]
      icon: LucideIcon
      muted?: boolean
    }[] = []
    const push = (
      id: string,
      label: string,
      moduleId: typeof ctx.enabledModules[number],
      icon: LucideIcon,
      eligible = true,
    ) => {
      if (!eligible) return
      const shared = ctx.isModuleShared(moduleId)
      if (!ctx.isInternal && !shared) return
      items.push({ id, label, moduleId, icon, muted: ctx.isInternal && !shared })
    }
    push('scorecard', 'Executive summary', 'scorecard', LayoutDashboard)
    push('direct-performance', ctx.isSupply ? 'Direct Performance' : 'Contribution', 'direct', ChartColumn)
    push('indirect-channels', 'Indirect Channels', 'indirect', Globe2, ctx.isSupply && ctx.isFullStack)
    push('indirect-channels', 'Market & Coverage', 'indirect', Globe2, !ctx.isSupply)
    push('rate-parity', 'Rate Parity', 'parity', Scale, ctx.isSupply)
    push('marketing', 'Marketing', 'marketing', Megaphone)
    push('demand-outlook', 'Demand Outlook', 'outlook', CalendarRange)
    push('recommendations', 'Recommendations', 'recommendations', Lightbulb)
    return items
  }, [ctx.isSupply, ctx.isFullStack, ctx.isInternal, ctx.enabledModules, ctx.isModuleShared])

  const [activeNav, setActiveNav] = useState('scorecard')

  useEffect(() => {
    if (!nav.some((item) => item.id === activeNav) && nav[0]) {
      setActiveNav(nav[0].id)
    }
  }, [nav, activeNav])

  useEffect(() => {
    const firstId = nav[0]?.id ?? 'scorecard'
    const visible = new Map<string, DOMRect>()

    const pickActive = () => {
      if (window.scrollY < 120) {
        setActiveNav(firstId)
        return
      }
      const entries = [...visible.entries()].sort(
        (a, b) => a[1].top - b[1].top,
      )
      if (entries[0]) setActiveNav(entries[0][0])
    }

    const observers = nav.map((item) => {
      const el = document.getElementById(item.id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visible.set(item.id, entry.boundingClientRect)
          else visible.delete(item.id)
          pickActive()
        },
        { rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.1, 0.25] },
      )
      observer.observe(el)
      return observer
    })

    const onScroll = () => {
      if (window.scrollY < 120) setActiveNav(firstId)
    }
    const onHash = () => {
      const id = window.location.hash.replace(/^#/, '')
      if (id && nav.some((item) => item.id === id)) setActiveNav(id)
    }

    pickActive()
    onHash()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onHash)

    return () => {
      observers.forEach((observer) => observer?.disconnect())
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onHash)
    }
  }, [nav])

  if (!canOpen) {
    return <Navigate to={user?.homeReportId ? `/reports/${user.homeReportId}` : '/'} replace />
  }

  const partnerHierarchy = getPartnerHierarchy(ctx.partnerName)
  const brandOptions = partnerHierarchy.brands
  const propertyOptions = ctx.selectedBrandId
    ? partnerHierarchy.properties.filter((p) => p.brandId === ctx.selectedBrandId)
    : partnerHierarchy.properties
  const scopeFiltersEnabled = ctx.canScopeBrandProperty

  return (
    <AppShell
      hideNav={false}
      contextLabel={ctx.partnerName}
      contextBadge={
        <span className="inline-flex items-center rounded border border-line bg-card px-1.5 py-0.5 text-[10px] font-medium capitalize tracking-wide text-navy-muted">
          {ctx.accountType === 'full' ? 'Full stack' : 'Direct stack'}
        </span>
      }
      meta={
        publicView || isHotelier ? (
          <div className="flex flex-wrap items-center gap-2">
            {publicView && (
              <span className="text-sm text-navy-muted">
                {ctx.periodLabel}
                {ctx.compareWith === 'both'
                  ? ` · vs ${ctx.previousCompareName} & ${ctx.lyCompareName}`
                  : ctx.compareWith === 'previous'
                    ? ` · vs ${ctx.previousCompareName}`
                    : ctx.compareWith === 'ly'
                      ? ` · vs ${ctx.lyCompareName}`
                      : ''}
              </span>
            )}
            {isHotelier && (
              <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal">
                Hotelier view
              </span>
            )}
          </div>
        ) : undefined
      }
      navItems={nav.map((item) => ({
        id: item.id,
        label: item.label,
        href: `#${item.id}`,
        active: activeNav === item.id,
        muted: item.muted,
        icon: item.icon,
      }))}
      backTo={publicView ? undefined : { label: 'Back to reports', href: '/' }}
      toolbar={
        publicView ? undefined : (
          <div className="flex flex-nowrap items-end gap-3 overflow-x-auto">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-navy-muted">Brand</span>
              <Select
                value={ctx.selectedBrandId ?? 'all'}
                disabled={!scopeFiltersEnabled}
                size="sm"
                className="min-w-[160px]"
                searchPlaceholder="Search brands"
                placeholder="All brands"
                onChange={(v) => {
                  if (v === 'all') ctx.goToScope('chain')
                  else ctx.openBrand(v)
                }}
                options={[
                  { value: 'all', label: 'All brands' },
                  ...brandOptions.map((b) => ({ value: b.id, label: b.name })),
                ]}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-navy-muted">Property</span>
              <Select
                value={ctx.selectedPropertyId ?? 'all'}
                disabled={!scopeFiltersEnabled}
                size="sm"
                className="min-w-[170px]"
                searchPlaceholder="Search properties"
                placeholder="All properties"
                onChange={(v) => {
                  if (v === 'all') {
                    if (ctx.selectedBrandId) ctx.goToScope('brand')
                    else ctx.goToScope('chain')
                  } else {
                    ctx.openProperty(v)
                  }
                }}
                options={[
                  {
                    value: 'all',
                    label: ctx.selectedBrandId ? 'All properties in brand' : 'All properties',
                  },
                  ...propertyOptions.map((p) => ({ value: p.id, label: p.name })),
                ]}
              />
            </div>
            <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />
            <PeriodSelector />
            <div className="hidden h-8 w-px shrink-0 bg-line sm:block" />
            <ComparisonSelector />
            <div className="ml-auto flex h-8 shrink-0 items-center">
              <span className="text-[11px] text-navy-muted">
                Currency <span className="font-semibold text-navy">USD</span>
              </span>
            </div>
          </div>
        )
      }
      actions={
        publicView ? (
          <div className="flex items-center gap-2">
            <SecondaryButton onClick={copyPublicLink}>
              {linkCopied ? <Check size={14} /> : <Copy size={14} />}
              {linkCopied ? 'Link copied' : 'Copy link'}
            </SecondaryButton>
            <PrimaryButton onClick={() => setShareOpen(true)}>
              <Share2 size={14} />
              Share with customer
            </PrimaryButton>
          </div>
        ) : (
          <>
            {isAccountManager && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-navy-muted">
                  View
                </span>
                <SegmentedControl<ViewMode>
                  value={ctx.viewMode}
                  onChange={ctx.setViewMode}
                  options={[
                    { value: 'internal', label: 'RateGain' },
                    { value: 'customer', label: 'Client' },
                  ]}
                />
              </div>
            )}
            {shareMenu}
          </>
        )
      }
    >
      {!publicView && !ctx.isInternal ? (
        <div className="mb-4 rounded-xl bg-[#ecf8f6] px-3 py-2 text-sm text-teal">
          {isHotelier
            ? `Hotelier ${user?.hotelierLevel ?? ''} view · client report only`
            : 'You are viewing the version that will be shared with the client.'}
        </div>
      ) : null}

      <div className="space-y-14">
        {ctx.shouldShowModule('scorecard') && <ExecutiveSummary />}
        {ctx.shouldShowModule('direct') && <DirectPerformance />}
        {ctx.shouldShowModule('indirect') && ctx.isSupply && ctx.isFullStack && <IndirectChannels />}
        {ctx.shouldShowModule('indirect') && !ctx.isSupply && <DemandCoverage />}
        {ctx.shouldShowModule('parity') && ctx.isSupply && <RateParity />}
        {ctx.shouldShowModule('marketing') && <Marketing />}
        {ctx.shouldShowModule('outlook') && <DemandOutlook />}
        {ctx.shouldShowModule('recommendations') && <Recommendations />}

        {ctx.isInternal && ctx.accountType === 'direct' && (
          <EmptyState kind="not_subscribed" />
        )}
      </div>

      <EditReportModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onDownload={() => setDownloadOpen(true)}
        onShare={() => setShareOpen(true)}
      />

      <DownloadReportModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        partner={report.partner}
      />
      <ShareReportModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        reportId={report.id}
        partner={report.partner}
        showPreview={!publicView}
      />
    </AppShell>
  )
}
