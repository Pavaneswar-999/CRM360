import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { CalendarClock, Check, CheckSquare, CircleAlert, Clock3, Plus, Trash2 } from 'lucide-react'
import { api, request } from '../api'
import { useAuth } from '../auth'
import type { Task, TaskPriority, TaskStatus, User } from '../types'
import { Badge, toneFor } from '../components/Status'
import { Modal } from '../components/Modal'
import { Field } from '../components/FormField'
import { EmptyState } from '../components/EmptyState'
import { dateLabel, isOverdue } from '../utils'

type TaskForm = {
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  assignedTo: string
}

const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed']
const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent']

function initialForm(assignedTo = ''): TaskForm {
  return {
    title: '',
    description: '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'Medium',
    assignedTo,
  }
}

function taskUserId(person?: User) {
  return person?.id || person?._id || ''
}

function errorMessage(error: unknown, fallback: string) {
  const response = error as { response?: { data?: { error?: string } } }
  return response.response?.data?.error || fallback
}

export function TasksPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Task[]>([])
  const [filter, setFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<TaskForm>(() => initialForm())
  const [team, setTeam] = useState<User[]>([])
  const [error, setError] = useState('')
  const canAssign = user?.role === 'Admin' || user?.role === 'Sales Manager'

  const load = useCallback(async () => {
    try {
      setError('')
      const data = await request<{ items: Task[] }>(api.get('/tasks', { params: { status: filter, limit: 100 } }))
      setItems(data.items)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to load tasks.'))
    }
  }, [filter])

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
    setForm(initialForm(canAssign ? user?.id || '' : ''))
    setCreateOpen(true)
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const { assignedTo, ...taskFields } = form

    try {
      await request(api.post('/tasks', {
        ...taskFields,
        dueDate: new Date(form.dueDate).toISOString(),
        ...(canAssign && assignedTo ? { assignedTo } : {}),
      }))
      setCreateOpen(false)
      setForm(initialForm(canAssign ? user?.id || '' : ''))
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to create task.'))
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (task: Task, status: TaskStatus) => {
    try {
      setError('')
      await request(api.patch(`/tasks/${task._id}`, { status }))
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to update task status.'))
    }
  }

  const updateAssignee = async (task: Task, assignedTo: string) => {
    try {
      setError('')
      await request(api.patch(`/tasks/${task._id}`, { assignedTo }))
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to assign task.'))
    }
  }

  const remove = async () => {
    if (!taskToDelete) return
    setDeleting(true)
    try {
      setError('')
      await request(api.delete(`/tasks/${taskToDelete._id}`))
      setTaskToDelete(null)
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Unable to delete task.'))
    } finally {
      setDeleting(false)
    }
  }

  return <div className="page-stack">
    <div className="page-header">
      <div>
        <span className="eyebrow">Work to finish</span>
        <h1>Tasks</h1>
        <p className="page-subtitle">Make the next action concrete, owned, and easy to complete.</p>
      </div>
      <button className="button button-primary" onClick={openCreate}><Plus size={17} /> Add task</button>
    </div>

    <div className="task-filter-bar">
      <div className="filter-tabs">
        {['', ...statuses].map((value) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} key={value}>{value || 'All tasks'}</button>)}
      </div>
      <span className="task-count">{items.length} tasks</span>
    </div>

    {error && <div className="form-error" role="alert">{error}</div>}

    {items.length ? <div className="task-list">
      {items.map((task) => <article className={`task-row ${task.status === 'Completed' ? 'task-complete' : ''}`} key={task._id}>
        <button className={`task-toggle ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => void updateStatus(task, task.status === 'Completed' ? 'Pending' : 'Completed')} aria-label={task.status === 'Completed' ? `Reopen ${task.title}` : `Mark ${task.title} complete`}>
          {task.status === 'Completed' && <Check size={15} />}
        </button>
        <div className="task-main">
          <strong>{task.title}</strong>
          <p>{task.description || 'No description added.'}</p>
          <div className="task-meta">
            <Badge tone={toneFor(task.priority)}>{task.priority}</Badge>
            <span><CalendarClock size={13} />{dateLabel(task.dueDate)}</span>
            {task.relatedLead && <span className="task-related">Lead · {task.relatedLead.company}</span>}
            {task.relatedCustomer && <span className="task-related">Customer · {task.relatedCustomer.company}</span>}
          </div>
        </div>
        {canAssign ? <div className="task-owner task-owner-edit">
          <span className="avatar avatar-tiny">{task.assignedTo?.name?.slice(0, 1) || '?'}</span>
          <select className="inline-select task-owner-select" value={taskUserId(task.assignedTo)} onChange={(event) => void updateAssignee(task, event.target.value)} aria-label={`Assign ${task.title}`}>
            {!taskUserId(task.assignedTo) && <option value="" disabled>Unassigned</option>}
            {team.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </div> : <div className="task-owner"><span className="avatar avatar-tiny">{task.assignedTo?.name?.slice(0, 1) || '?'}</span><span>{task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}</span></div>}
        <select className="inline-select task-status-select" value={task.status} onChange={(event) => void updateStatus(task, event.target.value as TaskStatus)} aria-label={`Change status for ${task.title}`}>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <span className={`task-due ${isOverdue(task.dueDate, task.status) ? 'text-danger' : ''}`}>
          {isOverdue(task.dueDate, task.status) ? <><CircleAlert size={14} />Overdue</> : task.status === 'Completed' ? <><CheckSquare size={14} />Done</> : <><Clock3 size={14} />Due</>}
        </span>
        <div className="row-actions"><button className="icon-button" onClick={() => setTaskToDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={15} /></button></div>
      </article>)}
    </div> : <div className="card"><EmptyState title="No tasks in this view" text="Create a task or adjust the filter to see work here." action={<button className="button button-primary" onClick={openCreate}><Plus size={16} /> Add task</button>} /></div>}

    <Modal open={createOpen} title="Add a task" onClose={() => setCreateOpen(false)}>
      <form className="modal-form" onSubmit={save}>
        <Field label="Task title" required><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required placeholder="What needs to happen?" /></Field>
        <Field label="Description"><textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
        <div className="form-grid">
          <Field label="Due date" required><input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required /></Field>
          <Field label="Priority"><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as TaskPriority })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></Field>
          {canAssign && <Field label="Assign to"><select value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })}><option value="">Assign to me</option>{team.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}</select></Field>}
        </div>
        <div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setCreateOpen(false)}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Creating...' : 'Create task'}</button></div>
      </form>
    </Modal>

    <Modal open={Boolean(taskToDelete)} title="Delete task?" onClose={() => setTaskToDelete(null)}>
      <div className="modal-form">
        <p className="modal-copy">Delete “{taskToDelete?.title}”? This cannot be undone.</p>
        <div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setTaskToDelete(null)}>Keep task</button><button type="button" className="button button-danger" onClick={() => void remove()} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete task'}</button></div>
      </div>
    </Modal>
  </div>
}
