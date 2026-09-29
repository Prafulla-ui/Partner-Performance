import type {
  AccountType,
  AttributionRow,
  CampaignRow,
  ChainHierarchy,
  ChannelRow,
  DemandMarket,
  FunnelStage,
  HierarchyBrand,
  HierarchyProperty,
  KpiMetric,
  LibraryReport,
  ParityOtaLoss,
  PartnerPerspective,
  Recommendation,
  ReviewAction,
  ScopeKpis,
} from '../types'

export const PARTNER = {
  name: 'Grand Meridian Hotels & Resorts',
  region: 'APMEA',
  scope: '12 properties',
  accountManager: 'Priya Sharma',
  period: 'Q2 2026',
  dateRange: '1 April–30 June 2026',
  compare: 'Q1 2026 and Q2 2025',
  currency: 'USD',
  generated: '4 July 2026, 06:00 IST',
  freshness: 'Updated 4 July 2026, 06:00 IST',
}

export const libraryReports: LibraryReport[] = [
  {
    id: 'grand-meridian-q2-2026',
    partner: 'Grand Meridian Hotels & Resorts',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Chain — 12 properties',
    period: 'Q2 2026',
    status: 'shared',
    generated: '4 Jul 2026',
    region: 'APMEA',
  },
  {
    id: 'grand-meridian-dubai-q2-2026',
    partner: 'Grand Meridian Hotels & Resorts',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Property — GM Dubai Marina',
    period: 'Q2 2026',
    status: 'shared',
    generated: '4 Jul 2026',
    region: 'APMEA',
  },
  {
    id: 'grand-meridian-london-q2-2026',
    partner: 'Grand Meridian Hotels & Resorts',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Brand — GM Europe Select',
    period: 'Q2 2026',
    status: 'draft',
    generated: '5 Jul 2026',
    region: 'EMEA',
  },
  {
    id: 'grand-meridian-miami-jun-2026',
    partner: 'Grand Meridian Hotels & Resorts',
    perspective: 'supply',
    accountType: 'direct',
    scope: 'Property — GM Miami Beach',
    period: 'Jun 2026',
    status: 'shared',
    generated: '3 Jul 2026',
    region: 'Americas',
  },
  {
    id: 'azure-sands-q2-2026',
    partner: 'Azure Sands Collection',
    perspective: 'supply',
    accountType: 'direct',
    scope: 'Brand — 6 properties',
    period: 'Q2 2026',
    status: 'draft',
    generated: '3 Jul 2026',
    region: 'EMEA',
  },
  {
    id: 'pacific-voyage-jun-2026',
    partner: 'Pacific Voyage Hotels',
    perspective: 'demand',
    accountType: 'full',
    scope: 'Chain — 18 properties',
    period: 'Jun 2026',
    status: 'shared',
    generated: '2 Jul 2026',
    region: 'APAC',
  },
  {
    id: 'lumen-residences-ytd-2026',
    partner: 'Lumen Residences',
    perspective: 'supply',
    accountType: 'direct',
    scope: 'Chain — 4 properties',
    period: 'YTD 2026',
    status: 'draft',
    generated: '1 Jul 2026',
    region: 'Americas',
  },
  {
    id: 'cedar-and-tide-q1-2026',
    partner: 'Cedar & Tide Inns',
    perspective: 'demand',
    accountType: 'full',
    scope: 'Brand — 9 properties',
    period: 'Q1 2026',
    status: 'shared',
    generated: '8 Apr 2026',
    region: 'APMEA',
  },
  {
    id: 'northstar-q2-2026',
    partner: 'Northstar Hospitality',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Chain — 22 properties',
    period: 'Q2 2026',
    status: 'draft',
    generated: '5 Jul 2026',
    region: 'Americas',
  },
  {
    id: 'silk-route-may-2026',
    partner: 'Silk Route Stays',
    perspective: 'demand',
    accountType: 'direct',
    scope: 'Brand — 7 properties',
    period: 'May 2026',
    status: 'shared',
    generated: '6 Jun 2026',
    region: 'APAC',
  },
  {
    id: 'harbour-light-q2-2026',
    partner: 'Harbour Light Hotels',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Chain — 11 properties',
    period: 'Q2 2026',
    status: 'shared',
    generated: '6 Jul 2026',
    region: 'EMEA',
  },
  {
    id: 'alta-vista-q1-2026',
    partner: 'Alta Vista Resorts',
    perspective: 'supply',
    accountType: 'direct',
    scope: 'Brand — 5 properties',
    period: 'Q1 2026',
    status: 'draft',
    generated: '12 Apr 2026',
    region: 'Americas',
  },
  {
    id: 'amber-court-jun-2026',
    partner: 'Amber Court Group',
    perspective: 'demand',
    accountType: 'full',
    scope: 'Chain — 6 properties',
    period: 'Jun 2026',
    status: 'draft',
    generated: '30 Jun 2026',
    region: 'APMEA',
  },
  {
    id: 'river-oak-q2-2026',
    partner: 'River Oak Inns',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Chain — 8 properties',
    period: 'Q2 2026',
    status: 'shared',
    generated: '7 Jul 2026',
    region: 'EMEA',
  },
  {
    id: 'cinder-peak-ytd-2026',
    partner: 'Cinder Peak Lodges',
    perspective: 'demand',
    accountType: 'direct',
    scope: 'Brand — 3 properties',
    period: 'YTD 2026',
    status: 'draft',
    generated: '8 Jul 2026',
    region: 'Americas',
  },
  {
    id: 'orchid-bay-q2-2026',
    partner: 'Orchid Bay Hotels',
    perspective: 'supply',
    accountType: 'full',
    scope: 'Chain — 16 properties',
    period: 'Q2 2026',
    status: 'shared',
    generated: '9 Jul 2026',
    region: 'APAC',
  },
]

export const supplyKpis: KpiMetric[] = [
  {
    id: 'total-rev',
    label: 'Total room revenue',
    value: '$6.82M',
    comparisons: { qoq: 9.4, yoy: 14.2, kind: 'pct' },
    status: 'on_track',
    tooltip: 'All-channel room revenue for the selected period, rolled up across the 12-property chain.',
    trend: [5.9, 6.1, 6.3, 6.4, 6.6, 6.82],
  },
  {
    id: 'direct-rev',
    label: 'Direct revenue',
    value: '$2.41M',
    comparisons: { qoq: 12.6, yoy: 21.9, kind: 'pct' },
    status: 'improving',
    tooltip: 'Revenue booked through the brand website and booking engine. Direct share is the same result expressed as a mix of total room revenue.',
    trend: [1.82, 1.94, 2.05, 2.14, 2.28, 2.41],
    share: {
      label: 'Share of total',
      value: '35.3%',
      comparisons: { qoq: 1.0, yoy: 2.2, kind: 'pts' },
      tooltip: 'Direct revenue as a share of total room revenue. Changes are shown in percentage points.',
    },
  },
  {
    id: 'content-score',
    label: 'Content score',
    value: '72',
    raw: 72,
    comparisons: { qoq: 4, yoy: 9, kind: 'pts' },
    status: 'watch',
    tooltip:
      'Composite quality of Grand Meridian brand-website content: page completeness, freshness, destination copy, imagery, and booking-path messaging. Score out of 100; target is 80.',
    trend: [58, 61, 64, 68, 70, 72],
  },
  {
    id: 'ai-visibility',
    label: 'AI visibility',
    value: '68',
    raw: 68,
    comparisons: { qoq: 3, yoy: 7, kind: 'pts' },
    status: 'watch',
    tooltip:
      'RateGain AI Visibility score for hotel imagery: photo quality, room and amenity coverage, tagging accuracy, and visual consistency across brand and OTA galleries. Score out of 100; target is 80.',
    trend: [54, 57, 60, 63, 66, 68],
  },
  {
    id: 'indirect-rev',
    label: 'Indirect revenue',
    value: '$4.27M',
    raw: 4_266_540,
    comparisons: { qoq: 6.1, yoy: 8.7, kind: 'pct' },
    status: 'watch',
    tooltip: 'OTA, GDS and wholesale room revenue. Shown for Full Stack accounts only.',
    trend: [3.71, 3.84, 3.97, 4.08, 4.18, 4.27],
    fullStackOnly: true,
  },
  {
    id: 'ota-comm',
    label: 'OTA commission',
    value: '$455K',
    comparisons: { qoq: 5.8, yoy: 7.9, kind: 'pct' },
    status: 'watch',
    tooltip: 'Estimated commission paid on OTA production this period.',
    trend: [390, 405, 418, 430, 442, 455],
    estimate: true,
    fullStackOnly: true,
  },
  {
    id: 'parity-win',
    label: 'Rate parity win rate',
    value: '71%',
    comparisons: { qoq: -3, yoy: -6, kind: 'pts' },
    status: 'action_needed',
    tooltip: 'Share of parity checks where the direct rate is at or below the OTA rate. Target is 85%.',
    trend: [80, 78, 76, 75, 73, 71],
  },
  {
    id: 'conversion',
    label: 'Website conversion',
    value: '1.56%',
    comparisons: { qoq: 0.09, yoy: 0.21, kind: 'pts' },
    status: 'improving',
    tooltip: 'Confirmed bookings divided by website sessions. Changes are shown in percentage points.',
    trend: [1.28, 1.32, 1.38, 1.47, 1.51, 1.56],
  },
  {
    id: 'parity-leak',
    label: 'Estimated parity leakage',
    value: '$182K',
    comparisons: { qoq: 21000, yoy: 44000, kind: 'abs' },
    status: 'action_needed',
    tooltip: 'Estimated direct revenue diverted to OTAs on loss events. This is a modelled estimate, not booked revenue.',
    trend: [118, 132, 148, 161, 171, 182],
    estimate: true,
  },
]

export const demandKpis: KpiMetric[] = [
  {
    id: 'partner-bookings',
    label: 'Partner bookings',
    value: '6,140',
    comparisons: { qoq: 8.4, yoy: 16.1, kind: 'pct' },
    status: 'on_track',
    tooltip: 'Reservations produced through the demand partnership this period.',
    trend: [4800, 5120, 5450, 5660, 5900, 6140],
  },
  {
    id: 'partner-rev',
    label: 'Partner revenue',
    value: '$1.68M',
    comparisons: { qoq: 10.2, yoy: 18.6, kind: 'pct' },
    status: 'improving',
    tooltip: 'Room revenue attributed to demand-partner production.',
    trend: [1.28, 1.36, 1.44, 1.52, 1.6, 1.68],
  },
  {
    id: 'room-nights',
    label: 'Room-night production',
    value: '14,820',
    comparisons: { qoq: 9.1, yoy: 15.4, kind: 'pct' },
    status: 'on_track',
    tooltip: 'Occupied room nights generated by the demand partner.',
    trend: [11800, 12400, 13100, 13600, 14200, 14820],
  },
  {
    id: 'coverage',
    label: 'Property coverage',
    value: '12 of 12',
    comparisons: { qoq: 0, yoy: 2, kind: 'abs' },
    status: 'on_track',
    tooltip: 'Properties receiving live demand-partner production this period.',
    trend: [10, 10, 11, 11, 12, 12],
  },
  {
    id: 'look-book',
    label: 'Look-to-book conversion',
    value: '2.84%',
    comparisons: { qoq: 0.12, yoy: 0.31, kind: 'pts' },
    status: 'improving',
    tooltip: 'Bookings divided by qualified shop requests from the demand partner.',
    trend: [2.4, 2.48, 2.55, 2.62, 2.72, 2.84],
  },
  {
    id: 'cancel',
    label: 'Cancellation rate',
    value: '18.4%',
    comparisons: { qoq: -0.6, yoy: -1.1, kind: 'pts' },
    status: 'watch',
    tooltip: 'Cancelled reservations as a share of partner bookings. Still above the 15% quality target.',
    trend: [20.1, 19.8, 19.4, 19.0, 18.7, 18.4],
  },
  {
    id: 'lead',
    label: 'Average lead time',
    value: '16 days',
    comparisons: { qoq: 1, yoy: 2, kind: 'days' },
    status: 'improving',
    tooltip: 'Average days between booking and arrival for partner reservations.',
    trend: [13, 13.5, 14, 14.5, 15.2, 16],
  },
  {
    id: 'incremental',
    label: 'Estimated incremental demand',
    value: '$312K',
    comparisons: { qoq: 28000, yoy: 64000, kind: 'abs' },
    status: 'improving',
    tooltip: 'Modelled revenue that would not have booked on other contracted channels. Estimate only.',
    trend: [210, 228, 246, 268, 290, 312],
    estimate: true,
  },
]

export const bookingKpis: KpiMetric[] = [
  {
    id: 'res',
    label: 'Reservations',
    value: '8,412',
    comparisons: { qoq: 11.8, yoy: 20.4, kind: 'pct' },
    status: 'improving',
    tooltip: 'Confirmed direct reservations in the period.',
    trend: [6200, 6680, 7100, 7524, 7980, 8412],
  },
  {
    id: 'rn',
    label: 'Room nights',
    value: '19,254',
    comparisons: { qoq: 12.5, yoy: 19.8, kind: 'pct' },
    status: 'improving',
    tooltip: 'Occupied room nights from direct bookings.',
    trend: [14800, 15600, 16400, 17110, 18200, 19254],
  },
  {
    id: 'drev',
    label: 'Direct revenue',
    value: '$2.41M',
    comparisons: { qoq: 12.6, yoy: 21.9, kind: 'pct' },
    status: 'improving',
    tooltip: 'Gross room revenue from the booking engine.',
    trend: [1.82, 1.94, 2.05, 2.14, 2.28, 2.41],
  },
  {
    id: 'adr',
    label: 'ADR',
    value: '$178',
    comparisons: { qoq: 3.5, yoy: 5.9, kind: 'pct' },
    status: 'on_track',
    tooltip: 'Average daily rate on direct room nights.',
    trend: [164, 167, 170, 172, 175, 178],
  },
  {
    id: 'abv',
    label: 'Average booking value',
    value: '$287',
    comparisons: { qoq: 1.1, yoy: 4.0, kind: 'pct' },
    status: 'on_track',
    tooltip: 'Average revenue per confirmed reservation.',
    trend: [268, 272, 276, 284, 285, 287],
  },
  {
    id: 'leadtime',
    label: 'Average lead time',
    value: '21 days',
    comparisons: { qoq: 2, yoy: 3, kind: 'days' },
    status: 'improving',
    tooltip: 'Average days between booking and arrival.',
    trend: [16, 17, 18, 19, 20, 21],
  },
  {
    id: 'cx',
    label: 'Cancellation rate',
    value: '11.2%',
    comparisons: { qoq: -0.7, yoy: -1.4, kind: 'pts' },
    status: 'improving',
    tooltip: 'Cancelled direct reservations. A decline in percentage points is an improvement.',
    trend: [13.1, 12.6, 12.2, 11.9, 11.5, 11.2],
  },
  {
    id: 'sessions',
    label: 'Website sessions',
    value: '542,300',
    comparisons: { qoq: 8.7, yoy: 15.2, kind: 'pct' },
    status: 'on_track',
    tooltip: 'Sessions on brand websites included in the chain roll-up.',
    trend: [448000, 468000, 486000, 498700, 521000, 542300],
  },
]

export const monthlyTrend = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  revenue: {
    current: [680000, 710000, 735000, 760000, 810000, 840000],
    previous: [610000, 640000, 665000, 680000, 720000, 740000],
    ly: [560000, 585000, 600000, 610000, 655000, 710000],
  },
  reservations: {
    current: [2380, 2480, 2580, 2680, 2820, 2912],
    previous: [2140, 2240, 2330, 2410, 2520, 2594],
    ly: [1920, 2020, 2100, 2140, 2280, 2560],
  },
  roomNights: {
    current: [5420, 5680, 5920, 6120, 6480, 6654],
    previous: [4920, 5140, 5320, 5480, 5780, 5850],
    ly: [4580, 4760, 4920, 5020, 5280, 5780],
  },
  adr: {
    current: [168, 170, 172, 174, 178, 182],
    previous: [163, 165, 167, 169, 172, 175],
    ly: [160, 162, 164, 166, 168, 172],
  },
}

export const funnelStages: FunnelStage[] = [
  {
    id: 'sessions',
    label: 'Site sessions',
    value: 542300,
    definition: 'Unique website sessions that reached a Grand Meridian property site in the period.',
    deviceSplit: [
      { device: 'Mobile', share: 61 },
      { device: 'Desktop', share: 33 },
      { device: 'Tablet', share: 6 },
    ],
    properties: [
      { name: 'GM Dubai Marina', dropOff: 0 },
      { name: 'GM Singapore Orchard', dropOff: 0 },
    ],
    action: 'Protect brand SEM and metasearch coverage to keep the top of funnel healthy.',
  },
  {
    id: 'search',
    label: 'Room / rate search',
    value: 301450,
    dropOff: 44.4,
    definition: 'Sessions that completed a stay-date and occupancy search.',
    deviceSplit: [
      { device: 'Mobile', share: 58 },
      { device: 'Desktop', share: 36 },
      { device: 'Tablet', share: 6 },
    ],
    properties: [
      { name: 'GM Bangkok Riverside', dropOff: 48.1 },
      { name: 'GM Jakarta City Centre', dropOff: 46.4 },
    ],
    action: 'Surface calendar availability earlier on mobile landing pages.',
  },
  {
    id: 'selected',
    label: 'Room selected',
    value: 96410,
    dropOff: 68.0,
    definition: 'Users who selected a room type and rate plan.',
    deviceSplit: [
      { device: 'Mobile', share: 54 },
      { device: 'Desktop', share: 40 },
      { device: 'Tablet', share: 6 },
    ],
    properties: [
      { name: 'GM Dubai Marina', dropOff: 71.2 },
      { name: 'GM Singapore Orchard', dropOff: 69.0 },
    ],
    action: 'Lead with member rates and package value instead of a long rate grid.',
  },
  {
    id: 'checkout',
    label: 'Checkout started',
    value: 31240,
    dropOff: 67.6,
    definition: 'Users who entered guest details on the booking form.',
    deviceSplit: [
      { device: 'Mobile', share: 51 },
      { device: 'Desktop', share: 43 },
      { device: 'Tablet', share: 6 },
    ],
    properties: [
      { name: 'GM Mumbai BKC', dropOff: 70.4 },
      { name: 'GM Delhi Aerocity', dropOff: 68.8 },
    ],
    action: 'Reduce required fields and persist the selected rate across login.',
  },
  {
    id: 'payment',
    label: 'Payment initiated',
    value: 14890,
    dropOff: 52.3,
    highlight: true,
    definition: 'Users who reached a payment method and attempted to pay. This is the largest recoverable leak.',
    deviceSplit: [
      { device: 'Mobile', share: 64 },
      { device: 'Desktop', share: 31 },
      { device: 'Tablet', share: 5 },
    ],
    properties: [
      { name: 'GM Mumbai BKC', dropOff: 58.6 },
      { name: 'GM Delhi Aerocity', dropOff: 55.1 },
      { name: 'GM Bengaluru Whitefield', dropOff: 54.2 },
    ],
    action: 'Add UPI and PayNow, plus a one-tap payment retry after a failed authorisation.',
  },
  {
    id: 'confirmed',
    label: 'Booking confirmed',
    value: 8412,
    dropOff: 43.5,
    definition: 'Successfully confirmed reservations issued a confirmation number.',
    deviceSplit: [
      { device: 'Mobile', share: 48 },
      { device: 'Desktop', share: 46 },
      { device: 'Tablet', share: 6 },
    ],
    properties: [
      { name: 'GM Dubai Marina', dropOff: 41.0 },
      { name: 'GM Singapore Orchard', dropOff: 39.8 },
    ],
    action: 'Keep confirmation and upsell messaging consistent with the selected rate.',
  },
]

export const attributionRows: AttributionRow[] = [
  { source: 'Direct / brand', sessions: 182400, bookings: 3120, revenue: 912000, conversion: 1.71, trend: 4.2, type: 'Organic', paidSource: '—', spend: null, roas: null },
  { source: 'Organic search', sessions: 141200, bookings: 1905, revenue: 536000, conversion: 1.35, trend: 9.0, type: 'Organic', paidSource: '—', spend: null, roas: null },
  { source: 'Paid search', sessions: 88100, bookings: 1610, revenue: 468000, conversion: 1.83, trend: 11.4, type: 'Paid', paidSource: 'Google Ads', spend: 9800, roas: 19.0 },
  { source: 'Metasearch', sessions: 45900, bookings: 902, revenue: 272000, conversion: 1.96, trend: 13.8, type: 'Paid', paidSource: 'Google HPA', spend: 22100, roas: 6.7 },
  { source: 'Email / CRM', sessions: 37600, bookings: 512, revenue: 138000, conversion: 1.35, trend: 2.1, type: 'Organic', paidSource: '—', spend: null, roas: null },
  { source: 'Social', sessions: 28700, bookings: 204, revenue: 52000, conversion: 0.7, trend: -3.4, type: 'Paid', paidSource: 'Meta', spend: 18400, roas: 2.8 },
  { source: 'Referral / other', sessions: 18400, bookings: 159, revenue: 33000, conversion: 0.88, trend: 1.2, type: '—', paidSource: '—', spend: null, roas: null },
]

export const channelRows: ChannelRow[] = [
  { channel: 'Booking.com', roomNights: 9840, revenue: 1190000, share: 17.4, commissionPct: 18, commission: 214000, vsLy: 9.2, cancelRate: 24.6, leadTime: 12 },
  { channel: 'Expedia Group', roomNights: 6120, revenue: 702000, share: 10.3, commissionPct: 18, commission: 126000, vsLy: 4.1, cancelRate: 22.1, leadTime: 13 },
  { channel: 'Agoda', roomNights: 3410, revenue: 355000, share: 5.2, commissionPct: 17, commission: 60000, vsLy: 12.8, cancelRate: 21.4, leadTime: 11 },
  { channel: 'Trip.com', roomNights: 1270, revenue: 138000, share: 2.0, commissionPct: 16, commission: 22000, vsLy: 21.5, cancelRate: 19.8, leadTime: 18 },
  { channel: 'GDS / Wholesale', roomNights: 1480, revenue: 146000, share: 2.1, commissionPct: 22, commission: 32000, vsLy: -3.4, cancelRate: 8.4, leadTime: 34 },
]

export const channelMix = [
  { name: 'Direct', value: 35.3, color: '#4B3FE1' },
  { name: 'OTA', value: 37.1, color: '#2575FC' },
  { name: 'GDS / wholesale', value: 2.1, color: '#07B787' },
]

export const propertyProduction = [
  { property: 'GM Dubai Marina', nights: 2840, revenue: 412000, channel: 'Booking.com' },
  { property: 'GM Singapore Orchard', nights: 2410, revenue: 368000, channel: 'Expedia Group' },
  { property: 'GM Bangkok Riverside', nights: 1980, revenue: 214000, channel: 'Agoda' },
  { property: 'GM Jakarta City Centre', nights: 1320, revenue: 148000, channel: 'Trip.com' },
]

function kpis(partial: ScopeKpis): ScopeKpis {
  return partial
}

export const chainHierarchy: ChainHierarchy = {
  id: 'grand-meridian',
  name: 'Grand Meridian Hotels & Resorts',
  propertyCount: 12,
  kpis: kpis({
    revenue: '$6.82M',
    revenueRaw: 6820000,
    revenueVsPrior: 9.4,
    directRevenue: '$2.41M',
    directShare: '35.3%',
    directVsPrior: 12.6,
    roomNights: '48,620',
    roomNightsRaw: 48620,
    roomNightsVsPrior: 7.8,
    conversion: '1.55%',
    conversionVsPrior: 0.12,
    parityWin: '71%',
    parityWinVsPrior: -2.1,
  }),
  brands: [
    {
      id: 'gm-luxury',
      name: 'Grand Meridian Luxury',
      propertyCount: 4,
      propertyIds: ['gm-dubai', 'gm-singapore', 'gm-bangkok', 'gm-mumbai'],
      kpis: kpis({
        revenue: '$3.12M',
        revenueRaw: 3120000,
        revenueVsPrior: 11.2,
        directRevenue: '$1.18M',
        directShare: '37.8%',
        directVsPrior: 14.1,
        roomNights: '18,420',
        roomNightsRaw: 18420,
        roomNightsVsPrior: 9.4,
        conversion: '1.72%',
        conversionVsPrior: 0.18,
        parityWin: '74%',
        parityWinVsPrior: -1.4,
      }),
    },
    {
      id: 'gm-select',
      name: 'Grand Meridian Select',
      propertyCount: 5,
      propertyIds: ['gm-delhi', 'gm-bengaluru', 'gm-jakarta', 'gm-kl', 'gm-manila'],
      kpis: kpis({
        revenue: '$2.48M',
        revenueRaw: 2480000,
        revenueVsPrior: 8.1,
        directRevenue: '$820K',
        directShare: '33.1%',
        directVsPrior: 10.4,
        roomNights: '19,860',
        roomNightsRaw: 19860,
        roomNightsVsPrior: 6.2,
        conversion: '1.41%',
        conversionVsPrior: 0.08,
        parityWin: '68%',
        parityWinVsPrior: -3.2,
      }),
    },
    {
      id: 'gm-residences',
      name: 'Grand Meridian Residences',
      propertyCount: 3,
      propertyIds: ['gm-abu-dhabi', 'gm-phuket', 'gm-bali'],
      kpis: kpis({
        revenue: '$1.22M',
        revenueRaw: 1220000,
        revenueVsPrior: 6.8,
        directRevenue: '$410K',
        directShare: '33.6%',
        directVsPrior: 9.2,
        roomNights: '10,340',
        roomNightsRaw: 10340,
        roomNightsVsPrior: 5.1,
        conversion: '1.38%',
        conversionVsPrior: 0.05,
        parityWin: '70%',
        parityWinVsPrior: -1.8,
      }),
    },
  ],
  properties: [
    {
      id: 'gm-dubai',
      name: 'GM Dubai Marina',
      brandId: 'gm-luxury',
      city: 'Dubai',
      kpis: kpis({
        revenue: '$980K',
        revenueRaw: 980000,
        revenueVsPrior: 13.4,
        directRevenue: '$392K',
        directShare: '40.0%',
        directVsPrior: 15.2,
        roomNights: '5,120',
        roomNightsRaw: 5120,
        roomNightsVsPrior: 11.0,
        conversion: '1.88%',
        conversionVsPrior: 0.22,
        parityWin: '76%',
        parityWinVsPrior: -0.8,
      }),
    },
    {
      id: 'gm-singapore',
      name: 'GM Singapore Orchard',
      brandId: 'gm-luxury',
      city: 'Singapore',
      kpis: kpis({
        revenue: '$860K',
        revenueRaw: 860000,
        revenueVsPrior: 10.1,
        directRevenue: '$318K',
        directShare: '37.0%',
        directVsPrior: 12.4,
        roomNights: '4,680',
        roomNightsRaw: 4680,
        roomNightsVsPrior: 8.6,
        conversion: '1.74%',
        conversionVsPrior: 0.16,
        parityWin: '75%',
        parityWinVsPrior: -1.1,
      }),
    },
    {
      id: 'gm-bangkok',
      name: 'GM Bangkok Riverside',
      brandId: 'gm-luxury',
      city: 'Bangkok',
      kpis: kpis({
        revenue: '$720K',
        revenueRaw: 720000,
        revenueVsPrior: 9.2,
        directRevenue: '$252K',
        directShare: '35.0%',
        directVsPrior: 11.0,
        roomNights: '4,910',
        roomNightsRaw: 4910,
        roomNightsVsPrior: 7.4,
        conversion: '1.58%',
        conversionVsPrior: 0.1,
        parityWin: '69%',
        parityWinVsPrior: -2.8,
      }),
    },
    {
      id: 'gm-mumbai',
      name: 'GM Mumbai BKC',
      brandId: 'gm-luxury',
      city: 'Mumbai',
      kpis: kpis({
        revenue: '$560K',
        revenueRaw: 560000,
        revenueVsPrior: 12.0,
        directRevenue: '$218K',
        directShare: '38.9%',
        directVsPrior: 18.4,
        roomNights: '3,710',
        roomNightsRaw: 3710,
        roomNightsVsPrior: 10.2,
        conversion: '1.62%',
        conversionVsPrior: 0.2,
        parityWin: '73%',
        parityWinVsPrior: -1.0,
      }),
    },
    {
      id: 'gm-delhi',
      name: 'GM Delhi Aerocity',
      brandId: 'gm-select',
      city: 'Delhi',
      kpis: kpis({
        revenue: '$540K',
        revenueRaw: 540000,
        revenueVsPrior: 7.4,
        directRevenue: '$178K',
        directShare: '33.0%',
        directVsPrior: 9.8,
        roomNights: '4,220',
        roomNightsRaw: 4220,
        roomNightsVsPrior: 5.8,
        conversion: '1.36%',
        conversionVsPrior: 0.06,
        parityWin: '67%',
        parityWinVsPrior: -3.6,
      }),
    },
    {
      id: 'gm-bengaluru',
      name: 'GM Bengaluru Whitefield',
      brandId: 'gm-select',
      city: 'Bengaluru',
      kpis: kpis({
        revenue: '$510K',
        revenueRaw: 510000,
        revenueVsPrior: 8.8,
        directRevenue: '$168K',
        directShare: '32.9%',
        directVsPrior: 11.2,
        roomNights: '4,060',
        roomNightsRaw: 4060,
        roomNightsVsPrior: 6.4,
        conversion: '1.44%',
        conversionVsPrior: 0.09,
        parityWin: '66%',
        parityWinVsPrior: -4.0,
      }),
    },
    {
      id: 'gm-jakarta',
      name: 'GM Jakarta City Centre',
      brandId: 'gm-select',
      city: 'Jakarta',
      kpis: kpis({
        revenue: '$480K',
        revenueRaw: 480000,
        revenueVsPrior: 6.2,
        directRevenue: '$154K',
        directShare: '32.1%',
        directVsPrior: 8.4,
        roomNights: '3,940',
        roomNightsRaw: 3940,
        roomNightsVsPrior: 4.9,
        conversion: '1.32%',
        conversionVsPrior: 0.04,
        parityWin: '70%',
        parityWinVsPrior: -2.2,
      }),
    },
    {
      id: 'gm-kl',
      name: 'GM Kuala Lumpur City',
      brandId: 'gm-select',
      city: 'Kuala Lumpur',
      kpis: kpis({
        revenue: '$470K',
        revenueRaw: 470000,
        revenueVsPrior: 9.0,
        directRevenue: '$160K',
        directShare: '34.0%',
        directVsPrior: 10.6,
        roomNights: '3,820',
        roomNightsRaw: 3820,
        roomNightsVsPrior: 7.1,
        conversion: '1.48%',
        conversionVsPrior: 0.11,
        parityWin: '71%',
        parityWinVsPrior: -1.6,
      }),
    },
    {
      id: 'gm-manila',
      name: 'GM Manila Bay',
      brandId: 'gm-select',
      city: 'Manila',
      kpis: kpis({
        revenue: '$480K',
        revenueRaw: 480000,
        revenueVsPrior: 8.5,
        directRevenue: '$160K',
        directShare: '33.3%',
        directVsPrior: 12.0,
        roomNights: '3,820',
        roomNightsRaw: 3820,
        roomNightsVsPrior: 6.8,
        conversion: '1.45%',
        conversionVsPrior: 0.1,
        parityWin: '69%',
        parityWinVsPrior: -2.9,
      }),
    },
    {
      id: 'gm-abu-dhabi',
      name: 'GM Abu Dhabi Corniche',
      brandId: 'gm-residences',
      city: 'Abu Dhabi',
      kpis: kpis({
        revenue: '$460K',
        revenueRaw: 460000,
        revenueVsPrior: 7.1,
        directRevenue: '$161K',
        directShare: '35.0%',
        directVsPrior: 9.4,
        roomNights: '3,640',
        roomNightsRaw: 3640,
        roomNightsVsPrior: 5.6,
        conversion: '1.42%',
        conversionVsPrior: 0.07,
        parityWin: '72%',
        parityWinVsPrior: -1.2,
      }),
    },
    {
      id: 'gm-phuket',
      name: 'GM Phuket Beach',
      brandId: 'gm-residences',
      city: 'Phuket',
      kpis: kpis({
        revenue: '$400K',
        revenueRaw: 400000,
        revenueVsPrior: 6.4,
        directRevenue: '$132K',
        directShare: '33.0%',
        directVsPrior: 8.8,
        roomNights: '3,480',
        roomNightsRaw: 3480,
        roomNightsVsPrior: 4.8,
        conversion: '1.35%',
        conversionVsPrior: 0.04,
        parityWin: '68%',
        parityWinVsPrior: -2.4,
      }),
    },
    {
      id: 'gm-bali',
      name: 'GM Bali Seminyak',
      brandId: 'gm-residences',
      city: 'Bali',
      kpis: kpis({
        revenue: '$360K',
        revenueRaw: 360000,
        revenueVsPrior: 6.9,
        directRevenue: '$117K',
        directShare: '32.5%',
        directVsPrior: 9.0,
        roomNights: '3,220',
        roomNightsRaw: 3220,
        roomNightsVsPrior: 4.9,
        conversion: '1.36%',
        conversionVsPrior: 0.05,
        parityWin: '70%',
        parityWinVsPrior: -1.9,
      }),
    },
  ],
}

export function getBrandById(id: string) {
  return chainHierarchy.brands.find((b) => b.id === id)
}

export function getPropertyById(id: string) {
  return chainHierarchy.properties.find((p) => p.id === id)
}

export function getPropertiesForBrand(brandId: string) {
  return chainHierarchy.properties.filter((p) => p.brandId === brandId)
}

export type PartnerScopeBrand = { id: string; name: string }
export type PartnerScopeProperty = { id: string; name: string; brandId: string }

function partnerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28)
}

/** Brand / property options — Grand Meridian uses live hierarchy; others use partner locations. */
export function getPartnerScopeTree(partnerName: string): {
  brands: PartnerScopeBrand[]
  properties: PartnerScopeProperty[]
} {
  if (partnerName === PARTNER.name) {
    return {
      brands: chainHierarchy.brands.map((b) => ({ id: b.id, name: b.name })),
      properties: chainHierarchy.properties.map((p) => ({
        id: p.id,
        name: p.name,
        brandId: p.brandId,
      })),
    }
  }

  const entry = partnerDirectory.find((p) => p.name === partnerName)
  if (!entry) return { brands: [], properties: [] }

  // Single-site hotels stay flat — no brand/property drill.
  if (entry.orgType === 'Hotel' || entry.locations.length <= 1) {
    return { brands: [], properties: [] }
  }

  const short = partnerName.split(' ')[0]
  const slug = partnerSlug(partnerName)
  const mid = Math.ceil(entry.locations.length / 2)
  const brandDefs = [
    { id: `${slug}-flagship`, name: `${short} Flagship`, cities: entry.locations.slice(0, mid) },
    { id: `${slug}-select`, name: `${short} Select`, cities: entry.locations.slice(mid) },
  ].filter((b) => b.cities.length > 0)

  return {
    brands: brandDefs.map((b) => ({ id: b.id, name: b.name })),
    properties: brandDefs.flatMap((b) =>
      b.cities.map((city) => ({
        id: `${b.id}-${partnerSlug(city)}`,
        name: `${short} ${city}`,
        brandId: b.id,
      })),
    ),
  }
}

/** Hierarchy-shaped brands/properties for report filters and breadcrumbs. */
export function getPartnerHierarchy(partnerName: string): {
  brands: HierarchyBrand[]
  properties: HierarchyProperty[]
  propertyCount: number
} {
  if (partnerName === PARTNER.name) {
    return {
      brands: chainHierarchy.brands,
      properties: chainHierarchy.properties,
      propertyCount: chainHierarchy.propertyCount,
    }
  }

  const tree = getPartnerScopeTree(partnerName)
  const brands: HierarchyBrand[] = tree.brands.map((b) => {
    const propertyIds = tree.properties.filter((p) => p.brandId === b.id).map((p) => p.id)
    return {
      id: b.id,
      name: b.name,
      propertyCount: propertyIds.length,
      propertyIds,
      kpis: chainHierarchy.brands[0]?.kpis ?? chainHierarchy.kpis,
    }
  })
  const properties: HierarchyProperty[] = tree.properties.map((p, i) => ({
    id: p.id,
    name: p.name,
    brandId: p.brandId,
    city: p.name.replace(/^\S+\s+/, ''),
    kpis:
      chainHierarchy.properties[i % Math.max(chainHierarchy.properties.length, 1)]?.kpis ??
      chainHierarchy.kpis,
  }))

  return { brands, properties, propertyCount: properties.length }
}

export const parityScore = {
  checks: 41220,
  win: 71,
  target: 85,
  loss: 18,
  meet: 11,
  undercut: -12.4,
  leakage: 182000,
}

export const parityLosses: ParityOtaLoss[] = [
  { ota: 'Agoda', lossEvents: 2914, avgUndercut: -14.8, worstProperty: 'GM Bangkok Riverside' },
  { ota: 'Booking.com', lossEvents: 2310, avgUndercut: -11.2, worstProperty: 'GM Dubai Marina' },
  { ota: 'Expedia', lossEvents: 1671, avgUndercut: -9.6, worstProperty: 'GM Singapore Orchard' },
  { ota: 'Trip.com', lossEvents: 524, avgUndercut: -13.1, worstProperty: 'GM Jakarta City Centre' },
]

export const marketingKpis: KpiMetric[] = [
  { id: 'org-sess', label: 'Organic sessions', value: '141,200', comparisons: { qoq: 9.0, yoy: 18.3, kind: 'pct' }, status: 'improving', tooltip: 'Sessions from unpaid search.', trend: [112000, 118000, 124000, 129500, 135000, 141200] },
  { id: 'kw', label: 'Keywords in top 10', value: '214', comparisons: { qoq: 26, yoy: 61, kind: 'abs' }, status: 'improving', tooltip: 'Brand and destination keywords ranking on page one.', trend: [148, 162, 176, 188, 201, 214] },
  { id: 'dr', label: 'Domain rating', value: '58', comparisons: { qoq: 1, yoy: 4, kind: 'abs' }, status: 'on_track', tooltip: 'Third-party domain authority score. Directional only.', trend: [53, 54, 55, 56, 57, 58] },
  { id: 'org-book', label: 'Organic-content bookings', value: '412', comparisons: { qoq: 11.4, yoy: 24.1, kind: 'pct' }, status: 'improving', tooltip: 'Bookings attributed to organic content pages.', trend: [280, 310, 338, 370, 390, 412] },
  { id: 'paid-spend', label: 'Paid-media spend', value: '$50.3K', comparisons: { qoq: 6.2, yoy: 12.0, kind: 'pct' }, status: 'on_track', tooltip: 'Media cost across SEM, metasearch and social. Internal-only in customer preview.', trend: [41, 43, 45, 47.4, 48.8, 50.3], internalOnly: true },
  { id: 'paid-rev', label: 'Paid-media revenue', value: '$462K', comparisons: { qoq: 13.8, yoy: 26.5, kind: 'pct' }, status: 'improving', tooltip: 'Direct revenue attributed to paid media.', trend: [320, 348, 376, 406, 434, 462] },
  { id: 'roas', label: 'Blended ROAS', value: '9.2x', comparisons: { qoq: 0.6, yoy: 1.1, kind: 'x' }, status: 'on_track', tooltip: 'Paid-media revenue divided by spend. Internal-only in customer preview.', trend: [7.4, 7.8, 8.1, 8.6, 8.9, 9.2], internalOnly: true },
]

export const organicTrend = [
  { month: 'Jan', sessions: 38100 },
  { month: 'Feb', sessions: 39600 },
  { month: 'Mar', sessions: 41400 },
  { month: 'Apr', sessions: 43800 },
  { month: 'May', sessions: 47200 },
  { month: 'Jun', sessions: 50200 },
]

export const paidTrend = [
  { month: 'Jan', spend: 13200, revenue: 118000 },
  { month: 'Feb', spend: 14100, revenue: 126000 },
  { month: 'Mar', spend: 14900, revenue: 134000 },
  { month: 'Apr', spend: 15800, revenue: 142000 },
  { month: 'May', spend: 16900, revenue: 154000 },
  { month: 'Jun', spend: 17600, revenue: 166000 },
]

export const campaigns: CampaignRow[] = [
  { name: 'Brand-Protect-SEM', spend: 9800, bookings: 703, revenue: 186000, roas: 19.0 },
  { name: 'Meta-Google-HPA', spend: 22100, bookings: 512, revenue: 148000, roas: 6.7 },
  { name: 'Summer-Suite-Upgrade', spend: 18400, bookings: 386, revenue: 128000, roas: 7.0 },
  { name: 'Direct-App-Retargeting', spend: 7200, bookings: 241, revenue: 82000, roas: 11.4 },
  { name: 'Loyalty-Member-Only', spend: 5400, bookings: 318, revenue: 97000, roas: 18.0 },
  { name: 'Metasearch-Kayak', spend: 11200, bookings: 274, revenue: 91000, roas: 8.1 },
]

export const demandMarkets: DemandMarket[] = [
  {
    id: 'dubai',
    market: 'Dubai',
    index: 86,
    level: 'High',
    events: 'GITEX, expo season',
    peak: '12–16 Oct 2026',
    posture: 'Raise BAR by 8–12% during GITEX',
    properties: ['GM Dubai Marina', 'GM Dubai Downtown'],
    trend: [68, 72, 76, 80, 84, 86],
  },
  {
    id: 'singapore',
    market: 'Singapore',
    index: 74,
    level: 'Above average',
    events: 'F1 race week',
    peak: '1–4 Oct 2026',
    posture: 'Apply a two-night minimum stay during F1 week',
    properties: ['GM Singapore Orchard', 'GM Singapore Marina'],
    trend: [62, 65, 68, 70, 72, 74],
  },
  {
    id: 'bangkok',
    market: 'Bangkok',
    index: 58,
    level: 'Soft',
    events: 'Low season, few city-wide events',
    peak: 'No material peak in 90 days',
    posture: 'Use value-added packages instead of rate cuts',
    properties: ['GM Bangkok Riverside', 'GM Bangkok Sukhumvit'],
    trend: [66, 64, 62, 60, 58, 58],
  },
]

export const supplyNarrative =
  'Grand Meridian grew total revenue by 9.4% quarter over quarter, with direct revenue growing faster than indirect revenue. The largest opportunities are improving rate parity and reducing payment-stage abandonment. Addressing these issues could recover an estimated $319K next quarter.'

export const demandNarrative =
  'The demand partnership produced 14,820 room nights and $1.68M in revenue for Grand Meridian in Q2, with look-to-book conversion improving by 0.12 percentage points. Incremental demand is estimated at $312K, led by Dubai and Singapore. Joint growth sits in Bangkok coverage, event-window packages, and bringing cancellation closer to the 15% quality target.'

export const supplyRecommendations: Recommendation[] = [
  {
    id: 'r1',
    rank: 1,
    title: 'Fix Agoda parity and audit wholesale contracts',
    evidence: '2,914 Agoda loss events at −14.8% average undercut; 61% tied to unmapped mobile-only rates.',
    impact: '+$95K direct revenue',
    impactValue: 95000,
    confidence: 'High',
    priority: 'high',
    owner: 'Revenue manager + parity team',
    status: 'accepted',
    customerVisible: true,
    assumptions: [
      'Assumes 40% of Agoda loss events convert back to direct after mapping.',
      'Uses current ADR of $178 and observed stay length.',
      'Does not include recovered commission on remaining OTA stays.',
    ],
    sources: ['Parity checks: 41,220', 'Agoda loss events: 2,914', 'Est. leakage: $182K'],
  },
  {
    id: 'r2',
    rank: 2,
    title: 'Reduce payment-stage drop-off through local payment methods and retry UX',
    evidence: '52.3% drop from checkout started to payment initiated; 43.5% drop from payment to confirm.',
    impact: '+$224K or approximately 780 bookings',
    impactValue: 224000,
    confidence: 'Medium',
    priority: 'high',
    owner: 'Product / IBE',
    status: 'accepted',
    customerVisible: true,
    assumptions: [
      'Assumes a 12-point recovery of the payment-stage drop-off.',
      'Applies average booking value of $287.',
      'Concentrated on India and Singapore mobile traffic.',
    ],
    sources: ['Checkout started: 31,240', 'Payment initiated: 14,890', 'Confirmed: 8,412'],
  },
  {
    id: 'r3',
    rank: 3,
    title: 'Increase Brand-Protect SEM and metasearch budgets by 20%',
    evidence: 'Brand-Protect-SEM is delivering 19.0x ROAS; metasearch is 6.7x and still above the 6x floor.',
    impact: '+$60K at an expected ROAS of at least 8x',
    impactValue: 60000,
    confidence: 'Medium',
    priority: 'medium',
    owner: 'Digital marketing',
    status: 'proposed',
    customerVisible: false,
    assumptions: [
      '20% spend increase on Brand-Protect-SEM and Google HPA only.',
      'Assumes diminishing returns keep blended ROAS at or above 8x.',
    ],
    sources: ['Paid spend: $50.3K', 'Paid revenue: $462K', 'Blended ROAS: 9.2x'],
  },
  {
    id: 'r4',
    rank: 4,
    title: 'Launch a member-rate campaign to shift two points of OTA share to direct',
    evidence: 'OTA share is 37.1%. Each point moved to direct saves about $13.5K in quarterly commission.',
    impact: '$27K commission saving',
    impactValue: 27000,
    confidence: 'Medium',
    priority: 'medium',
    owner: 'Account manager + marketing',
    status: 'proposed',
    customerVisible: true,
    assumptions: [
      'Two-point share shift from OTA to direct, not a reduction in total demand.',
      'Applies current average OTA commission of 18%.',
    ],
    sources: ['OTA revenue: $4.27M', 'Commission: $455K', 'Direct share: 35.3%'],
  },
  {
    id: 'r5',
    rank: 5,
    title: 'Apply event-window pricing in Dubai and Singapore',
    evidence: '90-day demand index 128 in Dubai and 112 in Singapore around GITEX and F1.',
    impact: '+$48K RevPAR uplift',
    impactValue: 48000,
    confidence: 'Medium',
    priority: 'medium',
    owner: 'Revenue manager',
    status: 'proposed',
    customerVisible: true,
    assumptions: [
      'BAR +8–12% on Dubai event dates; two-night minimum in Singapore.',
      'Constrained to four properties with demonstrated event elasticity.',
    ],
    sources: ['Demand Navigator 90-day index', 'GM Dubai Marina / Downtown', 'GM Singapore Orchard / Marina'],
  },
]

export const demandRecommendations: Recommendation[] = [
  {
    id: 'd1',
    rank: 1,
    title: 'Launch joint GITEX packages for Dubai production',
    evidence: 'Dubai demand index 128 with two live properties and 16-day average lead time.',
    impact: '+$86K incremental room revenue',
    impactValue: 86000,
    confidence: 'High',
    priority: 'high',
    owner: 'Demand partner + revenue manager',
    status: 'accepted',
    customerVisible: true,
    assumptions: ['Event window 12–16 Oct', 'Assumes 4% incremental stay length on packages'],
    sources: ['Partner room nights: 14,820', 'Dubai index: 128'],
  },
  {
    id: 'd2',
    rank: 2,
    title: 'Improve cancellation quality with a tighter payment window',
    evidence: 'Partner cancellation is 18.4%, 3.4 points above the 15% quality target.',
    impact: '+410 net room nights',
    impactValue: 72000,
    confidence: 'Medium',
    priority: 'high',
    owner: 'Demand operations',
    status: 'accepted',
    customerVisible: true,
    assumptions: ['Applies to refundable production only', 'Does not reduce shop demand'],
    sources: ['Cancellation rate: 18.4%', 'Partner bookings: 6,140'],
  },
  {
    id: 'd3',
    rank: 3,
    title: 'Expand Bangkok content coverage and value-add merchandising',
    evidence: 'Bangkok demand is soft (index 96) but two properties are live and under-merchandised.',
    impact: '+$41K incremental demand',
    impactValue: 41000,
    confidence: 'Medium',
    priority: 'medium',
    owner: 'Content + demand partner',
    status: 'proposed',
    customerVisible: true,
    assumptions: ['No BAR reduction', 'Packages over discounting'],
    sources: ['Bangkok index: 96', 'Property coverage: 12 of 12'],
  },
  {
    id: 'd4',
    rank: 4,
    title: 'Co-fund a Singapore F1 two-night minimum stay offer',
    evidence: 'Singapore index 112; F1 week is the next peak window.',
    impact: '+$38K RevPAR contribution',
    impactValue: 38000,
    confidence: 'Medium',
    priority: 'medium',
    owner: 'Joint commercial team',
    status: 'proposed',
    customerVisible: false,
    assumptions: ['Minimum stay applied 1–4 Oct only'],
    sources: ['Singapore index: 112', 'Lead time: 16 days'],
  },
  {
    id: 'd5',
    rank: 5,
    title: 'Promote member-rate exclusives on high-converting shop paths',
    evidence: 'Look-to-book is 2.84% and improving; member rates convert 0.4 points higher.',
    impact: '+$29K partner revenue',
    impactValue: 29000,
    confidence: 'Low',
    priority: 'medium',
    owner: 'Marketing + demand partner',
    status: 'proposed',
    customerVisible: true,
    assumptions: ['Applies to returning shoppers only'],
    sources: ['Look-to-book: 2.84%', 'Partner revenue: $1.68M'],
  },
]

export const initialActions: ReviewAction[] = [
  {
    id: 'a1',
    action: 'Launch Google HPA metasearch',
    owner: 'Digital marketing',
    due: '12 May 2026',
    status: 'done',
    related: 'Increase Brand-Protect SEM and metasearch budgets by 20%',
    notes: 'Live 12 May; ROAS 6.7x.',
  },
  {
    id: 'a2',
    action: 'Complete chain-level GA4 rollup',
    owner: 'Analytics',
    due: '31 Jul 2026',
    status: 'in_progress',
    related: 'Reduce payment-stage drop-off through local payment methods and retry UX',
    notes: '8 of 12 properties migrated.',
  },
  {
    id: 'a3',
    action: 'Close Booking.com mobile parity gap',
    owner: 'Parity team',
    due: '15 Aug 2026',
    status: 'open',
    related: 'Fix Agoda parity and audit wholesale contracts',
    notes: 'Carried into Recommendation 1.',
  },
]

export const owners = [
  'Priya Sharma',
  'Revenue manager',
  'Parity team',
  'Product / IBE',
  'Digital marketing',
  'Analytics',
  'Demand operations',
  'Joint commercial team',
]

export const partnerDirectory: {
  name: string
  perspective: PartnerPerspective
  accountType: AccountType
  regions: string[]
  orgType: 'Chain' | 'Account' | 'Hotel'
  locations: string[]
}[] = [
  {
    name: 'Grand Meridian Hotels & Resorts',
    perspective: 'supply',
    accountType: 'full',
    regions: ['APMEA', 'EMEA', 'Americas'],
    orgType: 'Chain',
    locations: ['Dubai', 'Singapore', 'London', 'Miami'],
  },
  {
    name: 'Azure Sands Collection',
    perspective: 'supply',
    accountType: 'direct',
    regions: ['EMEA'],
    orgType: 'Account',
    locations: ['London'],
  },
  {
    name: 'Pacific Voyage Hotels',
    perspective: 'demand',
    accountType: 'full',
    regions: ['APAC'],
    orgType: 'Chain',
    locations: ['Singapore', 'Sydney', 'Tokyo'],
  },
  {
    name: 'Lumen Residences',
    perspective: 'supply',
    accountType: 'direct',
    regions: ['Americas'],
    orgType: 'Hotel',
    locations: ['New York'],
  },
  {
    name: 'Cedar & Tide Inns',
    perspective: 'demand',
    accountType: 'full',
    regions: ['APMEA'],
    orgType: 'Account',
    locations: ['Mumbai'],
  },
  {
    name: 'Northstar Hospitality',
    perspective: 'supply',
    accountType: 'full',
    regions: ['Americas'],
    orgType: 'Chain',
    locations: ['Chicago', 'Toronto', 'Denver'],
  },
  {
    name: 'Silk Route Stays',
    perspective: 'demand',
    accountType: 'direct',
    regions: ['APAC'],
    orgType: 'Account',
    locations: ['Bangkok'],
  },
  {
    name: 'Harbour Light Hotels',
    perspective: 'supply',
    accountType: 'full',
    regions: ['EMEA'],
    orgType: 'Chain',
    locations: ['Barcelona', 'Lisbon', 'Palma'],
  },
  {
    name: 'Alta Vista Resorts',
    perspective: 'supply',
    accountType: 'direct',
    regions: ['Americas'],
    orgType: 'Hotel',
    locations: ['Cancún'],
  },
  {
    name: 'Amber Court Group',
    perspective: 'demand',
    accountType: 'full',
    regions: ['APMEA'],
    orgType: 'Chain',
    locations: ['Singapore', 'Kuala Lumpur', 'Jakarta', 'Bangkok', 'Ho Chi Minh', 'Manila'],
  },
  {
    name: 'River Oak Inns',
    perspective: 'supply',
    accountType: 'full',
    regions: ['EMEA'],
    orgType: 'Chain',
    locations: ['Dublin'],
  },
  {
    name: 'Cinder Peak Lodges',
    perspective: 'demand',
    accountType: 'direct',
    regions: ['Americas'],
    orgType: 'Hotel',
    locations: ['Denver'],
  },
  {
    name: 'Orchid Bay Hotels',
    perspective: 'supply',
    accountType: 'full',
    regions: ['APAC'],
    orgType: 'Chain',
    locations: ['Sydney', 'Auckland'],
  },
  {
    name: 'Summit Ridge Hotels',
    perspective: 'supply',
    accountType: 'full',
    regions: ['EMEA', 'APAC'],
    orgType: 'Chain',
    locations: ['Zurich', 'Vienna', 'Seoul'],
  },
  {
    name: 'Blue Harbour Collection',
    perspective: 'demand',
    accountType: 'direct',
    regions: ['Americas'],
    orgType: 'Account',
    locations: ['Miami'],
  },
  {
    name: 'Atlas Stay Group',
    perspective: 'supply',
    accountType: 'direct',
    regions: ['APMEA', 'EMEA', 'Americas'],
    orgType: 'Chain',
    locations: ['Amsterdam', 'Dubai', 'New York', 'Singapore'],
  },
]

export const partners = partnerDirectory.map((p) => p.name)
