import { useMemo } from 'react'
import { useReport } from '../context/ReportContext'
import {
  attributionRows as baseAttribution,
  bookingKpis,
  campaigns as baseCampaigns,
  channelRows as baseChannels,
  chainHierarchy,
  demandKpis,
  demandMarkets as baseDemandMarkets,
  funnelStages as baseFunnel,
  getPropertiesForBrand,
  marketingKpis as baseMarketingKpis,
  monthlyTrend as baseMonthlyTrend,
  organicTrend as baseOrganic,
  paidTrend as basePaid,
  parityLosses as baseParityLosses,
  parityScore as baseParityScore,
  supplyKpis,
} from '../data/grandMeridian'
import { formatCurrency, formatNumber } from './format'
import { monthsForPeriod, periodFactor, sliceMonthlyTrend } from './period'
import type {
  AttributionRow,
  CampaignRow,
  ChannelRow,
  FunnelStage,
  KpiMetric,
  Recommendation,
  ScopeKpis,
} from '../types'

function round(n: number, digits = 0) {
  const p = 10 ** digits
  return Math.round(n * p) / p
}

function scaleMoney(n: number, factor: number) {
  return Math.round(n * factor)
}

function scaleCount(n: number, factor: number) {
  return Math.max(0, Math.round(n * factor))
}

function parseSharePct(share: string) {
  const n = Number(String(share).replace('%', ''))
  return Number.isFinite(n) ? n : 35.3
}

function scaleSeries(
  series: { current: number[]; previous: number[]; ly: number[] },
  map: (n: number) => number,
) {
  return {
    current: series.current.map(map),
    previous: series.previous.map(map),
    ly: series.ly.map(map),
  }
}

function scaleKpiValueString(value: string, factor: number): string {
  if (value.includes('x')) {
    const n = Number(value.replace('x', ''))
    return Number.isFinite(n) ? `${round(n * (0.95 + 0.05 * factor), 1)}x` : value
  }
  if (value.includes('%')) return value
  const money = value.match(/^\$?([\d,.]+)\s*(K|M)?$/i)
  if (money) {
    let n = Number(money[1].replace(/,/g, ''))
    if (money[2]?.toUpperCase() === 'M') n *= 1_000_000
    if (money[2]?.toUpperCase() === 'K') n *= 1_000
    return formatCurrency(scaleMoney(n, factor), true)
  }
  const count = value.match(/^([\d,]+)$/)
  if (count) return formatNumber(scaleCount(Number(count[1].replace(/,/g, '')), factor))
  return value
}

function scaleGenericKpis(kpis: KpiMetric[], factor: number): KpiMetric[] {
  if (Math.abs(factor - 1) < 0.001) return kpis
  return kpis.map((m) => ({
    ...m,
    value: scaleKpiValueString(m.value, factor),
    raw: m.raw != null ? scaleMoney(m.raw, factor) : m.raw,
    trend: m.trend.map((v) => round(v * factor, v >= 100 ? 0 : 2)),
  }))
}

export function applyScopeToKpis(base: KpiMetric[], scope: ScopeKpis, label: string): KpiMetric[] {
  return base.map((metric) => {
    if (metric.id === 'total-rev' || metric.id === 'partner-rev' || metric.id === 'drev') {
      return {
        ...metric,
        value: scope.revenue,
        raw: scope.revenueRaw,
        comparisons: { ...metric.comparisons, qoq: scope.revenueVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'direct-rev') {
      return {
        ...metric,
        value: scope.directRevenue,
        comparisons: { ...metric.comparisons, qoq: scope.directVsPrior },
        share: metric.share
          ? {
              ...metric.share,
              value: scope.directShare,
              comparisons: { ...metric.share.comparisons, qoq: scope.directVsPrior },
            }
          : undefined,
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'parity-win') {
      return {
        ...metric,
        value: scope.parityWin,
        comparisons: { ...metric.comparisons, qoq: scope.parityWinVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'conversion' || metric.id === 'look-book') {
      return {
        ...metric,
        value: scope.conversion,
        comparisons: { ...metric.comparisons, qoq: scope.conversionVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'rn' || metric.id === 'room-nights' || metric.id === 'partner-bookings') {
      return {
        ...metric,
        value: scope.roomNights,
        raw: scope.roomNightsRaw,
        comparisons: { ...metric.comparisons, qoq: scope.roomNightsVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    return metric
  })
}

export function useScopedReportData() {
  const ctx = useReport()

  return useMemo(() => {
    const chainRevenue = chainHierarchy.kpis.revenueRaw || 1
    const chainNights = chainHierarchy.kpis.roomNightsRaw || 1
    const scopeRatio = ctx.activeScopeKpis.revenueRaw / chainRevenue
    const nightsRatio = ctx.activeScopeKpis.roomNightsRaw / chainNights
    const pFactor = periodFactor(ctx.viewPeriod, ctx.customFrom, ctx.customTo)
    const moneyFactor = scopeRatio * pFactor
    const volumeFactor = nightsRatio * pFactor

    const scopedRevenueRaw = scaleMoney(ctx.activeScopeKpis.revenueRaw, pFactor)
    const scopedNightsRaw = scaleCount(ctx.activeScopeKpis.roomNightsRaw, pFactor)
    const directSharePct = parseSharePct(ctx.activeScopeKpis.directShare)
    const scopedDirectRaw = scaleMoney(scopedRevenueRaw * (directSharePct / 100), 1)
    const gdsAmount = scaleMoney(146_000 * scopeRatio, pFactor)
    const indirectAmount = Math.max(0, scopedRevenueRaw - scopedDirectRaw - gdsAmount)

    const periodScopedKpis: ScopeKpis = {
      ...ctx.activeScopeKpis,
      revenueRaw: scopedRevenueRaw,
      revenue: formatCurrency(scopedRevenueRaw, true),
      roomNightsRaw: scopedNightsRaw,
      roomNights: formatNumber(scopedNightsRaw),
      directRevenue: formatCurrency(scopedDirectRaw, true),
      directShare: `${directSharePct.toFixed(1)}%`,
    }

    const propertyNames = (() => {
      if (ctx.scopeLevel === 'property' && ctx.selectedPropertyId) {
        const p = chainHierarchy.properties.find((x) => x.id === ctx.selectedPropertyId)
        return p ? [p.name] : []
      }
      if (ctx.scopeLevel === 'brand' && ctx.selectedBrandId) {
        return getPropertiesForBrand(ctx.selectedBrandId).map((p) => p.name)
      }
      return chainHierarchy.properties.map((p) => p.name)
    })()

    const cities = (() => {
      if (ctx.scopeLevel === 'property' && ctx.selectedPropertyId) {
        const p = chainHierarchy.properties.find((x) => x.id === ctx.selectedPropertyId)
        return p ? [p.city] : []
      }
      if (ctx.scopeLevel === 'brand' && ctx.selectedBrandId) {
        return [...new Set(getPropertiesForBrand(ctx.selectedBrandId).map((p) => p.city))]
      }
      return [...new Set(chainHierarchy.properties.map((p) => p.city))]
    })()

    const baseKpis = (ctx.isSupply ? supplyKpis : demandKpis).filter(
      (k) => ctx.isFullStack || !k.fullStackOnly,
    )
    const kpis = applyScopeToKpis(baseKpis, periodScopedKpis, ctx.activeScopeLabel).map((metric) => {
      if (metric.id !== 'indirect-rev') return metric
      const tipLen = Math.max(1, metric.trend.length)
      return {
        ...metric,
        value: formatCurrency(indirectAmount, true),
        raw: indirectAmount,
        trend: metric.trend.map((_, i) =>
          round((indirectAmount / 1_000_000) * (0.87 + (0.13 * (i + 1)) / tipLen), 2),
        ),
        tooltip: `${metric.tooltip} Scoped to ${ctx.activeScopeLabel}.`,
      }
    })
    const bookingCards = applyScopeToKpis(bookingKpis, periodScopedKpis, ctx.activeScopeLabel)

    // Monthly chart points are per-month; scope by brand/property only, then filter to Period months.
    const trendMonths = monthsForPeriod(ctx.viewPeriod, ctx.customFrom, ctx.customTo)
    const periodMonthly = sliceMonthlyTrend(baseMonthlyTrend, trendMonths)
    const monthlyTrend = {
      labels: periodMonthly.labels,
      revenue: scaleSeries(periodMonthly.revenue, (n) => scaleMoney(n, scopeRatio)),
      reservations: scaleSeries(periodMonthly.reservations, (n) => scaleCount(n, nightsRatio)),
      roomNights: scaleSeries(periodMonthly.roomNights, (n) => scaleCount(n, nightsRatio)),
      adr: scaleSeries(periodMonthly.adr, (n) => round(n * (0.92 + 0.08 * scopeRatio), 0)),
    }

    const funnelStages: FunnelStage[] = baseFunnel.map((stage) => {
      const scopedProps = stage.properties.filter((p) => propertyNames.includes(p.name))
      return {
        ...stage,
        value: scaleCount(stage.value, volumeFactor),
        properties: (scopedProps.length ? scopedProps : stage.properties).slice(0, 3),
      }
    })

    const attributionRows: AttributionRow[] = baseAttribution.map((r) => ({
      ...r,
      sessions: scaleCount(r.sessions, volumeFactor),
      bookings: scaleCount(r.bookings, volumeFactor),
      revenue: scaleMoney(r.revenue, moneyFactor),
      spend: r.spend == null ? null : scaleMoney(r.spend, moneyFactor),
    }))

    const channelRows: ChannelRow[] = baseChannels.map((r) => ({
      ...r,
      roomNights: scaleCount(r.roomNights, volumeFactor),
      revenue: scaleMoney(r.revenue, moneyFactor),
      commission: scaleMoney(r.commission, moneyFactor),
    }))
    const totalChannelRev = channelRows.reduce((s, r) => s + r.revenue, 0) || 1
    for (const row of channelRows) {
      row.share = round((row.revenue / totalChannelRev) * 100, 1)
    }

    const parityWin = Number(String(ctx.activeScopeKpis.parityWin).replace('%', '')) || baseParityScore.win
    const win = Math.min(95, Math.max(40, Math.round(parityWin)))
    const loss = Math.max(5, Math.round(baseParityScore.loss + (71 - win) * 0.35))
    const meet = Math.max(5, 100 - win - loss)
    const parityScore = {
      ...baseParityScore,
      checks: scaleCount(baseParityScore.checks, Math.max(0.15, scopeRatio)),
      win,
      loss,
      meet,
      leakage: scaleMoney(baseParityScore.leakage, moneyFactor),
    }

    const parityLosses = baseParityLosses.map((r, i) => ({
      ...r,
      lossEvents: scaleCount(r.lossEvents, Math.max(0.15, scopeRatio)),
      worstProperty: propertyNames[i % propertyNames.length] ?? r.worstProperty,
    }))

    const marketingKpis = scaleGenericKpis(
      baseMarketingKpis.filter((k) => ctx.isInternal || !k.internalOnly),
      moneyFactor,
    )
    const organicTrend = baseOrganic
      .filter((p) => trendMonths.includes(p.month))
      .map((p) => ({
        ...p,
        sessions: scaleCount(p.sessions, nightsRatio),
      }))
    const paidTrend = basePaid
      .filter((p) => trendMonths.includes(p.month))
      .map((p) => ({
        ...p,
        spend: scaleMoney(p.spend, scopeRatio),
        revenue: scaleMoney(p.revenue, scopeRatio),
      }))
    const campaigns: CampaignRow[] = baseCampaigns.map((c) => ({
      ...c,
      spend: scaleMoney(c.spend, moneyFactor),
      bookings: scaleCount(c.bookings, volumeFactor),
      revenue: scaleMoney(c.revenue, moneyFactor),
      roas: c.spend ? round(scaleMoney(c.revenue, moneyFactor) / Math.max(1, scaleMoney(c.spend, moneyFactor)), 1) : c.roas,
    }))

    let demandMarkets = baseDemandMarkets
      .filter((m) => cities.includes(m.market) || m.properties.some((p) => propertyNames.includes(p)))
      .map((m) => ({
        ...m,
        index: Math.min(100, Math.max(1, Math.round(m.index * (0.88 + 0.12 * scopeRatio)))),
        properties: m.properties.filter((p) => propertyNames.includes(p) || propertyNames.length === 0),
        trend: m.trend.map((v) => Math.min(100, Math.max(1, Math.round(v * (0.88 + 0.12 * scopeRatio))))),
      }))
    if (!demandMarkets.length) {
      demandMarkets = baseDemandMarkets.map((m) => ({ ...m, index: Math.min(100, m.index) }))
    }

    const scaleRecommendations = (recs: Recommendation[]): Recommendation[] =>
      recs.map((r) => {
        const impactValue = scaleMoney(r.impactValue, moneyFactor)
        return {
          ...r,
          impactValue,
          impact: r.impact.replace(/\$[\d,.]+[KM]?/, formatCurrency(impactValue, true)),
          evidence: `${r.evidence} · ${ctx.activeScopeLabel} · ${ctx.periodLabel}`,
        }
      })

    const onlineRevenue = [
      {
        name: 'Direct',
        amount: scopedDirectRaw,
        amountLabel: formatCurrency(scopedDirectRaw, true),
        share: directSharePct,
        color: '#4B3FE1',
        qoq: ctx.activeScopeKpis.directVsPrior,
        yoy: round(21.9 * (0.9 + 0.1 * scopeRatio), 1),
      },
      {
        name: 'Indirect',
        amount: indirectAmount,
        amountLabel: formatCurrency(indirectAmount, true),
        share: round((indirectAmount / Math.max(1, scopedRevenueRaw)) * 100, 1),
        color: '#2575FC',
        qoq: round(6.1 * (0.9 + 0.1 * scopeRatio), 1),
        yoy: round(8.7 * (0.9 + 0.1 * scopeRatio), 1),
      },
      {
        name: 'GDS',
        amount: gdsAmount,
        amountLabel: formatCurrency(gdsAmount, true),
        share: round((gdsAmount / Math.max(1, scopedRevenueRaw)) * 100, 1),
        color: '#07B787',
        qoq: -1.6,
        yoy: -3.4,
      },
    ]

    const revenueOpportunities = [
      {
        title: 'Reduce OTA dependency by 20%',
        kind: 'Commission saved',
        detail: 'Shift volume to direct at ~18% commission.',
        value: scaleMoney(91_000 * scopeRatio, pFactor),
        kpiId: 'ota-comm',
      },
      {
        title: 'Fix parity',
        kind: 'Revenue recovered',
        detail: 'Close undercuts so shoppers book direct instead of OTA.',
        value: scaleMoney(182_000 * scopeRatio, pFactor),
        kpiId: 'parity-win',
      },
      {
        title: 'Improve the conversion funnel',
        kind: 'Added booking revenue',
        detail: 'Recover bookings lost at payment drop-off.',
        value: scaleMoney(224_000 * scopeRatio, pFactor),
        kpiId: 'conversion',
      },
    ]

    const summaryCards = {
      indirectRevenue: formatCurrency(indirectAmount, true),
      commission: formatCurrency(scaleMoney(455_000 * scopeRatio, pFactor), true),
      otaShare: `${round(37.1 * (0.95 + 0.05 * scopeRatio), 1)}%`,
    }

    const baseCoverage = [
      { market: 'Dubai', properties: 2, bookings: 1680, nights: 4120, revenue: 548000, incremental: 112000 },
      { market: 'Singapore', properties: 2, bookings: 1420, nights: 3360, revenue: 462000, incremental: 86000 },
      { market: 'Bangkok', properties: 2, bookings: 980, nights: 2410, revenue: 248000, incremental: 41000 },
      { market: 'Mumbai / Delhi', properties: 3, bookings: 1260, nights: 2890, revenue: 268000, incremental: 47000 },
      { market: 'Other APMEA', properties: 3, bookings: 800, nights: 2040, revenue: 154000, incremental: 26000 },
    ]
    const coverage = baseCoverage
      .filter((row) => {
        if (cities.length === 0) return true
        if (row.market === 'Other APMEA') return cities.length > 3
        if (row.market === 'Mumbai / Delhi') {
          return cities.some((c) => c === 'Mumbai' || c === 'Delhi' || c.includes('Mumbai') || c.includes('Delhi'))
        }
        return cities.some((c) => row.market.includes(c) || c.includes(row.market.split(' ')[0]))
      })
      .map((row) => ({
        ...row,
        bookings: scaleCount(row.bookings, volumeFactor),
        nights: scaleCount(row.nights, volumeFactor),
        revenue: scaleMoney(row.revenue, moneyFactor),
        incremental: scaleMoney(row.incremental, moneyFactor),
        properties: Math.max(1, Math.round(row.properties * Math.max(0.25, scopeRatio * 3))),
      }))

    return {
      kpis,
      bookingCards,
      monthlyTrend,
      funnelStages,
      attributionRows,
      channelRows,
      parityScore,
      parityLosses,
      marketingKpis,
      organicTrend,
      paidTrend,
      campaigns,
      demandMarkets,
      coverage,
      scaleRecommendations,
      onlineRevenue,
      revenueOpportunities,
      summaryCards,
      periodLabel: ctx.periodLabel,
      activeScopeLabel: ctx.activeScopeLabel,
    }
  }, [
    ctx.activeScopeKpis,
    ctx.activeScopeLabel,
    ctx.viewPeriod,
    ctx.customFrom,
    ctx.customTo,
    ctx.scopeLevel,
    ctx.selectedBrandId,
    ctx.selectedPropertyId,
    ctx.isSupply,
    ctx.isFullStack,
    ctx.isInternal,
    ctx.periodLabel,
  ])
}
