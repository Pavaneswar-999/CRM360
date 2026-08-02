import { Activity, Notification, Task, type Role } from '../models/index.js'

export async function logActivity(input: { type: string; description: string; actor: string; lead?: string; customer?: string; task?: string; metadata?: Record<string, unknown> }) {
  return Activity.create({ ...input, actor: input.actor, lead: input.lead || undefined, customer: input.customer || undefined, task: input.task || undefined })
}
export async function notify(input: { recipient: string; type: string; title: string; message: string; relatedEntityType?: string; relatedEntityId?: string }) {
  return Notification.create(input)
}
export async function syncDeadlineNotifications(recipient: string) {
  const now = new Date(); const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const tasks = await Task.find({ assignedTo: recipient, status: { $ne: 'Completed' }, dueDate: { $lte: horizon } }).sort({ dueDate: 1 }).limit(40).lean()
  if (!tasks.length) return
  const existing = await Notification.find({ recipient, type: 'task_deadline', relatedEntityType: 'task', relatedEntityId: { $in: tasks.map((task) => task._id) } }).select('relatedEntityId').lean()
  const existingIds = new Set(existing.map((item) => item.relatedEntityId?.toString()))
  const pending = tasks.filter((task) => !existingIds.has(task._id.toString())).map((task) => {
    const overdue = task.dueDate.getTime() < now.getTime()
    return { recipient, type: 'task_deadline', title: overdue ? 'Task overdue' : 'Deadline approaching', message: overdue ? `${task.title} is overdue.` : `${task.title} is due within 24 hours.`, relatedEntityType: 'task', relatedEntityId: task._id }
  })
  if (pending.length) await Notification.insertMany(pending)
}
export const canSeeAll = (role: Role) => role === 'Admin' || role === 'Sales Manager'
