export const currency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
export const dateLabel = (value?: string) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value)) : 'No date'
export const timeAgo = (value: string) => { const diff = Math.max(0, Date.now() - new Date(value).getTime()); const days = Math.floor(diff / 86400000); if (days) return `${days}d ago`; const hours = Math.floor(diff / 3600000); if (hours) return `${hours}h ago`; return 'Just now' }
export const isOverdue = (value: string, status?: string) => status !== 'Completed' && new Date(value).getTime() < Date.now()
