import mongoose, { type Document, type Model } from 'mongoose'

export const ROLES = ['Admin', 'Sales Manager', 'Sales Executive'] as const
export type Role = typeof ROLES[number]
export const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'] as const
export type LeadStage = typeof LEAD_STAGES[number]
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'] as const
export type TaskStatus = typeof TASK_STATUSES[number]
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
export type TaskPriority = typeof TASK_PRIORITIES[number]

export interface UserDoc extends Document {
  name: string; email: string; passwordHash: string; role: Role; avatar?: string; phone?: string; active: boolean
}
const userSchema = new mongoose.Schema<UserDoc>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ROLES, default: 'Sales Executive' },
  avatar: String, phone: String, active: { type: Boolean, default: true },
}, { timestamps: true })

export interface CustomerDoc extends Document {
  name: string; company: string; email: string; phone?: string; address?: string; industry?: string; status: 'Active' | 'At Risk' | 'Inactive'; source?: string; owner: mongoose.Types.ObjectId; tags: string[]; notes?: string; convertedFromLead?: mongoose.Types.ObjectId; createdBy: mongoose.Types.ObjectId
}
const customerSchema = new mongoose.Schema<CustomerDoc>({
  name: { type: String, required: true, trim: true }, company: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true }, phone: String, address: String, industry: String,
  status: { type: String, enum: ['Active', 'At Risk', 'Inactive'], default: 'Active' }, source: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, tags: { type: [String], default: [] }, notes: String,
  convertedFromLead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })
customerSchema.index({ email: 1, company: 1 }, { unique: true })

export interface LeadDoc extends Document {
  name: string; company: string; email: string; phone?: string; source?: string; stage: LeadStage; estimatedValue: number; probability?: number; expectedCloseDate?: Date; assignedTo: mongoose.Types.ObjectId; nextAction: string; nextFollowUpAt?: Date; lastInteractionAt?: Date; notes?: string; convertedCustomer?: mongoose.Types.ObjectId; convertedAt?: Date; lostReason?: string; createdBy: mongoose.Types.ObjectId
}
const leadSchema = new mongoose.Schema<LeadDoc>({
  name: { type: String, required: true, trim: true }, company: { type: String, required: true, trim: true }, email: { type: String, required: true, lowercase: true, trim: true, index: true }, phone: String, source: String,
  stage: { type: String, enum: LEAD_STAGES, default: 'New', index: true }, estimatedValue: { type: Number, default: 0, min: 0 }, probability: { type: Number, min: 0, max: 100 }, expectedCloseDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, nextAction: { type: String, default: 'Make first contact' }, nextFollowUpAt: Date, lastInteractionAt: Date, notes: String,
  convertedCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, convertedAt: Date, lostReason: String, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })
leadSchema.index({ email: 1, company: 1 })

export interface TaskDoc extends Document {
  title: string; description?: string; status: TaskStatus; priority: TaskPriority; dueDate: Date; assignedTo: mongoose.Types.ObjectId; createdBy: mongoose.Types.ObjectId; relatedLead?: mongoose.Types.ObjectId; relatedCustomer?: mongoose.Types.ObjectId; completedAt?: Date
}
const taskSchema = new mongoose.Schema<TaskDoc>({
  title: { type: String, required: true, trim: true }, description: String, status: { type: String, enum: TASK_STATUSES, default: 'Pending', index: true }, priority: { type: String, enum: TASK_PRIORITIES, default: 'Medium' }, dueDate: { type: Date, required: true, index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }, relatedCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, completedAt: Date,
}, { timestamps: true })

export interface ActivityDoc extends Document {
  type: string; description: string; actor: mongoose.Types.ObjectId; customer?: mongoose.Types.ObjectId; lead?: mongoose.Types.ObjectId; task?: mongoose.Types.ObjectId; metadata?: Record<string, unknown>
}
const activitySchema = new mongoose.Schema<ActivityDoc>({ type: { type: String, required: true }, description: { type: String, required: true }, actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }, task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true })

export interface NotificationDoc extends Document {
  recipient: mongoose.Types.ObjectId; type: string; title: string; message: string; relatedEntityType?: string; relatedEntityId?: mongoose.Types.ObjectId; read: boolean
}
const notificationSchema = new mongoose.Schema<NotificationDoc>({ recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, type: { type: String, required: true }, title: { type: String, required: true }, message: { type: String, required: true }, relatedEntityType: String, relatedEntityId: mongoose.Schema.Types.ObjectId, read: { type: Boolean, default: false, index: true } }, { timestamps: true })

export interface PasswordResetTokenDoc extends Document { user: mongoose.Types.ObjectId; tokenHash: string; expiresAt: Date; usedAt?: Date }
const resetSchema = new mongoose.Schema<PasswordResetTokenDoc>({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, tokenHash: { type: String, required: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, usedAt: Date }, { timestamps: true })

export interface RefreshTokenDoc extends Document { user: mongoose.Types.ObjectId; tokenHash: string; expiresAt: Date; revokedAt?: Date; userAgent?: string; ip?: string }
const refreshSchema = new mongoose.Schema<RefreshTokenDoc>({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, tokenHash: { type: String, required: true, unique: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, revokedAt: Date, userAgent: String, ip: String }, { timestamps: true })

export const User = mongoose.model<UserDoc>('User', userSchema)
export const Customer = mongoose.model<CustomerDoc>('Customer', customerSchema)
export const Lead = mongoose.model<LeadDoc>('Lead', leadSchema)
export const Task = mongoose.model<TaskDoc>('Task', taskSchema)
export const Activity = mongoose.model<ActivityDoc>('Activity', activitySchema)
export const Notification = mongoose.model<NotificationDoc>('Notification', notificationSchema)
export const PasswordResetToken = mongoose.model<PasswordResetTokenDoc>('PasswordResetToken', resetSchema)
export const RefreshToken = mongoose.model<RefreshTokenDoc>('RefreshToken', refreshSchema)

export const publicUser = (user: UserDoc) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, active: user.active })
export const populated = <T extends Document>(model: Model<T>) => model
