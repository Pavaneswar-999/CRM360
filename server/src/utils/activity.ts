import { Activity, Notification, type Role } from '../models/index.js'

export async function logActivity(input: { type: string; description: string; actor: string; lead?: string; customer?: string; task?: string; metadata?: Record<string, unknown> }) {
  return Activity.create({ ...input, actor: input.actor, lead: input.lead || undefined, customer: input.customer || undefined, task: input.task || undefined })
}
export async function notify(input: { recipient: string; type: string; title: string; message: string; relatedEntityType?: string; relatedEntityId?: string }) {
  return Notification.create(input)
}
export const canSeeAll = (role: Role) => role === 'Admin' || role === 'Sales Manager'
