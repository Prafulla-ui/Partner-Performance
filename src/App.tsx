import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { ReportProvider } from './context/ReportContext'
import { ThemeProvider } from './context/ThemeContext'
import { DesignSystemShowcase } from './pages/DesignSystemShowcase'
import { Login } from './pages/Login'
import { ReportDetail } from './pages/ReportDetail'
import { ReportLibrary } from './pages/ReportLibrary'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ThemeProvider>
        <AuthProvider>
          <ReportProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              {import.meta.env.DEV && (
                <Route path="/design-system" element={<DesignSystemShowcase />} />
              )}
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <ReportLibrary />
                  </RequireAuth>
                }
              />
              <Route
                path="/reports/:id"
                element={
                  <RequireAuth>
                    <ReportDetail />
                  </RequireAuth>
                }
              />
              <Route path="/shared/:id" element={<ReportDetail publicView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ReportProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
