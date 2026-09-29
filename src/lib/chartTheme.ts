/** Shared chart colors — RateGain brand (indigo / blue / teal) + restrained accents. */

import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

const lightChartColors = {
  primary: '#4B3FE1',
  primaryBright: '#2575FC',
  secondary: '#07B787',
  tertiary: '#F59E0B',
  tertiaryDeep: '#D97706',
  muted: '#94A3B8',
  mutedDeep: '#64748B',
  positive: '#07B787',
  warning: '#B45309',
  danger: '#B42318',
  accent: '#8012FF',
  grid: '#E8EEF6',
  axis: '#4A5B70',
  axisMuted: '#94A3B8',
  ink: '#0F1F33',
  track: '#EEF1F5',
  white: '#FFFFFF',
} as const

const darkChartColors = {
  ...lightChartColors,
  primary: '#7C8CFF',
  primaryBright: '#2575FC',
  grid: '#2A3D55',
  axis: '#A8B6C8',
  axisMuted: '#8A9BB0',
  ink: '#EEF2F7',
  track: '#1C2E46',
  white: '#16263C',
} as const

export type ChartColors = {
  primary: string
  primaryBright: string
  secondary: string
  tertiary: string
  tertiaryDeep: string
  muted: string
  mutedDeep: string
  positive: string
  warning: string
  danger: string
  accent: string
  grid: string
  axis: string
  axisMuted: string
  ink: string
  track: string
  white: string
}

function isDarkTheme() {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

/** Theme-aware chart palette. Prefer this in components that re-render with theme. */
export function getChartColors(): ChartColors {
  return isDarkTheme() ? darkChartColors : lightChartColors
}

/** Static light palette (legacy). Prefer getChartColors() / useChartTheme() for theme support. */
export const chartColors = lightChartColors

export function getChartSeries() {
  const c = getChartColors()
  return {
    direct: c.primary,
    ota: c.tertiary,
    indirect: c.tertiary,
    gds: c.secondary,
    current: c.primary,
    previous: c.muted,
    ly: c.secondary,
    revenue: c.primary,
    commission: c.tertiaryDeep,
    spend: c.mutedDeep,
  } as const
}

export const chartSeries = {
  direct: chartColors.primary,
  ota: chartColors.tertiary,
  indirect: chartColors.tertiary,
  gds: chartColors.secondary,
  current: chartColors.primary,
  previous: chartColors.muted,
  ly: chartColors.secondary,
  revenue: chartColors.primary,
  commission: chartColors.tertiaryDeep,
  spend: chartColors.mutedDeep,
} as const

export function getChartGradients() {
  const c = getChartColors()
  return {
    primaryBar: { from: c.primaryBright, to: c.primary },
    accentBar: { from: '#FBBF24', to: c.tertiaryDeep },
    mutedBar: { from: c.muted, to: c.mutedDeep },
    primaryArea: c.primary,
  } as const
}

export const chartGradients = {
  primaryBar: { from: chartColors.primaryBright, to: chartColors.primary },
  accentBar: { from: '#FBBF24', to: chartColors.tertiaryDeep },
  mutedBar: { from: chartColors.muted, to: chartColors.mutedDeep },
  primaryArea: chartColors.primary,
} as const

/** Subscribe to theme so charts re-paint when appearance toggles. */
export function useChartTheme() {
  const { isDark } = useTheme()
  return useMemo(
    () => ({
      colors: getChartColors(),
      series: getChartSeries(),
      gradients: getChartGradients(),
    }),
    [isDark],
  )
}
