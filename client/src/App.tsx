import { Navigate, Route, Routes, useLocation } from 'react-router'
import { useAuth } from './auth'
import { AppShell } from './components/AppShell'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages'
import { DashboardPage } from './pages/DashboardPage'
import { CustomersPage } from './pages/CustomersPage'
import { LeadsPage } from './pages/LeadsPage'
import { PipelinePage } from './pages/PipelinePage'
import { TasksPage } from './pages/TasksPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { SettingsPage, TeamPage, SearchPage } from './pages/UtilityPages'

function Protected() { const { user, loading } = useAuth(); if (loading) return <div className="page-loader"><span className="spinner" /> Restoring your workspace...</div>; return user ? <AppShell /> : <Navigate to="/login" replace /> }
const allowedEntryRoutes = ['/app/customers', '/app/leads', '/app/pipeline', '/app/tasks']
function PublicOnly({ children }: { children: React.ReactNode }) { const { user, loading } = useAuth(); const location = useLocation(); if (loading) return <div className="page-loader"><span className="spinner" /> Loading CRM360...</div>; const requested = new URLSearchParams(location.search).get('next'); const destination = requested && allowedEntryRoutes.includes(requested) ? requested : '/app'; return user ? <Navigate to={destination} replace /> : children }
function NotFound() { return <div className="not-found"><span className="eyebrow">404</span><h1>That page is not in this workspace.</h1><p>Try returning to the overview and picking up where you left off.</p><a className="button button-primary" href="/">Return home</a></div> }
export default function App() { return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} /><Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} /><Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} /><Route path="/reset-password" element={<ResetPasswordPage />} /><Route path="/app" element={<Protected />}><Route index element={<DashboardPage />} /><Route path="customers" element={<CustomersPage />} /><Route path="leads" element={<LeadsPage />} /><Route path="pipeline" element={<PipelinePage />} /><Route path="tasks" element={<TasksPage />} /><Route path="notifications" element={<NotificationsPage />} /><Route path="team" element={<TeamPage />} /><Route path="settings" element={<SettingsPage />} /><Route path="search" element={<SearchPage />} /></Route><Route path="*" element={<NotFound />} /></Routes> }
