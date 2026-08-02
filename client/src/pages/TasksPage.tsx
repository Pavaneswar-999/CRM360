import { useEffect, useState } from 'react'
import { CalendarClock, Check, CheckSquare, CircleAlert, Clock3, Plus, Trash2 } from 'lucide-react'
import { api, request } from '../api'
import type { Task, TaskStatus } from '../types'
import { Badge, toneFor } from '../components/Status'
import { Modal } from '../components/Modal'
import { Field } from '../components/FormField'
import { EmptyState } from '../components/EmptyState'
import { dateLabel, isOverdue } from '../utils'

type Form = { title: string; description: string; dueDate: string; priority: string }

export function TasksPage() {
  const [items, setItems] = useState<Task[]>([])
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Form>({ title: '', description: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'Medium' })
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setError('')
      setItems((await request<{ items: Task[] }>(api.get('/tasks', { params: { status: filter, limit: 100 } }))).items)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to load tasks')
    }
  }

  useEffect(() => { void load() }, [filter])

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setError('')
      await request(api.post('/tasks', { ...form, dueDate: new Date(form.dueDate).toISOString() }))
      setOpen(false)
      setForm({ title: '', description: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'Medium' })
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to create task')
    } finally {
      setSaving(false)
    }
  }

  const update = async (task: Task, status: TaskStatus) => {
    try {
      await request(api.patch(`/tasks/${task._id}`, { status }))
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to update task')
    }
  }

  const remove = async (task: Task) => {
    if (!confirm(`Delete “${task.title}”?`)) return
    try {
      await request(api.delete(`/tasks/${task._id}`))
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Unable to delete task')
    }
  }

  return <div className="page-stack">
    <div className="page-header"><div><span className="eyebrow">Work to finish</span><h1>Tasks</h1><p className="page-subtitle">Make the next action concrete, owned, and easy to complete.</p></div><button className="button button-primary" onClick={() => setOpen(true)}><Plus size={17} /> Add task</button></div>
    <div className="task-filter-bar"><div className="filter-tabs">{['', 'Pending', 'In Progress', 'Completed'].map((value) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} key={value}>{value || 'All tasks'}</button>)}</div><span className="task-count">{items.length} tasks</span></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    {items.length ? <div className="task-list">{items.map((task) => <article className={`task-row ${task.status === 'Completed' ? 'task-complete' : ''}`} key={task._id}>
      <button className={`task-toggle ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => void update(task, task.status === 'Completed' ? 'Pending' : 'Completed')} aria-label={task.status === 'Completed' ? 'Reopen task' : 'Mark task complete'}>{task.status === 'Completed' && <Check size={15} />}</button>
      <div className="task-main"><strong>{task.title}</strong><p>{task.description || 'No description added.'}</p><div className="task-meta"><Badge tone={toneFor(task.priority)}>{task.priority}</Badge><span><CalendarClock size={13} />{dateLabel(task.dueDate)}</span>{task.relatedLead && <span className="task-related">Lead · {task.relatedLead.company}</span>}{task.relatedCustomer && <span className="task-related">Customer · {task.relatedCustomer.company}</span>}</div></div>
      <div className="task-owner"><span className="avatar avatar-tiny">{task.assignedTo?.name?.slice(0, 1) || '?'}</span><span>{task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}</span></div>
      <span className={`task-due ${isOverdue(task.dueDate, task.status) ? 'text-danger' : ''}`}>{isOverdue(task.dueDate, task.status) ? <><CircleAlert size={14} />Overdue</> : task.status === 'Completed' ? <><CheckSquare size={14} />Done</> : <><Clock3 size={14} />{task.status}</>}</span>
      <div className="row-actions"><button className="icon-button" onClick={() => void remove(task)} aria-label={`Delete ${task.title}`}><Trash2 size={15} /></button></div>
    </article>)}</div> : <div className="card"><EmptyState title="No tasks in this view" text="Create a task or adjust the filter to see work here." action={<button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16} /> Add task</button>} /></div>}
    <Modal open={open} title="Add a task" onClose={() => setOpen(false)}><form className="modal-form" onSubmit={save}><Field label="Task title" required><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="What needs to happen?" /></Field><Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field><div className="form-grid"><Field label="Due date" required><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field><Field label="Priority"><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field></div><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setOpen(false)}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Creating...' : 'Create task'}</button></div></form></Modal>
  </div>
}
