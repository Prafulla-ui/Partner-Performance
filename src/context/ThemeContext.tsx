import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'unifi-theme'

interface ThemeState {
  theme: ThemeMode
  isDark: boolean
}

const ThemeContext = createContext<ThemeState | null>(null)

function applyLightTheme() {
  document.documentElement.setAttribute('data-theme', 'light')
  document.documentElement.style.colorScheme = 'light'
}

/** Light-only theme provider. Appearance toggle was removed from the product. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyLightTheme()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      theme: 'light' as const,
      isDark: false,
    }),
    [],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
