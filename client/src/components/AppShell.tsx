import { useEffect, useState } from 'react'
import { Bell, Building2, CheckSquare, CircleHelp, KanbanSquare, LayoutDashboard, LogOut, Menu, Search, Settings, Target, Users, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { Logo } from './Logo'
import { useAuth } from '../auth'
import { api, request } from '../api'

const links = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/customers', label: 'Customers', icon: Building2 },
  { to: '/app/leads', label: 'Leads', icon: Target },
  { to: '/app/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/app/tasks', label: 'Tasks', icon: CheckSquare },
]

const workflowGuideUrl = 'https://github.com/Pavaneswar-999/CRM360/blob/main/docs/TESTING.md'

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const loadUnread = () => void request<{ unreadCount: number }>(api.get('/notifications')).then((data) => setUnread(data.unreadCount)).catch(() => undefined)
    loadUnread()
    const timer = window.setInterval(loadUnread, 30000)
    return () => window.clearInterval(timer)
  }, [])

  const signOut = () => { logout(); navigate('/login') }
  const submitSearch = (event: React.FormEvent) => { event.preventDefault(); if (search.trim()) navigate(`/app/search?q=${encodeURIComponent(search.trim())}`) }

  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top"><Logo /><button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="workspace-switch" aria-label="Current workspace">
        <span className="workspace-avatar">C</span>
        <span><strong>CRM360 workspace</strong><small>Single workspace · {user?.role} view</small></span>
      </div>
      <nav className="main-nav">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/app'} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
      <div className="nav-section-label">Workspace</div>
      <nav className="main-nav">
        <NavLink to="/app/notifications" onClick={() => setOpen(false)} className="nav-link"><Bell size={18} /><span>Notifications</span>{unread > 0 && <b className="unread-count">{unread}</b>}</NavLink>
        {(user?.role === 'Admin' || user?.role === 'Sales Manager') && <NavLink to="/app/team" onClick={() => setOpen(false)} className="nav-link"><Users size={18} /><span>Team</span></NavLink>}
        <NavLink to="/app/settings" onClick={() => setOpen(false)} className="nav-link"><Settings size={18} /><span>Settings</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <a className="help-card" href={workflowGuideUrl} target="_blank" rel="noreferrer"><CircleHelp size={16} /><div><strong>Need a hand?</strong><small>Open the workflow guide</small></div></a>
        <div className="profile-mini"><span className="avatar">{user?.name?.slice(0, 1)}</span><div><strong>{user?.name}</strong><small>{user?.role}</small></div><button className="icon-button" onClick={signOut} aria-label="Sign out"><LogOut size={16} /></button></div>
      </div>
    </aside>
    <div className="main-area">
      <header className="topbar"><button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><form className="global-search" onSubmit={submitSearch}><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers, leads, tasks..." aria-label="Global search" /><kbd>⌘ K</kbd></form><div className="topbar-actions"><button className="icon-button" onClick={() => navigate('/app/notifications')} aria-label="Open notifications"><Bell size={18} />{unread > 0 && <i className="notification-dot" />}</button><div className="topbar-user"><span className="avatar avatar-small">{user?.name?.slice(0, 1)}</span><span className="topbar-user-name">{user?.name?.split(' ')[0]}</span></div></div></header>
      <main className="content"><Outlet /></main>
    </div>
    {open && <div className="mobile-scrim" onClick={() => setOpen(false)} />}
  </div>
}
