import { Router } from 'express'
import { z } from 'zod'
import { Task, Activity, User } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/error.js'
import { validate } from '../middleware/validate.js'
import { canSeeAll, logActivity, notify } from '../utils/activity.js'
import { parseLimit, parsePage } from '../utils/normalize.js'

const router = Router(); router.use(requireAuth)
const taskFields = z.object({ title: z.string().trim().min(2).max(160), description: z.string().max(2000).optional(), status: z.enum(['Pending', 'In Progress', 'Completed']).optional(), priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(), dueDate: z.coerce.date(), assignedTo: z.string().optional(), relatedLead: z.string().optional(), relatedCustomer: z.string().optional() })
const scope = (req: Express.Request) => canSeeAll(req.user!.role) ? {} : { assignedTo: req.user!.id }
router.get('/', asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page), limit = parseLimit(req.query.limit), query = { ...scope(req), ...(req.query.status ? { status: req.query.status } : {}) }
  const [items, total] = await Promise.all([Task.find(query).sort({ dueDate: 1 }).skip((page - 1) * limit).limit(limit).populate('assignedTo', 'name').populate('relatedLead', 'name company stage').populate('relatedCustomer', 'name company').lean(), Task.countDocuments(query)])
  res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } })
}))
router.post('/', validate(z.object({ body: taskFields })), asyncHandler(async (req, res) => {
  const assignedTo = canSeeAll(req.user!.role) && req.body.assignedTo ? req.body.assignedTo : req.user!.id
  if (!(await User.exists({ _id: assignedTo, active: true }))) throw new AppError('Assigned teammate not found', 400)
  const task = await Task.create({ ...req.body, assignedTo, createdBy: req.user!.id, completedAt: req.body.status === 'Completed' ? new Date() : undefined })
  await logActivity({ type: 'task_created', description: `Created task: ${task.title}`, actor: req.user!.id, task: task._id.toString(), lead: req.body.relatedLead, customer: req.body.relatedCustomer })
  if (assignedTo !== req.user!.id) await notify({ recipient: assignedTo, type: 'task_assigned', title: 'Task assigned', message: task.title, relatedEntityType: 'task', relatedEntityId: task._id.toString() })
  res.status(201).json({ success: true, data: { task } })
}))
router.patch('/:id', validate(z.object({ body: taskFields.partial() })), asyncHandler(async (req, res) => {
  const current = await Task.findOne({ _id: req.params.id, ...scope(req) }); if (!current) throw new AppError('Task not found', 404)
  if (canSeeAll(req.user!.role) && req.body.assignedTo && !(await User.exists({ _id: req.body.assignedTo, active: true }))) throw new AppError('Assigned teammate not found', 400)
  const reassigned = canSeeAll(req.user!.role) && Boolean(req.body.assignedTo) && current.assignedTo.toString() !== req.body.assignedTo
  const updates = { ...req.body, ...(req.body.status === 'Completed' ? { completedAt: new Date() } : req.body.status ? { completedAt: undefined } : {}) }
  if (!canSeeAll(req.user!.role)) delete updates.assignedTo
  const task = await Task.findByIdAndUpdate(current._id, updates, { new: true, runValidators: true }).populate('assignedTo', 'name')
  if (!task) throw new AppError('Task not found', 404)
  if (reassigned) {
    const recipient = (task.assignedTo as unknown as { _id: string })._id.toString()
    await Promise.all([
      logActivity({ type: 'task_reassigned', description: `Reassigned task: ${task.title}`, actor: req.user!.id, task: task._id.toString() }),
      notify({ recipient, type: 'task_assigned', title: 'Task assigned', message: task.title, relatedEntityType: 'task', relatedEntityId: task._id.toString() }),
    ])
  }
  if (req.body.status === 'Completed' && current.status !== 'Completed') await logActivity({ type: 'task_completed', description: `Completed task: ${task.title}`, actor: req.user!.id, task: task._id.toString() })
  res.json({ success: true, data: { task } })
}))
router.delete('/:id', asyncHandler(async (req, res) => { const task = await Task.findOneAndDelete({ _id: req.params.id, ...scope(req) }); if (!task) throw new AppError('Task not found', 404); res.json({ success: true, data: { message: 'Task deleted' } }) }))
export default router
