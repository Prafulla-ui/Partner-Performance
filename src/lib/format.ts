import type { ChangeKind } from '../types'

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`
    }
    if (Math.abs(value) >= 1_000) {
      return `$${Math.round(value / 1_000)}K`
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatChange(value: number, kind: ChangeKind): string {
  const sign = value > 0 ? '+' : ''
  if (kind === 'pts') return `${sign}${value.toFixed(Math.abs(value) < 1 ? 2 : 1)} pts`
  if (kind === 'days') return `${sign}${value} days`
  if (kind === 'abs') {
    const prefix = value > 0 ? '+' : value < 0 ? '−' : ''
    const abs = Math.abs(value)
    if (abs >= 1_000_000) return `${prefix}$${(abs / 1_000_000).toFixed(2)}M`
    if (abs >= 1_000) return `${prefix}$${Math.round(abs / 1_000)}K`
    return `${prefix}$${abs}`
  }
  if (kind === 'x') return `${sign}${value.toFixed(1)}x`
  return `${sign}${value.toFixed(1)}%`
}

export function changeLabel(kind: ChangeKind): string {
  if (kind === 'pts') return 'percentage points'
  if (kind === 'days') return 'days'
  if (kind === 'x') return 'multiple'
  return 'percent'
}
