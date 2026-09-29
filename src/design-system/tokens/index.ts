/** Design token maps for TS consumers and the showcase. */

export const colorPrimitives = {
  navy950: '#0F1F33',
  navy700: '#4A5B70',
  blue700: '#4B3FE1',
  blue600: '#2575FC',
  blue100: '#EEEBFB',
  accent: '#8012FF',
  canvas: '#F6F7F9',
  line: '#ECEEF2',
  positive: '#07B787',
  warning: '#B45309',
  danger: '#B42318',
  teal: '#07B787',
  ai: '#8012FF',
} as const

export const spacingScale = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
} as const

export const radiusScale = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1rem',
  full: '9999px',
} as const

export const typographyScale = {
  display: { size: '2.25rem', weight: 600, lineHeight: 1.2 },
  h1: { size: '1.375rem', weight: 600, lineHeight: 1.3 },
  h2: { size: '1.125rem', weight: 600, lineHeight: 1.35 },
  body: { size: '0.875rem', weight: 400, lineHeight: 1.5 },
  label: { size: '0.6875rem', weight: 600, lineHeight: 1.3, tracking: '0.08em' },
  caption: { size: '0.75rem', weight: 500, lineHeight: 1.4 },
} as const

export const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
} as const
