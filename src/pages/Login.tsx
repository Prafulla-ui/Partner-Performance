import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, ErrorMessage, FormField, Input } from '@/design-system'
import { UnifiLogo } from '../components/UnifiLogo'
import { DEMO_USERS, useAuth } from '../context/AuthContext'

const AM = DEMO_USERS.find((u) => u.kind === 'account_manager') ?? DEMO_USERS[0]

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(AM.email)
  const [password, setPassword] = useState(AM.password)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) {
    const dest = user.homeReportId ? `/reports/${user.homeReportId}` : '/'
    return <Navigate to={dest} replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    window.setTimeout(() => {
      const message = login(email, password)
      setBusy(false)
      if (message) {
        setError(message)
        return
      }
      navigate('/', { replace: true })
    }, 450)
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside
        className="relative hidden w-[44%] flex-col justify-between overflow-hidden px-12 py-12 text-white lg:flex"
        style={{
          background:
            'linear-gradient(145deg, #16104A 0%, #0F2A5C 48%, #2A0658 100%)',
        }}
      >
        <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-[#2A0658]/50 blur-3xl" />
        <div className="pointer-events-none absolute right-16 top-1/3 h-40 w-40 rounded-full bg-[#0F2A5C]/40 blur-2xl" />

        <div className="relative flex h-9 w-fit items-center gap-2 rounded-lg bg-white/10 px-2.5 text-xs font-bold tracking-wide ring-1 ring-white/15 backdrop-blur-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[9px] font-bold text-[#16104A]">
            U
          </span>
          UNIFI
        </div>

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">RateGain</p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Partner Performance & Growth Reports
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            Account team workspace to prepare partner reviews — direct performance, channel mix, parity and growth
            recommendations in a single brief.
          </p>
        </div>

        <p className="relative text-xs text-white/45">Demo environment · dummy data only</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-3 lg:hidden">
                <UnifiLogo to={false} />
              </div>
              <h2 className="text-2xl font-semibold text-navy">Sign in</h2>
              <p className="mt-1 text-sm text-navy-muted">
                Account team access to prepare and share reviews.
              </p>
            </div>
            <Badge tone="brand" className="uppercase tracking-wide">
              Demo
            </Badge>
          </div>

          <Card padded={false} className="border border-line bg-card p-7">
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField label="Work email" htmlFor="login-email" required>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  invalid={Boolean(error)}
                />
              </FormField>
              <FormField label="Password" htmlFor="login-password" required>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  invalid={Boolean(error)}
                />
              </FormField>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <Button type="submit" className="w-full" loading={busy} size="lg">
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>

          <div className="mt-4 rounded-xl border border-dashed border-line bg-[var(--ds-surface-muted)] px-4 py-3 text-xs text-navy-muted">
            <p className="font-semibold text-navy">Demo credentials</p>
            <p className="mt-1">Email: priya.sharma@rategain.com</p>
            <p>Password: Unifi2026</p>
          </div>
        </div>
      </main>
    </div>
  )
}
