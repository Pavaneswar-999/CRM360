import { Inbox } from 'lucide-react'
export function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) { return <div className="empty-state"><span className="empty-icon"><Inbox size={22} /></span><h3>{title}</h3><p>{text}</p>{action}</div> }
