import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, CheckCircle2, Mail, Pencil, Plus, Search } from 'lucide-react'
import { api, request } from '../api'
import { useAuth } from '../auth'
import type { Activity, Lead, LeadStage, Task, User } from '../types'
import { Badge, toneFor } from '../components/Status'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { Field } from '../components/FormField'
import { currency, dateLabel, isOverdue } from '../utils'

type LeadForm = {
  name: string
  company: string
  email: string
  source: string
  stage: LeadStage
  estimatedValue: string
  nextAction: string
  nextFollowUpAt: string
  notes: string
  assignedTo: string
}

type LeadDetail = {
  lead: Lead
  activities: Activity[]
  tasks: Task[]
}

const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

function createInitialForm(): LeadForm {
  return {
    name: '',
    company: '',
    email: '',
    source: '',
    stage: 'New',
    estimatedValue: '0',
    nextAction: 'Make first contact',
    nextFollowUpAt: '',
    notes: '',
    assignedTo: '',
  }
}

function errorMessage(error: unknown, fallback: string) {
  const response = error as { response?: { data?: { error?: string } } }
  return response.response?.data?.error || fallback
}

export function LeadsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [form, setForm] = useState<LeadForm>(createInitialForm)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState<LeadDetail | null>(null)
  const [note, setNote] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [team, setTeam] = useState<User[]>([])
  const canAssign = user?.role === 'Admin' || user?.role === 'Sales Manager'

  const load = useCallback(async () => {
    try {
      setError('')
      const data = await request<{ items: Lead[] }>(api.get('/leads', { params: { search, stage, limit: 50 } }))
      setItems(data.items)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to load leads.'))
    }
  }, [search, stage])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!canAssign) return
    let active = true
    void request<{ users: User[] }>(api.get('/users'))
      .then((data) => { if (active) setTeam(data.users) })
      .catch(() => { if (active) setTeam([]) })
    return () => { active = false }
  }, [canAssign])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...createInitialForm(), assignedTo: canAssign ? user?.id || '' : '' })
    setModal(true)
  }

  const openEdit = (lead: Lead) => {
    setEditing(lead)
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      source: lead.source || '',
      stage: lead.stage,
      estimatedValue: String(lead.estimatedValue),
      nextAction: lead.nextAction,
      nextFollowUpAt: lead.nextFollowUpAt ? lead.nextFollowUpAt.slice(0, 10) : '',
      notes: lead.notes || '',
      assignedTo: lead.assignedTo?.id || lead.assignedTo?._id || '',
    })
    setModal(true)
  }

  const openDetail = async (id: string) => {
    setDetailLoading(true)
    try {
      setError('')
      setDetail(await request<LeadDetail>(api.get(`/leads/${id}`)))
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to load lead details.'))
    } finally {
      setDetailLoading(false)
    }
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const { assignedTo, ...leadFields } = form
    const payload = {
      ...leadFields,
      estimatedValue: Number(form.estimatedValue),
      nextFollowUpAt: form.nextFollowUpAt ? new Date(form.nextFollowUpAt).toISOString() : undefined,
      ...(canAssign && assignedTo ? { assignedTo } : {}),
    }

    try {
      if (editing) await request(api.patch(`/leads/${editing._id}`, payload))
      else await request(api.post('/leads', payload))
      setModal(false)
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to save lead.'))
    }
  }

  const addNote = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!detail || note.trim().length < 2) return

    setSavingNote(true)
    try {
      await request(api.post(`/leads/${detail.lead._id}/notes`, { description: note.trim() }))
      setNote('')
      await openDetail(detail.lead._id)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to add note.'))
    } finally {
      setSavingNote(false)
    }
  }

  const convert = async () => {
    if (!detail) return

    try {
      await request(api.post(`/leads/${detail.lead._id}/convert`))
      await load()
      await openDetail(detail.lead._id)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to convert lead.'))
    }
  }

  return <div className="page-stack">
    <div className="page-header">
      <div>
        <span className="eyebrow">Opportunity records</span>
        <h1>Leads</h1>
        <p className="page-subtitle">See who owns each opportunity and what should happen next.</p>
      </div>
      <button className="button button-primary" onClick={openCreate}><Plus size={17} /> Create lead</button>
    </div>

    {error && <div className="form-error" role="alert">{error}</div>}

    <div className="card table-card">
      <div className="table-toolbar">
        <div className="record-count"><strong>{items.length}</strong> leads in view</div>
        <div className="toolbar-controls">
          <div className="table-search">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads" aria-label="Search leads" />
          </div>
          <select value={stage} onChange={(event) => setStage(event.target.value)} aria-label="Filter by stage">
            <option value="">All stages</option>
            {stages.map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>
      </div>

      {items.length ? <div className="data-table-wrap">
        <table className="data-table">
          <thead><tr><th>Lead</th><th>Stage</th><th>Value</th><th>Next action</th><th>Owner</th><th>Follow-up</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>{items.map((lead) => <tr key={lead._id}>
            <td><div className="person-cell"><span className="avatar avatar-table avatar-lead">{lead.name.slice(0, 1)}</span><div><button className="table-link detail-trigger" onClick={() => void openDetail(lead._id)}>{lead.name}<ArrowUpRight size={13} /></button><small>{lead.company}<span className="cell-contact"><Mail size={12} />{lead.email}</span></small></div></div></td>
            <td><Badge tone={toneFor(lead.stage)}>{lead.stage}</Badge></td>
            <td><strong>{currency(lead.estimatedValue)}</strong></td>
            <td><span className="next-action-text">{lead.nextAction}</span></td>
            <td><div className="owner-cell"><span className="avatar avatar-tiny">{lead.assignedTo?.name?.slice(0, 1) || '?'}</span>{lead.assignedTo?.name || 'Unassigned'}</div></td>
            <td><span className={lead.nextFollowUpAt && isOverdue(lead.nextFollowUpAt) ? 'text-danger' : ''}>{lead.nextFollowUpAt ? dateLabel(lead.nextFollowUpAt) : 'Not set'}</span></td>
            <td><button className="icon-button" onClick={() => openEdit(lead)} aria-label={`Edit ${lead.name}`}><Pencil size={15} /></button></td>
          </tr>)}</tbody>
        </table>
      </div> : <EmptyState title="No leads found" text={search || stage ? 'Try clearing a filter or searching another phrase.' : 'Create your first lead to begin tracking it in the pipeline.'} action={<button className="button button-primary" onClick={openCreate}><Plus size={16} /> Create lead</button>} />}
    </div>

    <Modal open={modal} title={editing ? 'Edit lead' : 'Create lead'} onClose={() => setModal(false)} wide>
      <form className="modal-form" onSubmit={save}>
        <div className="form-grid">
          <Field label="Contact name" required><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></Field>
          <Field label="Company" required><input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} required /></Field>
          <Field label="Email" required><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></Field>
          <Field label="Source"><input value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} placeholder="Referral, website..." /></Field>
          <Field label="Stage"><select value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value as LeadStage })}>{stages.map((value) => <option key={value}>{value}</option>)}</select></Field>
          <Field label="Estimated value"><input type="number" min="0" value={form.estimatedValue} onChange={(event) => setForm({ ...form, estimatedValue: event.target.value })} /></Field>
          {canAssign && <Field label="Assign to"><select value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}><option value="">Assign to me</option>{team.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}</select></Field>}
          <Field label="Next follow-up"><input type="date" value={form.nextFollowUpAt} onChange={(event) => setForm({ ...form, nextFollowUpAt: event.target.value })} /></Field>
          <Field label="Next action" required><input value={form.nextAction} onChange={(event) => setForm({ ...form, nextAction: event.target.value })} required /></Field>
        </div>
        <Field label="Notes"><textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field>
        <div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setModal(false)}>Cancel</button><button className="button button-primary">{editing ? 'Save changes' : 'Create lead'}</button></div>
      </form>
    </Modal>

    <Modal open={Boolean(detail)} title={detail?.lead.name || 'Lead details'} onClose={() => setDetail(null)} wide>
      {detail ? <div className="customer-detail">
        <div className="customer-detail-head"><div><span className="eyebrow">Opportunity record</span><h3>{detail.lead.company}</h3><p>{detail.lead.stage} · {currency(detail.lead.estimatedValue)} · {detail.lead.nextAction}</p></div><span className="customer-detail-avatar">{detail.lead.name.slice(0, 1)}</span></div>
        <div className="customer-detail-grid"><div><span className="detail-label">Contact</span><strong>{detail.lead.name}</strong><a href={`mailto:${detail.lead.email}`}><Mail size={14} /> {detail.lead.email}</a>{detail.lead.phone && <span>{detail.lead.phone}</span>}</div><div><span className="detail-label">Follow-up</span><strong>{detail.lead.nextFollowUpAt ? dateLabel(detail.lead.nextFollowUpAt) : 'Not scheduled'}</strong><span>{detail.lead.assignedTo?.name || 'Unassigned'}</span><Badge tone={toneFor(detail.lead.stage)}>{detail.lead.stage}</Badge></div></div>
        <div className="lead-detail-actions"><form onSubmit={addNote}><Field label="Add interaction note" required><textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="What did the team learn or agree next?" /></Field><button className="button button-quiet" disabled={savingNote}>{savingNote ? 'Saving note...' : 'Add note'}</button></form>{!detail.lead.convertedCustomer && ['Qualified', 'Won'].includes(detail.lead.stage) && <button className="button button-primary" onClick={() => void convert}><CheckCircle2 size={16} /> Convert to customer</button>}</div>
        <div className="customer-detail-columns"><section><span className="eyebrow">Activity</span>{detail.activities.length ? <div className="detail-activity">{detail.activities.map((activity) => <div key={activity._id}><i /><div><strong>{activity.description}</strong><small>{activity.actor?.name || 'Team member'} · {dateLabel(activity.createdAt)}</small></div></div>)}</div> : <p className="muted">No activity recorded yet.</p>}</section><section><span className="eyebrow">Open tasks</span>{detail.tasks.length ? <div className="detail-tasks">{detail.tasks.map((task) => <div key={task._id}><strong>{task.title}</strong><span>{task.status} · {dateLabel(task.dueDate)}</span></div>)}</div> : <p className="muted">No tasks are connected to this lead.</p>}</section></div>
      </div> : detailLoading && <div className="page-loader">Loading lead context...</div>}
    </Modal>
  </div>
}
