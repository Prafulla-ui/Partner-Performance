import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  chainHierarchy,
  demandNarrative,
  demandRecommendations,
  getBrandById,
  getPartnerHierarchy,
  getPropertyById,
  initialActions,
  supplyNarrative,
  supplyRecommendations,
} from '../data/grandMeridian'
import { defaultModulesFor } from '../data/reportModules'
import { formatCustomPeriodLabel, PERIOD_LABELS } from '../lib/period'
import type {
  AccountType,
  ChartMetric,
  CompareWith,
  HierarchyBrand,
  HierarchyProperty,
  PartnerPerspective,
  Recommendation,
  ReportModuleId,
  ReviewAction,
  ScopeKpis,
  ScopeLevel,
  ViewMode,
  ViewPeriod,
  ReportStatus,
} from '../types'

interface ReportState {
  perspective: PartnerPerspective
  accountType: AccountType
  viewMode: ViewMode
  viewPeriod: ViewPeriod
  periodLabel: string
  customFrom: string
  customTo: string
  compareWith: CompareWith
  previousCompareLabel: string
  lyCompareLabel: string
  previousCompareName: string
  lyCompareName: string
  chartMetric: ChartMetric
  narrative: string
  recommendations: Recommendation[]
  actions: ReviewAction[]
  reportTitle: string
  reportStatus: ReportStatus
  scopeLevel: ScopeLevel
  selectedBrandId: string | null
  selectedPropertyId: string | null
  maxScopeLevel: ScopeLevel
  lockedBrandId: string | null
  partnerName: string
  canScopeBrandProperty: boolean
  activeScopeLabel: string
  activeScopeKpis: ScopeKpis
  visibleBrands: HierarchyBrand[]
  visibleProperties: HierarchyProperty[]
  enabledModules: ReportModuleId[]
  setEnabledModules: (ids: ReportModuleId[]) => void
  isModuleShared: (id: ReportModuleId) => boolean
  shouldShowModule: (id: ReportModuleId) => boolean
  setReportTitle: (v: string) => void
  setReportStatus: (v: ReportStatus) => void
  setPartnerName: (v: string) => void
  setPerspective: (v: PartnerPerspective) => void
  setAccountType: (v: AccountType) => void
  setViewMode: (v: ViewMode) => void
  setViewPeriod: (v: ViewPeriod) => void
  setCustomRange: (from: string, to: string) => void
  setCompareWith: (v: CompareWith) => void
  setChartMetric: (v: ChartMetric) => void
  setNarrative: (v: string) => void
  updateRecommendation: (id: string, patch: Partial<Recommendation>) => void
  addAction: (action: ReviewAction) => void
  updateAction: (id: string, patch: Partial<ReviewAction>) => void
  openBrand: (brandId: string) => void
  openProperty: (propertyId: string) => void
  goToScope: (level: ScopeLevel) => void
  resetScope: () => void
  isInternal: boolean
  isFullStack: boolean
  isSupply: boolean
  canDrillScope: boolean
}

const ReportContext = createContext<ReportState | null>(null)

const compareMeta: Record<
  ViewPeriod,
  { previousLabel: string; previousName: string; lyLabel: string; lyName: string }
> = {
  month: {
    previousLabel: 'Previous month',
    previousName: 'May 2026',
    lyLabel: 'Same month last year',
    lyName: 'June 2025',
  },
  quarter: {
    previousLabel: 'Previous quarter',
    previousName: 'Q1 2026',
    lyLabel: 'Same quarter last year',
    lyName: 'Q2 2025',
  },
  ytd: {
    previousLabel: 'Prior year-to-date',
    previousName: 'YTD 2025',
    lyLabel: 'Same YTD last year',
    lyName: 'YTD 2025',
  },
  custom: {
    previousLabel: 'Previous period',
    previousName: '1 Jan–31 Mar 2026',
    lyLabel: 'Same dates last year',
    lyName: '1 Apr–30 Jun 2025',
  },
}

function scopeRank(level: ScopeLevel) {
  return level === 'chain' ? 0 : level === 'brand' ? 1 : 2
}

export function ReportProvider({ children }: { children: ReactNode }) {
  const { user, isHotelier } = useAuth()
  const location = useLocation()
  const isPublicShare = location.pathname.includes('/shared/')
  const maxScopeLevel: ScopeLevel = user?.hotelierLevel ?? 'chain'
  const lockedBrandId = user?.brandId ?? null
  const lockedPropertyId = user?.propertyId ?? null

  const [perspective, setPerspectiveState] = useState<PartnerPerspective>('supply')
  const [accountType, setAccountType] = useState<AccountType>('full')
  const [viewMode, setViewModeState] = useState<ViewMode>(isHotelier ? 'customer' : 'internal')
  const [viewPeriod, setViewPeriodState] = useState<ViewPeriod>('quarter')
  const [customFrom, setCustomFrom] = useState('2026-04-01')
  const [customTo, setCustomTo] = useState('2026-06-30')
  const [periodLabel, setPeriodLabel] = useState(PERIOD_LABELS.quarter)
  const [compareWith, setCompareWith] = useState<CompareWith>('none')
  const [chartMetric, setChartMetric] = useState<ChartMetric>('revenue')
  const [supplyText, setSupplyText] = useState(supplyNarrative)
  const [demandText, setDemandText] = useState(demandNarrative)
  const [supplyRecs, setSupplyRecs] = useState(supplyRecommendations)
  const [demandRecs, setDemandRecs] = useState(demandRecommendations)
  const [actions, setActions] = useState(initialActions)
  const [reportTitle, setReportTitle] = useState('Partner Performance & Growth Report')
  const [reportStatus, setReportStatus] = useState<ReportStatus>('shared')
  const [partnerName, setPartnerName] = useState(chainHierarchy.name)
  const [enabledModules, setEnabledModules] = useState<ReportModuleId[]>(() =>
    defaultModulesFor('supply', 'full'),
  )
  const [scopeLevel, setScopeLevel] = useState<ScopeLevel>(maxScopeLevel)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(lockedBrandId)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(lockedPropertyId)

  useEffect(() => {
    setViewModeState(isHotelier ? 'customer' : 'internal')
  }, [isHotelier])

  useEffect(() => {
    setScopeLevel(maxScopeLevel)
    setSelectedBrandId(lockedBrandId)
    setSelectedPropertyId(lockedPropertyId)
  }, [maxScopeLevel, lockedBrandId, lockedPropertyId, user?.email])

  const setViewMode = (v: ViewMode) => {
    if (isHotelier) return
    setViewModeState(v)
  }

  const setPerspective = (v: PartnerPerspective) => setPerspectiveState(v)
  const setViewPeriod = (v: ViewPeriod) => {
    setViewPeriodState(v)
    if (v === 'custom') setPeriodLabel(formatCustomPeriodLabel(customFrom, customTo))
    else setPeriodLabel(PERIOD_LABELS[v])
  }
  const setCustomRange = (from: string, to: string) => {
    setCustomFrom(from)
    setCustomTo(to)
    setViewPeriodState('custom')
    setPeriodLabel(formatCustomPeriodLabel(from, to))
  }

  const resetScope = () => {
    setScopeLevel(maxScopeLevel)
    setSelectedBrandId(lockedBrandId)
    setSelectedPropertyId(lockedPropertyId)
  }

  const openBrand = (brandId: string) => {
    if (scopeRank('brand') < scopeRank(maxScopeLevel)) return
    if (lockedBrandId && brandId !== lockedBrandId) return
    setSelectedBrandId(brandId)
    setSelectedPropertyId(null)
    setScopeLevel('brand')
  }

  const openProperty = (propertyId: string) => {
    if (scopeRank('property') < scopeRank(maxScopeLevel)) return
    const property = getPropertyById(propertyId)
    if (!property) return
    if (lockedBrandId && property.brandId !== lockedBrandId) return
    if (lockedPropertyId && propertyId !== lockedPropertyId) return
    setSelectedBrandId(property.brandId)
    setSelectedPropertyId(propertyId)
    setScopeLevel('property')
  }

  const goToScope = (level: ScopeLevel) => {
    if (scopeRank(level) < scopeRank(maxScopeLevel)) return
    if (level === 'chain') {
      setScopeLevel('chain')
      setSelectedBrandId(null)
      setSelectedPropertyId(null)
      return
    }
    if (level === 'brand') {
      if (!selectedBrandId && !lockedBrandId) return
      setSelectedBrandId(selectedBrandId ?? lockedBrandId)
      setSelectedPropertyId(null)
      setScopeLevel('brand')
      return
    }
    if (selectedPropertyId || lockedPropertyId) {
      setSelectedPropertyId(selectedPropertyId ?? lockedPropertyId)
      setScopeLevel('property')
    }
  }

  const partnerHierarchy = useMemo(() => getPartnerHierarchy(partnerName), [partnerName])

  const activeBrand = selectedBrandId
    ? partnerHierarchy.brands.find((b) => b.id === selectedBrandId) ?? getBrandById(selectedBrandId)
    : undefined
  const activeProperty = selectedPropertyId
    ? partnerHierarchy.properties.find((p) => p.id === selectedPropertyId) ?? getPropertyById(selectedPropertyId)
    : undefined

  const activeScopeKpis = useMemo(() => {
    if (scopeLevel === 'property' && activeProperty) return activeProperty.kpis
    if (scopeLevel === 'brand' && activeBrand) return activeBrand.kpis
    return chainHierarchy.kpis
  }, [scopeLevel, activeBrand, activeProperty])

  const activeScopeLabel = useMemo(() => {
    if (scopeLevel === 'property' && activeProperty) return activeProperty.name
    if (scopeLevel === 'brand' && activeBrand) return activeBrand.name
    return `Chain · ${partnerHierarchy.propertyCount || chainHierarchy.propertyCount} properties`
  }, [scopeLevel, activeBrand, activeProperty, partnerHierarchy.propertyCount])

  const visibleBrands = useMemo(() => {
    if (lockedBrandId) return partnerHierarchy.brands.filter((b) => b.id === lockedBrandId)
    return partnerHierarchy.brands
  }, [lockedBrandId, partnerHierarchy.brands])

  const visibleProperties = useMemo(() => {
    const brandId = selectedBrandId ?? lockedBrandId
    if (!brandId) return []
    let list = partnerHierarchy.properties.filter((p) => p.brandId === brandId)
    if (lockedPropertyId) list = list.filter((p) => p.id === lockedPropertyId)
    return list
  }, [selectedBrandId, lockedBrandId, lockedPropertyId, partnerHierarchy.properties])

  const canScopeBrandProperty = partnerHierarchy.brands.length > 0

  const isSupply = perspective === 'supply'
  const compare = compareMeta[viewPeriod]
  const narrative = isSupply ? supplyText : demandText
  const recommendations = isSupply ? supplyRecs : demandRecs

  const setNarrative = (v: string) => {
    if (isSupply) setSupplyText(v)
    else setDemandText(v)
  }

  const updateRecommendation = (id: string, patch: Partial<Recommendation>) => {
    const updater = (list: Recommendation[]) => list.map((r) => (r.id === id ? { ...r, ...patch } : r))
    if (isSupply) setSupplyRecs(updater)
    else setDemandRecs(updater)
  }

  const addAction = (action: ReviewAction) => setActions((prev) => [action, ...prev])
  const updateAction = (id: string, patch: Partial<ReviewAction>) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  const canDrillScope = isSupply && (isHotelier || viewMode === 'customer' || viewMode === 'internal')
  const isInternal = viewMode === 'internal' && !isHotelier && !isPublicShare
  const isModuleShared = (id: ReportModuleId) => enabledModules.includes(id)
  const shouldShowModule = (id: ReportModuleId) => isInternal || isModuleShared(id)

  const value: ReportState = {
    perspective,
    accountType,
    viewMode,
    viewPeriod,
    periodLabel,
    customFrom,
    customTo,
    compareWith,
    previousCompareLabel: compare.previousLabel,
    lyCompareLabel: compare.lyLabel,
    previousCompareName: compare.previousName,
    lyCompareName: compare.lyName,
    chartMetric,
    narrative,
    recommendations,
    actions,
    reportTitle,
    reportStatus,
    scopeLevel,
    selectedBrandId,
    selectedPropertyId,
    maxScopeLevel,
    lockedBrandId,
    partnerName,
    canScopeBrandProperty,
    activeScopeLabel,
    activeScopeKpis,
    visibleBrands,
    visibleProperties,
    enabledModules,
    setEnabledModules,
    isModuleShared,
    shouldShowModule,
    setReportTitle,
    setReportStatus,
    setPartnerName,
    setPerspective,
    setAccountType,
    setViewMode,
    setViewPeriod,
    setCustomRange,
    setCompareWith,
    setChartMetric,
    setNarrative,
    updateRecommendation,
    addAction,
    updateAction,
    openBrand,
    openProperty,
    goToScope,
    resetScope,
    isInternal,
    isFullStack: accountType === 'full',
    isSupply,
    canDrillScope,
  }

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}

export function useReport() {
  const ctx = useContext(ReportContext)
  if (!ctx) throw new Error('useReport must be used within ReportProvider')
  return ctx
}
