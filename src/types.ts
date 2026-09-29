export type PartnerPerspective = 'supply' | 'demand'
export type AccountType = 'direct' | 'full'
export type ViewMode = 'internal' | 'customer'
export type ViewPeriod = 'month' | 'quarter' | 'ytd' | 'custom'
export type CompareWith = 'none' | 'previous' | 'ly' | 'both'
export type Granularity = 'daily' | 'weekly' | 'monthly'
export type ScopeLevel = 'chain' | 'brand' | 'property'
export type UserKind = 'account_manager' | 'hotelier'
export type ReportModuleId =
  | 'scorecard'
  | 'content-score'
  | 'ai-visibility'
  | 'direct'
  | 'indirect'
  | 'parity'
  | 'marketing'
  | 'outlook'
  | 'recommendations'
export type OutputFormat = 'in_app' | 'pdf' | 'xlsx' | 'email'
export type KpiStatus = 'on_track' | 'improving' | 'watch' | 'action_needed'
export type ReportStatus = 'draft' | 'shared'
export type RecStatus = 'proposed' | 'accepted' | 'deferred' | 'rejected'
export type RecPriority = 'high' | 'medium' | 'low'
export type ActionStatus = 'open' | 'in_progress' | 'done'
export type DataStateKind =
  | 'unavailable'
  | 'not_subscribed'
  | 'integration'
  | 'processing'
  | 'partial'
  | 'stale'
export type ChartMetric = 'revenue' | 'reservations' | 'roomNights' | 'adr'

export type ChangeKind = 'pct' | 'pts' | 'abs' | 'days' | 'x'

export interface ComparisonValue {
  qoq: number
  yoy: number
  kind: ChangeKind
}

export interface KpiMetric {
  id: string
  label: string
  value: string
  raw?: number
  comparisons: ComparisonValue
  status: KpiStatus
  tooltip: string
  trend: number[]
  estimate?: boolean
  fullStackOnly?: boolean
  internalOnly?: boolean
  share?: {
    label: string
    value: string
    comparisons: ComparisonValue
    tooltip: string
  }
}

export interface ScopeKpis {
  revenue: string
  revenueRaw: number
  revenueVsPrior: number
  directRevenue: string
  directShare: string
  directVsPrior: number
  roomNights: string
  roomNightsRaw: number
  roomNightsVsPrior: number
  conversion: string
  conversionVsPrior: number
  parityWin: string
  parityWinVsPrior: number
}

export interface HierarchyProperty {
  id: string
  name: string
  brandId: string
  city: string
  kpis: ScopeKpis
}

export interface HierarchyBrand {
  id: string
  name: string
  propertyCount: number
  kpis: ScopeKpis
  propertyIds: string[]
}

export interface ChainHierarchy {
  id: string
  name: string
  propertyCount: number
  kpis: ScopeKpis
  brands: HierarchyBrand[]
  properties: HierarchyProperty[]
}

export interface LibraryReport {
  id: string
  partner: string
  perspective: PartnerPerspective
  accountType: AccountType
  scope: string
  period: string
  status: ReportStatus
  generated: string
  region: string
}

export interface FunnelStage {
  id: string
  label: string
  value: number
  dropOff?: number
  highlight?: boolean
  definition: string
  deviceSplit: { device: string; share: number }[]
  properties: { name: string; dropOff: number }[]
  action: string
}

export interface AttributionRow {
  source: string
  sessions: number
  bookings: number
  revenue: number
  conversion: number
  trend: number
  type: 'Organic' | 'Paid' | '—'
  paidSource: string
  spend: number | null
  roas: number | null
}

export interface ChannelRow {
  channel: string
  roomNights: number
  revenue: number
  share: number
  commissionPct: number
  commission: number
  vsLy: number
  cancelRate: number
  leadTime: number
}

export interface ParityOtaLoss {
  ota: string
  lossEvents: number
  avgUndercut: number
  worstProperty: string
}

export interface CampaignRow {
  name: string
  spend: number
  bookings: number
  revenue: number
  roas: number
  internalOnly?: boolean
}

export interface DemandMarket {
  id: string
  market: string
  index: number
  level: 'High' | 'Above average' | 'Soft'
  events: string
  peak: string
  posture: string
  properties: string[]
  trend: number[]
}

export interface Recommendation {
  id: string
  rank: number
  title: string
  evidence: string
  impact: string
  impactValue: number
  confidence: 'High' | 'Medium' | 'Low'
  priority: RecPriority
  owner: string
  status: RecStatus
  customerVisible: boolean
  assumptions: string[]
  sources: string[]
}

export interface ReviewAction {
  id: string
  action: string
  owner: string
  due: string
  status: ActionStatus
  related: string
  notes: string
}
