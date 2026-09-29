import { Download, Pencil, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { DownloadReportModal } from '../components/DownloadReportModal'
import { GenerateReportDrawer } from '../components/GenerateReportDrawer'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { DataTable, type Column } from '../components/ui/DataTable'
import { DateRangePicker } from '../components/ui/DateRangePicker'
import { Select, TextInput } from '../components/ui/FilterBar'
import { SideDrawer } from '../components/ui/SideDrawer'
import { ReportStatusBadge } from '../components/ui/StatusBadge'
import { libraryReports, partnerDirectory, getPartnerHierarchy } from '../data/grandMeridian'
import type { LibraryReport, PartnerPerspective } from '../types'

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

/** Parse library `generated` labels like "4 Jul 2026" into a comparable YYYY-MM-DD. */
function generatedToIso(label: string): string | null {
  const match = label.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/)
  if (!match) return null
  const day = Number(match[1])
  const month = MONTH_INDEX[match[2]]
  const year = Number(match[3])
  if (month == null || !Number.isFinite(day) || !Number.isFinite(year)) return null
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

type PartnerRow = {
  partner: string
  perspective: PartnerPerspective
  accountTypeLabel: string
  regions: string[]
  orgType: 'Chain' | 'Account' | 'Hotel'
  locations: string[]
  propertyCount: number
  reportCount: number
  sharedCount: number
  draftCount: number
  latestGenerated: string | null
  latestPeriod: string | null
  reports: LibraryReport[]
  hasReports: boolean
}

function propertyCountForPartner(partnerName: string, locations: string[], orgType: PartnerRow['orgType']) {
  const hierarchy = getPartnerHierarchy(partnerName)
  if (hierarchy.propertyCount > 0) return hierarchy.propertyCount
  if (orgType === 'Hotel') return Math.max(locations.length, 1)
  return Math.max(locations.length, 1)
}

function formatPerspective(p: PartnerPerspective) {
  return p === 'supply' ? 'Supply Partner' : 'Demand Partner'
}

function formatAccountType(a: LibraryReport['accountType']) {
  return a === 'full' ? 'Full stack' : 'Direct stack'
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-navy-muted">—</span>
  return (
    <div className="flex flex-wrap items-center gap-1">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full bg-[var(--ds-surface-muted)] px-2 py-0.5 text-[11px] font-semibold text-navy"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function groupReportsByRegion(reports: LibraryReport[]) {
  const order: string[] = []
  const map = new Map<string, LibraryReport[]>()
  for (const report of reports) {
    if (!map.has(report.region)) {
      map.set(report.region, [])
      order.push(report.region)
    }
    map.get(report.region)!.push(report)
  }
  return order.map((region) => ({ region, reports: map.get(region)! }))
}

export function ReportLibrary() {
  const navigate = useNavigate()
  const { user, isHotelier, isAccountManager } = useAuth()
  const [query, setQuery] = useState('')
  const [perspective, setPerspective] = useState('all')
  const [accountType, setAccountType] = useState('all')
  const [region, setRegion] = useState('all')
  const [status, setStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [generateOpen, setGenerateOpen] = useState(false)
  const [generatePartner, setGeneratePartner] = useState<string | undefined>(undefined)
  const [selectedPartner, setSelectedPartner] = useState<PartnerRow | null>(null)
  const [downloadPartner, setDownloadPartner] = useState<string | null>(null)
  const [stickyOffsetTop, setStickyOffsetTop] = useState(140)

  useEffect(() => {
    const readOffset = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--report-chrome-height')
        .trim()
      const value = Number.parseFloat(raw)
      if (Number.isFinite(value) && value > 0) setStickyOffsetTop(Math.round(value))
    }

    readOffset()
    const toolbar = document.querySelector('[data-report-toolbar]')
    const observer = toolbar ? new ResizeObserver(readOffset) : null
    if (toolbar && observer) observer.observe(toolbar)
    window.addEventListener('resize', readOffset)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', readOffset)
    }
  }, [])

  const filteredReports = useMemo(() => {
    return libraryReports.filter((r) => {
      const allowed = !user?.allowedReportIds || user.allowedReportIds.includes(r.id)
      const q = query.toLowerCase()
      const matchesQuery = !q || r.partner.toLowerCase().includes(q) || r.period.toLowerCase().includes(q)
      const matchesPerspective = perspective === 'all' || r.perspective === perspective
      const matchesType = accountType === 'all' || r.accountType === accountType
      const matchesRegion = region === 'all' || r.region === region
      const matchesStatus = status === 'all' || r.status === status
      const generatedIso = generatedToIso(r.generated)
      const matchesDate =
        !dateFrom ||
        !dateTo ||
        (generatedIso != null && generatedIso >= dateFrom && generatedIso <= dateTo)
      return (
        allowed &&
        matchesQuery &&
        matchesPerspective &&
        matchesType &&
        matchesRegion &&
        matchesStatus &&
        matchesDate
      )
    })
  }, [query, perspective, accountType, region, status, dateFrom, dateTo, user])

  const partnerRows = useMemo(() => {
    const byPartner = new Map<string, LibraryReport[]>()
    for (const report of filteredReports) {
      const list = byPartner.get(report.partner) ?? []
      list.push(report)
      byPartner.set(report.partner, list)
    }

    const restrictingByReportMeta = status !== 'all' || Boolean(dateFrom && dateTo)
    const rows: PartnerRow[] = []

    for (const entry of partnerDirectory) {
      const reports = byPartner.get(entry.name) ?? []
      const q = query.toLowerCase()
      const matchesQuery = !q || entry.name.toLowerCase().includes(q)
      const matchesPerspective = perspective === 'all' || entry.perspective === perspective
      const matchesType =
        accountType === 'all' ||
        entry.accountType === accountType ||
        reports.some((r) => r.accountType === accountType)
      const matchesRegion =
        region === 'all' || entry.regions.includes(region) || reports.some((r) => r.region === region)

      if (!matchesQuery || !matchesPerspective || !matchesType || !matchesRegion) continue

      if (reports.length === 0) {
        if (restrictingByReportMeta) continue
        if (isHotelier && user?.allowedReportIds) continue
        rows.push({
          partner: entry.name,
          perspective: entry.perspective,
          accountTypeLabel: formatAccountType(entry.accountType),
          regions: entry.regions,
          orgType: entry.orgType,
          locations: entry.locations,
          propertyCount: propertyCountForPartner(entry.name, entry.locations, entry.orgType),
          reportCount: 0,
          sharedCount: 0,
          draftCount: 0,
          latestGenerated: null,
          latestPeriod: null,
          reports: [],
          hasReports: false,
        })
        continue
      }

      const sorted = [...reports].sort((a, b) => {
        const aIso = generatedToIso(a.generated) ?? ''
        const bIso = generatedToIso(b.generated) ?? ''
        return bIso.localeCompare(aIso)
      })
      rows.push({
        partner: entry.name,
        perspective: sorted[0].perspective,
        accountTypeLabel: formatAccountType(entry.accountType),
        regions: [...new Set([...entry.regions, ...sorted.map((r) => r.region)])],
        orgType: entry.orgType,
        locations: entry.locations,
        propertyCount: propertyCountForPartner(entry.name, entry.locations, entry.orgType),
        reportCount: sorted.length,
        sharedCount: sorted.filter((r) => r.status === 'shared').length,
        draftCount: sorted.filter((r) => r.status === 'draft').length,
        latestGenerated: sorted[0].generated,
        latestPeriod: sorted[0].period,
        reports: sorted,
        hasReports: true,
      })
    }

    for (const [partner, reports] of byPartner) {
      if (rows.some((r) => r.partner === partner)) continue
      const sorted = [...reports].sort((a, b) => {
        const aIso = generatedToIso(a.generated) ?? ''
        const bIso = generatedToIso(b.generated) ?? ''
        return bIso.localeCompare(aIso)
      })
      rows.push({
        partner,
        perspective: sorted[0].perspective,
        accountTypeLabel: formatAccountType(sorted[0].accountType),
        regions: [...new Set(sorted.map((r) => r.region))],
        orgType: 'Account',
        locations: [sorted[0].region],
        propertyCount: propertyCountForPartner(partner, [sorted[0].region], 'Account'),
        reportCount: sorted.length,
        sharedCount: sorted.filter((r) => r.status === 'shared').length,
        draftCount: sorted.filter((r) => r.status === 'draft').length,
        latestGenerated: sorted[0].generated,
        latestPeriod: sorted[0].period,
        reports: sorted,
        hasReports: true,
      })
    }

    const pinnedPartners = [
      'Grand Meridian Hotels & Resorts',
      'Harbour Light Hotels',
      'Northstar Hospitality',
    ]

    return rows.sort((a, b) => {
      const aPin = pinnedPartners.indexOf(a.partner)
      const bPin = pinnedPartners.indexOf(b.partner)
      if (aPin !== -1 || bPin !== -1) {
        if (aPin === -1) return 1
        if (bPin === -1) return -1
        return aPin - bPin
      }
      if (a.hasReports !== b.hasReports) return a.hasReports ? -1 : 1
      return a.partner.localeCompare(b.partner)
    })
  }, [
    filteredReports,
    query,
    perspective,
    accountType,
    region,
    status,
    dateFrom,
    dateTo,
    isHotelier,
    user,
  ])

  const openGenerate = (partnerName?: string) => {
    setGeneratePartner(partnerName)
    setGenerateOpen(true)
  }

  const columns: Column<PartnerRow>[] = [
    {
      key: 'partner',
      header: 'Partner name',
      wrap: true,
      className: 'w-[34%]',
      render: (r) => (
        <button type="button" className="text-left" onClick={() => setSelectedPartner(r)}>
          <span className="block text-sm font-semibold text-navy hover:text-rg-blue">{r.partner}</span>
          <span className="mt-0.5 block text-xs font-normal text-navy-muted">
            {formatPerspective(r.perspective)} · {r.accountTypeLabel} · {r.regions[0] ?? '—'}
          </span>
        </button>
      ),
    },
    {
      key: 'properties',
      header: 'Properties',
      align: 'right',
      className: 'w-[10%]',
      render: (r) => <span className="tabular font-semibold text-navy">{r.propertyCount}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      wrap: true,
      className: 'w-[16%]',
      render: (r) => {
        if (r.locations.length === 0) return <span className="text-navy-muted">—</span>
        const visible = r.locations.slice(0, 3)
        const overflow = r.locations.length - visible.length
        return (
          <span className="font-medium text-navy" title={r.locations.join(', ')}>
            {visible.join(', ')}
            {overflow > 0 ? <span className="text-navy-muted"> +{overflow}</span> : null}
          </span>
        )
      },
    },
    {
      key: 'latest',
      header: 'Last generated',
      className: 'w-[16%]',
      render: (r) =>
        r.hasReports && r.latestPeriod && r.latestGenerated ? (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="inline-flex items-center rounded-full bg-rg-blue-soft px-2 py-0.5 text-[11px] font-semibold text-rg-blue">
              {r.latestPeriod}
            </span>
            <span className="text-xs font-normal text-navy-muted">{r.latestGenerated}</span>
          </div>
        ) : (
          <span className="text-sm font-normal text-navy-muted">Never generated</span>
        ),
    },
    {
      key: 'actions',
      header: 'Reports',
      className: 'w-[24%]',
      render: (r) => (
        <div className="inline-flex items-center gap-2">
          <SecondaryButton
            className="h-8 border border-line bg-[var(--ds-surface-muted)] px-3 text-xs font-semibold hover:bg-[var(--ds-surface-muted)]"
            onClick={() => setSelectedPartner(r)}
          >
            Past reports
          </SecondaryButton>
          {isAccountManager ? (
            <PrimaryButton className="h-8 px-3 text-xs" onClick={() => openGenerate(r.partner)}>
              Generate report
            </PrimaryButton>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <AppShell
      hideNav
      contextLabel={isHotelier && user?.partner ? user.partner : 'Partners'}
      toolbar={
        <div className="flex flex-nowrap items-end gap-3 overflow-x-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted/70">
              Search
            </span>
            <div className="relative min-w-[200px]">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-muted"
              />
              <TextInput
                value={query}
                onChange={setQuery}
                placeholder="Search partner or period"
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted/70">
              Partner type
            </span>
            <Select
              value={perspective}
              onChange={setPerspective}
              size="sm"
              className="min-w-[140px]"
              options={[
                { value: 'all', label: 'All' },
                { value: 'supply', label: 'Supply Partner' },
                { value: 'demand', label: 'Demand Partner' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted/70">
              Account type
            </span>
            <Select
              value={accountType}
              onChange={setAccountType}
              size="sm"
              className="min-w-[130px]"
              options={[
                { value: 'all', label: 'All' },
                { value: 'direct', label: 'Direct Stack' },
                { value: 'full', label: 'Full Stack' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted/70">
              Region
            </span>
            <Select
              value={region}
              onChange={setRegion}
              size="sm"
              className="min-w-[120px]"
              options={[
                { value: 'all', label: 'All' },
                { value: 'APMEA', label: 'APMEA' },
                { value: 'APAC', label: 'APAC' },
                { value: 'EMEA', label: 'EMEA' },
                { value: 'Americas', label: 'Americas' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted/70">
              Report status
            </span>
            <Select
              value={status}
              onChange={setStatus}
              size="sm"
              className="min-w-[110px]"
              options={[
                { value: 'all', label: 'All' },
                { value: 'draft', label: 'Draft' },
                { value: 'shared', label: 'Shared' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-navy-muted/70">
              Generated date
            </span>
            <DateRangePicker
              from={dateFrom}
              to={dateTo}
              onChange={(from, to) => {
                setDateFrom(from)
                setDateTo(to)
              }}
              placeholder="Select date"
              allowClear
              size="sm"
            />
          </div>
          <div className="ml-auto flex h-8 shrink-0 items-center">
            <span className="text-[11px] text-navy-muted/70">
              <span className="font-medium text-navy-muted">{partnerRows.length}</span>
              {' of '}
              {partnerDirectory.length}
            </span>
          </div>
        </div>
      }
    >
      {partnerRows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-navy-muted">No partners match the current filters.</p>
      ) : (
        <DataTable
          columns={columns}
          rows={partnerRows}
          rowKey={(r) => r.partner}
          stickyPageHeader
          stickyOffsetTop={stickyOffsetTop}
          fixedLayout
        />
      )}

      <SideDrawer
        open={!!selectedPartner}
        title={selectedPartner?.partner ?? 'Reports'}
        titleBadge={
          selectedPartner ? (
            <span className="rounded-full bg-rg-blue-soft px-2.5 py-1 text-xs font-semibold text-rg-blue">
              {formatPerspective(selectedPartner.perspective)}
            </span>
          ) : undefined
        }
        onClose={() => setSelectedPartner(null)}
        width="max-w-xl"
      >
        {selectedPartner && (
          <div className="space-y-5">
            {isAccountManager && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-[var(--ds-surface-muted)] px-4 py-3">
                <p className="text-xs text-navy-muted">
                  {selectedPartner.hasReports
                    ? 'Create another brief for this partner.'
                    : 'Assemble the first performance brief for this partner.'}
                </p>
                <PrimaryButton
                  className="h-8 shrink-0 px-3 text-xs"
                  onClick={() => {
                    const partnerName = selectedPartner.partner
                    setSelectedPartner(null)
                    openGenerate(partnerName)
                  }}
                >
                  <Plus size={14} />
                  Generate report
                </PrimaryButton>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-navy-muted">
                {selectedPartner.reportCount} report{selectedPartner.reportCount === 1 ? '' : 's'}
              </p>
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">
                  Regions covered
                </p>
                <ChipList items={selectedPartner.regions} />
              </div>
            </div>

            {selectedPartner.hasReports ? (
              <div className="space-y-4">
                {groupReportsByRegion(selectedPartner.reports).map(({ region: reportRegion, reports }) => (
                  <section key={reportRegion}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-navy-muted">
                        {reportRegion}
                      </h3>
                      <span className="text-[11px] text-navy-muted">
                        {reports.length} report{reports.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <ul className="divide-y divide-line rounded-xl border border-line bg-card">
                      {reports.map((report) => (
                        <li
                          key={report.id}
                          className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-navy">{report.period}</p>
                              <ReportStatusBadge status={report.status} />
                            </div>
                            <p className="mt-1 text-xs text-navy-muted">{report.scope}</p>
                            <p className="mt-0.5 text-xs text-navy-muted">
                              {formatAccountType(report.accountType)} · Generated {report.generated}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                            <SecondaryButton
                              className="h-8 px-2.5 text-xs"
                              onClick={() => navigate(`/reports/${report.id}`)}
                            >
                              View
                            </SecondaryButton>
                            {isAccountManager && (
                              <>
                                <SecondaryButton
                                  className="h-8 px-2.5 text-xs"
                                  onClick={() => navigate(`/reports/${report.id}`)}
                                >
                                  <Pencil size={12} />
                                  Edit
                                </SecondaryButton>
                                <SecondaryButton
                                  className="h-8 px-2.5 text-xs"
                                  onClick={() => setDownloadPartner(selectedPartner.partner)}
                                >
                                  <Download size={12} />
                                  Download
                                </SecondaryButton>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-line bg-[var(--ds-surface-muted)] px-5 py-8 text-center">
                <p className="text-sm font-semibold text-navy">No reports generated yet</p>
                <p className="mt-1 text-sm text-navy-muted">
                  This partner is in the book, but the team has not assembled a performance brief.
                </p>
              </div>
            )}
          </div>
        )}
      </SideDrawer>

      <GenerateReportDrawer
        open={generateOpen}
        initialPartner={generatePartner}
        onClose={() => {
          setGenerateOpen(false)
          setGeneratePartner(undefined)
        }}
      />
      <DownloadReportModal
        open={!!downloadPartner}
        partner={downloadPartner ?? ''}
        onClose={() => setDownloadPartner(null)}
      />
    </AppShell>
  )
}
