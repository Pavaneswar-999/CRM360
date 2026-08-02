import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck, Clock3, Target } from 'lucide-react'
import { api, request } from '../api'
import { timeAgo } from '../utils'

type Notification = { _id: string; title: string; message: string; type: string; read: boolean; createdAt: string }
export function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([])
  const load = async () => { setItems((await request<{ items: Notification[] }>(api.get('/notifications'))).items) }
  useEffect(() => { void load() }, [])
  const mark = async (id: string) => { await request(api.patch(`/notifications/${id}/read`)); await load() }
  const markAll = async () => { await request(api.post('/notifications/read-all')); await load() }
  return <div className="page-stack">
    <div className="page-header"><div><span className="eyebrow">Stay in the loop</span><h1>Notifications</h1><p className="page-subtitle">Assignments, stage movement, and deadlines that need your eyes.</p></div><button className="button button-quiet" onClick={() => void markAll()}><CheckCheck size={16} /> Mark all read</button></div>
    <div className="card notification-card">
      {items.length ? items.map((item) => <article className={`notification-row ${item.read ? 'read' : ''}`} key={item._id}>
        <span className={`notification-icon ${item.type.includes('task') ? 'amber-bg' : item.type.includes('stage') ? 'violet-bg' : 'blue-bg'}`}>{item.type.includes('task') ? <Clock3 size={17} /> : item.type.includes('stage') ? <Target size={17} /> : <Bell size={17} />}</span>
        <div><strong>{item.title}</strong><p>{item.message}</p><small>{timeAgo(item.createdAt)}</small></div>
        {!item.read && <button className="icon-button" onClick={() => void mark(item._id)} aria-label="Mark notification as read"><Check size={16} /></button>}
      </article>) : <div className="empty-state"><span className="empty-icon"><Bell size={22} /></span><h3>You’re all caught up</h3><p>New assignments and deadlines will appear here.</p></div>}
    </div>
  </div>
}
