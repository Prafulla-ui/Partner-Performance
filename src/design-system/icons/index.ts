export const iconSize = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
} as const

export type IconSize = keyof typeof iconSize
