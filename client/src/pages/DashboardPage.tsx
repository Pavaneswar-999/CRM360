import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  DollarSign,
  ListChecks,
  Plus,
  Target,
  Users,
} from 'lucide-react'
import { Link } from 'react-router'
import { api, request } from '../api'
import type { DashboardData, LeadStage, Task } from '../types'
import { Field } from '../components/FormField'
import { Modal } from '../components/Modal'
import { currency, dateLabel, isOverdue, timeAgo } from '../utils'

const stageColors: Record<LeadStage, string> = {
  New: '#8b938b',
  Contacted: '#a76e36',
  Qualified: '#758d7b',
  'Proposal Sent': '#52685f',
  Won: '#28724b',
  Lost: '#b8404a',
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
      setError('')
      setData(await request<DashboardData>(api.get('/dashboard')))
    } catch (requestError: any) {
      setError(requestError?.response?.data?.error || 'Unable to load your dashboard')
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
    return <div className="error-state"><CircleAlert size={22} /><h2>Dashboard unavailable</h2><p>{error}</p><button className="button button-primary" onClick={() => void load()}>Try again</button></div>
  }

  if (!data) return <div className="page-loader"><span className="spinner" /> Loading your workspace...</div>

  const { metrics, focusQueue, dueSoon, recentActivity } = data
  const attentionCount = focusQueue.overdueTasks + focusQueue.overdueFollowUps + focusQueue.noActivity
  const hasRecords = metrics.totalCustomers + metrics.activeLeads + metrics.pendingTasks + metrics.wonDeals > 0

  return <div className="page-stack command-dashboard">
    <div className="command-header">
      <div><span className="eyebrow">{dateFormatter.format(now)}</span><h1>{greetingFor(now)}, {hasRecords ? 'here is what needs attention.' : 'let’s set up the first real record.'}</h1><p>{hasRecords ? 'The queue below is built from your stored tasks, lead stages, and recent activity.' : 'Start with a customer or a lead, then attach the next follow-up.'}</p></div>
      <button className="button button-primary" onClick={() => setTaskOpen(true)}><Plus size={17} /> Add task</button>
    </div>

    {!hasRecords && <section className="setup-rail" aria-labelledby="setup-title">
      <div className="setup-rail-index"><span>01</span><span>02</span><span>03</span></div>
      <div><span className="eyebrow">Start with the work you have</span><h2 id="setup-title">Set up the first relationship, then give it a next move.</h2><p>Each step opens the real part of CRM360 where that work is created.</p></div>
      <div className="setup-rail-actions"><Link to="/app/customers">Add customer <ArrowUpRight size={15} /></Link><Link to="/app/leads">Create lead <ArrowUpRight size={15} /></Link><Link to="/app/tasks">Plan task <ArrowUpRight size={15} /></Link></div>
    </section>}

    <section className="command-grid" aria-label="Current work">
      <div className="now-panel">
        <div className="now-panel-head"><div><span className="eyebrow">Now</span><h2>{attentionCount ? `${attentionCount} items need attention` : 'Nothing urgent is waiting'}</h2></div><Link className="text-link" to="/app/tasks">Open tasks <ArrowUpRight size={15} /></Link></div>
        <div className="signal-summary"><span className="signal-summary-number">{focusQueue.overdueTasks}</span><span><strong>overdue tasks</strong><small>Need completion or a new due date</small></span><span className="signal-summary-divider" /><span className="signal-summary-number">{focusQueue.overdueFollowUps}</span><span><strong>follow-ups due</strong><small>Check the next conversation</small></span><span className="signal-summary-divider" /><span className="signal-summary-number">{focusQueue.noActivity}</span><span><strong>quiet leads</strong><small>Review relationship activity</small></span></div>
        <div className="now-list">
          {dueSoon.length ? dueSoon.slice(0, 5).map((item: Task) => <Link className="now-row" to="/app/tasks" key={item._id}>
            <span className={`now-row-icon ${isOverdue(item.dueDate, item.status) ? 'danger-bg' : 'accent-bg'}`}>{isOverdue(item.dueDate, item.status) ? <CircleAlert size={16} /> : <CheckCircle2 size={16} />}</span>
            <span className="now-row-copy"><strong>{item.title}</strong><small>{item.relatedLead?.company || item.relatedCustomer?.company || 'Workspace task'}</small></span>
            <span className={isOverdue(item.dueDate, item.status) ? 'text-danger' : 'now-row-date'}>{isOverdue(item.dueDate, item.status) ? 'Overdue' : dateLabel(item.dueDate)}</span><ChevronRight size={16} />
          </Link>) : <div className="now-empty"><CheckCircle2 size={20} /><div><strong>Your task queue is clear.</strong><p>Add a task when the next step needs a date and an owner.</p></div><button className="button button-outline button-small" onClick={() => setTaskOpen(true)}>Add task</button></div>}
        </div>
      </div>

      <aside className="command-signal-board">
        <span className="eyebrow">At a glance</span>
        <dl>
          <div><dt><Users size={16} /> Customers</dt><dd>{metrics.totalCustomers}</dd></div>
          <div><dt><Target size={16} /> Active leads</dt><dd>{metrics.activeLeads}</dd></div>
          <div><dt><ListChecks size={16} /> Open tasks</dt><dd>{metrics.pendingTasks}</dd></div>
          <div><dt><DollarSign size={16} /> Won value</dt><dd>{currency(metrics.wonDealValue)}</dd></div>
        </dl>
        <Link to="/app/pipeline" className="signal-board-link">Review pipeline <ArrowRight size={15} /></Link>
      </aside>
    </section>

    <section className="dashboard-surface-grid">
      <section className="card pipeline-panel"><div className="card-head"><div><span className="eyebrow">Pipeline</span><h2>Where opportunities stand</h2></div><Link className="text-link" to="/app/pipeline">Open pipeline <ArrowUpRight size={15} /></Link></div><div className="stage-bars">{(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'] as LeadStage[]).map((stage) => {
        const item = data.leadsByStage.find((entry) => entry._id === stage)
        return <div className="stage-bar-row" key={stage}><span className="stage-name"><i style={{ background: stageColors[stage] }} />{stage}</span><div className="stage-bar"><span style={{ width: `${((item?.count || 0) / maxStage) * 100}%`, background: stageColors[stage] }} /></div><strong>{item?.count || 0}</strong></div>
      })}</div></section>

      <section className="card activity-panel"><div className="card-head"><div><span className="eyebrow">Recent activity</span><h2>What changed</h2></div><Activity size={18} /></div><div className="timeline">{recentActivity.length ? recentActivity.slice(0, 6).map((item) => <div className="timeline-row" key={item._id}><span className="timeline-dot" /><div><strong>{item.description}</strong><small>{item.actor?.name || 'Team member'} · {timeAgo(item.createdAt)}</small></div></div>) : <p className="muted">Activity appears here after your team creates or updates records.</p>}</div></section>
    </section>

    <section className="next-action-rail"><div><span className="eyebrow">Work areas</span><h2>Go straight to the next useful view.</h2></div><nav aria-label="CRM360 work areas"><Link to="/app/leads"><Target size={17} /><span><strong>Leads</strong><small>Capture and qualify opportunities</small></span><ArrowRight size={16} /></Link><Link to="/app/customers"><Users size={17} /><span><strong>Customers</strong><small>Keep contact and activity context together</small></span><ArrowRight size={16} /></Link><Link to="/app/tasks"><CalendarClock size={17} /><span><strong>Tasks</strong><small>Plan and complete follow-ups</small></span><ArrowRight size={16} /></Link></nav></section>

    <Modal open={taskOpen} title="Add a task" onClose={() => setTaskOpen(false)}>
      <form className="modal-form" onSubmit={createTask}>
        <Field label="Task title" required><input value={task.title} onChange={(event) => setTask({ ...task, title: event.target.value })} required placeholder="e.g. Send proposal follow-up" /></Field>
        <div className="form-grid"><Field label="Due date" required><input type="date" value={task.dueDate} onChange={(event) => setTask({ ...task, dueDate: event.target.value })} required /></Field><Field label="Priority"><select value={task.priority} onChange={(event) => setTask({ ...task, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field></div>
        <div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setTaskOpen(false)}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Creating...' : 'Create task'}</button></div>
      </form>
    </Modal>
  </div>
}
