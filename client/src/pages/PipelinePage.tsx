import { useEffect, useState } from 'react'
import { ArrowRight, CalendarClock, CircleAlert, Plus, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, request } from '../api'
import type { Lead, LeadStage } from '../types'
import { currency, dateLabel, isOverdue } from '../utils'
import { Badge, toneFor } from '../components/Status'

const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']

export function PipelinePage() {
  const [items, setItems] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setError('')
      const data = await request<{ items: Lead[] }>(api.get('/leads', { params: { limit: 100 } }))
      setItems(data.items)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to load pipeline')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const move = async (lead: Lead, next: LeadStage) => {
    try {
      await request(api.patch(`/leads/${lead._id}`, { stage: next }))
      setItems((current) => current.map((item) => item._id === lead._id ? { ...item, stage: next } : item))
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to update stage')
    }
  }

  if (loading) return <div className="page-loader"><span className="spinner" /> Loading pipeline...</div>

  return <div className="page-stack">
    <div className="page-header">
      <div><span className="eyebrow">Sales motion</span><h1>Pipeline</h1><p className="page-subtitle">A reliable stage view with ownership, value, and the next action in context.</p></div>
      <Link className="button button-primary" to="/app/leads"><Plus size={17} /> Create lead</Link>
    </div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="pipeline-board">
      {stages.map((stage) => {
        const cards = items.filter((item) => item.stage === stage)
        const total = cards.reduce((sum, item) => sum + item.estimatedValue, 0)
        return <section className="pipeline-column" key={stage}>
          <div className="pipeline-column-head"><div><span className="stage-label"><i className={`stage-indicator stage-${toneFor(stage)}`} />{stage}</span><small>{cards.length} {cards.length === 1 ? 'lead' : 'leads'} · {currency(total)}</small></div></div>
          <div className="pipeline-cards">
            {cards.map((lead) => <article className="pipeline-card" key={lead._id}>
              <div className="pipeline-card-top"><span className="lead-avatar">{lead.name.slice(0, 1)}</span></div>
              <Link to="/app/leads" className="pipeline-lead-name">{lead.name}</Link>
              <span className="pipeline-company">{lead.company}</span>
              <div className="pipeline-value"><strong>{currency(lead.estimatedValue)}</strong><Badge tone={toneFor(lead.stage)}>{lead.stage}</Badge></div>
              <div className="pipeline-next"><Target size={14} /><span>{lead.nextAction}</span></div>
              <div className="pipeline-meta"><span><span className="avatar avatar-tiny">{lead.assignedTo?.name?.slice(0, 1) || '?'}</span>{lead.assignedTo?.name?.split(' ')[0] || 'Unassigned'}</span>{lead.nextFollowUpAt && <span className={isOverdue(lead.nextFollowUpAt) ? 'text-danger' : ''}><CalendarClock size={13} />{isOverdue(lead.nextFollowUpAt) && <CircleAlert size={12} />}{dateLabel(lead.nextFollowUpAt)}</span>}</div>
              <div className="pipeline-move"><select value={lead.stage} onChange={(e) => void move(lead, e.target.value as LeadStage)} aria-label={`Move ${lead.name}`}><option value={lead.stage}>Move stage...</option>{stages.filter((candidate) => candidate !== lead.stage).map((candidate) => <option key={candidate} value={candidate}>Move to {candidate}</option>)}</select><ArrowRight size={13} /></div>
            </article>)}
            {!cards.length && <div className="column-empty">No leads here yet</div>}
          </div>
        </section>
      })}
    </div>
  </div>
}
