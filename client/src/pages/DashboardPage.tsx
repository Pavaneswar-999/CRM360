import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  DollarSign,
  ListTodo,
  Plus,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { api, request } from '../api'
import type { DashboardData, LeadStage, Task } from '../types'
import { Field } from '../components/FormField'
import { Modal } from '../components/Modal'
import { currency, dateLabel, isOverdue, timeAgo } from '../utils'

const stageColors: Record<LeadStage, string> = {
  New: '#a7b4c8',
  Contacted: '#d5a044',
  Qualified: '#6a8cf0',
  'Proposal Sent': '#6b5bd6',
  Won: '#25a984',
  Lost: '#d36b78',
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function greetingFor(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [taskOpen, setTaskOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [task, setTask] = useState({
    title: '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'Medium',
  })

  const load = async () => {
    try {
      setData(await request<DashboardData>(api.get('/dashboard')))
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to load dashboard')
    }
  }

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const maxStage = useMemo(
    () => Math.max(...(data?.leadsByStage || []).map((item) => item.count), 1),
    [data],
  )

  const createTask = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await request(api.post('/tasks', { ...task, dueDate: new Date(task.dueDate).toISOString() }))
      setTaskOpen(false)
      setTask({ title: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'Medium' })
      await load()
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div className="error-state">
        <CircleAlert size={22} />
        <h2>Dashboard unavailable</h2>
        <p>{error}</p>
        <button className="button button-primary" onClick={() => { setError(''); void load() }}>
          Try again
        </button>
      </div>
    )
  }

  if (!data) return <div className="page-loader"><span className="spinner" /> Loading your workspace...</div>

  const { metrics } = data

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">{dateFormatter.format(now)}</span>
          <h1>{greetingFor(now)}, let’s move things forward.</h1>
          <p className="page-subtitle">Here’s the work that deserves your attention today.</p>
        </div>
        <button className="button button-primary" onClick={() => setTaskOpen(true)}>
          <Plus size={17} /> Add task
        </button>
      </div>

      <div className="metric-grid">
        <Metric label="Total customers" value={metrics.totalCustomers} change="Relationships in motion" icon={Users} tone="blue" />
        <Metric label="Active leads" value={metrics.activeLeads} change="Across your pipeline" icon={Target} tone="violet" />
        <Metric label="Pending tasks" value={metrics.pendingTasks} change={`${data.focusQueue.overdueTasks} overdue`} icon={ListTodo} tone="amber" />
        <Metric label="Won deal value" value={currency(metrics.wonDealValue)} change={`${metrics.wonDeals} closed deals`} icon={DollarSign} tone="green" />
      </div>

      <div className="dashboard-grid">
        <section className="card focus-card">
          <div className="card-head">
            <div><span className="eyebrow">Your priority lane</span><h2>Focus queue</h2></div>
            <Link className="text-link" to="/app/tasks">View all <ArrowUpRight size={15} /></Link>
          </div>
          <div className="focus-summary">
            <div><strong>{data.focusQueue.overdueTasks + data.focusQueue.overdueFollowUps + data.focusQueue.noActivity}</strong><span>items need a next step</span></div>
            <div className="focus-summary-items">
              <span><i className="dot dot-danger" />{data.focusQueue.overdueTasks} overdue tasks</span>
              <span><i className="dot dot-warning" />{data.focusQueue.overdueFollowUps} follow-ups due</span>
              <span><i className="dot dot-neutral" />{data.focusQueue.noActivity} quiet leads</span>
            </div>
          </div>
          <div className="focus-list">
            {data.dueSoon.length
              ? data.dueSoon.map((item: Task) => (
                  <Link className="focus-row" to="/app/tasks" key={item._id}>
                    <span className={`focus-icon ${isOverdue(item.dueDate, item.status) ? 'danger-bg' : 'accent-bg'}`}>
                      {isOverdue(item.dueDate, item.status) ? <CircleAlert size={15} /> : <CheckCircle2 size={15} />}
                    </span>
                    <span className="focus-detail"><strong>{item.title}</strong><small>{item.relatedLead?.company || item.relatedCustomer?.company || 'Workspace task'}</small></span>
                    <span className={isOverdue(item.dueDate, item.status) ? 'text-danger' : 'focus-date'}>{isOverdue(item.dueDate, item.status) ? 'Overdue' : dateLabel(item.dueDate)}</span>
                    <ChevronRight size={15} />
                  </Link>
                ))
              : <p className="muted">No tasks due soon. Your queue is clear.</p>}
          </div>
        </section>

        <section className="card pipeline-summary">
          <div className="card-head">
            <div><span className="eyebrow">Sales overview</span><h2>Pipeline by stage</h2></div>
            <Link className="text-link" to="/app/pipeline">Open pipeline <ArrowUpRight size={15} /></Link>
          </div>
          <div className="stage-bars">
            {(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'] as LeadStage[]).map((stage) => {
              const item = data.leadsByStage.find((entry) => entry._id === stage)
              return (
                <div className="stage-bar-row" key={stage}>
                  <span className="stage-name"><i style={{ background: stageColors[stage] }} />{stage}</span>
                  <div className="stage-bar"><span style={{ width: `${((item?.count || 0) / maxStage) * 100}%`, background: stageColors[stage] }} /></div>
                  <strong>{item?.count || 0}</strong>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="dashboard-grid lower-grid">
        <section className="card">
          <div className="card-head"><div><span className="eyebrow">Recent movement</span><h2>Activity timeline</h2></div></div>
          <div className="timeline">
            {data.recentActivity.map((item) => (
              <div className="timeline-row" key={item._id}>
                <span className="timeline-dot" />
                <div><strong>{item.description}</strong><small>{item.actor?.name || 'Team member'} · {timeAgo(item.createdAt)}</small></div>
              </div>
            ))}
            {!data.recentActivity.length && <p className="muted">Activity will appear here as your team works.</p>}
          </div>
        </section>

        <section className="card quick-card">
          <div className="card-head"><div><span className="eyebrow">Fast paths</span><h2>Keep momentum</h2></div></div>
          <Link to="/app/leads" className="quick-action"><span className="quick-icon violet-bg"><Target size={17} /></span><span><strong>Review active leads</strong><small>Update next actions and stage</small></span><ChevronRight size={16} /></Link>
          <Link to="/app/customers" className="quick-action"><span className="quick-icon blue-bg"><Users size={17} /></span><span><strong>Open customer records</strong><small>See recent relationship context</small></span><ChevronRight size={16} /></Link>
          <Link to="/app/tasks" className="quick-action"><span className="quick-icon amber-bg"><CalendarClock size={17} /></span><span><strong>Plan the next follow-up</strong><small>Turn intent into a dated task</small></span><ChevronRight size={16} /></Link>
        </section>
      </div>

      <Modal open={taskOpen} title="Add a task" onClose={() => setTaskOpen(false)}>
        <form className="modal-form" onSubmit={createTask}>
          <Field label="Task title" required>
            <input value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} required placeholder="e.g. Send proposal follow-up" />
          </Field>
          <div className="form-grid">
            <Field label="Due date" required>
              <input type="date" value={task.dueDate} onChange={(event) => setTask({ ...task, dueDate: event.target.value })} required />
            </Field>
            <Field label="Priority">
              <select value={task.priority} onChange={(event) => setTask({ ...task, priority: event.target.value })}>
                <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
              </select>
            </Field>
          </div>
          <div className="modal-actions">
            <button type="button" className="button button-quiet" onClick={() => setTaskOpen(false)}>Cancel</button>
            <button className="button button-primary" disabled={saving}>{saving ? 'Creating...' : 'Create task'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function Metric({ label, value, change, icon: Icon, tone }: { label: string; value: string | number; change: string; icon: LucideIcon; tone: string }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{change}</small></div></div>
}
