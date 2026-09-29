import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ScopeLevel, UserKind } from '../types'

const STORAGE_KEY = 'unifi-demo-session'

export interface AuthUser {
  name: string
  email: string
  role: string
  kind: UserKind
  hotelierLevel?: ScopeLevel
  partner?: string
  scopeLabel?: string
  allowedReportIds?: string[]
  homeReportId?: string
  brandId?: string
  propertyId?: string
}

interface AuthState {
  user: AuthUser | null
  login: (email: string, password: string) => string | null
  logout: () => void
  isAccountManager: boolean
  isHotelier: boolean
}

export const DEMO_USERS: (AuthUser & { password: string })[] = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@rategain.com',
    role: 'Account manager',
    kind: 'account_manager',
    password: 'Unifi2026',
  },
  {
    name: 'Ananya Mehta',
    email: 'ananya.mehta@grandmeridian.com',
    role: 'Hotelier · Chain',
    kind: 'hotelier',
    hotelierLevel: 'chain',
    partner: 'Grand Meridian Hotels & Resorts',
    scopeLabel: 'Chain — 12 properties',
    allowedReportIds: ['grand-meridian-q2-2026'],
    homeReportId: 'grand-meridian-q2-2026',
    password: 'Hotelier2026',
  },
  {
    name: 'James Cole',
    email: 'james.cole@grandmeridian.com',
    role: 'Hotelier · Brand',
    kind: 'hotelier',
    hotelierLevel: 'brand',
    partner: 'Grand Meridian Hotels & Resorts',
    scopeLabel: 'Brand — Grand Meridian Select',
    allowedReportIds: ['grand-meridian-q2-2026'],
    homeReportId: 'grand-meridian-q2-2026',
    brandId: 'gm-select',
    password: 'Hotelier2026',
  },
  {
    name: 'Nina Kapoor',
    email: 'nina.kapoor@grandmeridian.com',
    role: 'Hotelier · Property',
    kind: 'hotelier',
    hotelierLevel: 'property',
    partner: 'Grand Meridian Hotels & Resorts',
    scopeLabel: 'Property — GM Dubai Marina',
    allowedReportIds: ['grand-meridian-q2-2026'],
    homeReportId: 'grand-meridian-q2-2026',
    brandId: 'gm-luxury',
    propertyId: 'gm-dubai',
    password: 'Hotelier2026',
  },
]

const AuthContext = createContext<AuthState | null>(null)

function toPublicUser(entry: (typeof DEMO_USERS)[number]): AuthUser {
  const { password: _password, ...user } = entry
  return user
}

function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed.kind) {
      return { ...parsed, kind: 'account_manager' }
    }
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession())

  const login = (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase()
    const match = DEMO_USERS.find((u) => u.email === trimmed && u.password === password)
    if (!match) {
      return 'Use one of the demo credentials shown below the form.'
    }
    const next = toPublicUser(match)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
    return null
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAccountManager: user?.kind === 'account_manager',
      isHotelier: user?.kind === 'hotelier',
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
