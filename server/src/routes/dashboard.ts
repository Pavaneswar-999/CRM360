import { Router } from 'express'
import { Activity, Customer, Lead, Task } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/error.js'
import { canSeeAll } from '../utils/activity.js'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const scope = canSeeAll(req.user!.role) ? {} : { $or: [{ assignedTo: req.user!.id }, { owner: req.user!.id }] }
  const taskScope = canSeeAll(req.user!.role) ? {} : { assignedTo: req.user!.id }
  const now = new Date(); const soon = new Date(now.getTime() + 7 * 86400000)
  const [totalCustomers, activeLeads, pendingTasks, wonDeals, lostDeals, wonValue, leadsByStage, tasksByStatus, recentActivity, dueSoon] = await Promise.all([
    Customer.countDocuments(canSeeAll(req.user!.role) ? {} : { owner: req.user!.id }),
    Lead.countDocuments({ ...scope, stage: { $nin: ['Won', 'Lost'] } }),
    Task.countDocuments({ ...taskScope, status: { $ne: 'Completed' } }),
    Lead.countDocuments({ ...scope, stage: 'Won' }),
    Lead.countDocuments({ ...scope, stage: 'Lost' }),
    Lead.aggregate([{ $match: { ...scope, stage: 'Won' } }, { $group: { _id: null, total: { $sum: '$estimatedValue' } } }]),
    Lead.aggregate([{ $match: scope }, { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$estimatedValue' } } }]),
    Task.aggregate([{ $match: taskScope }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Activity.find(canSeeAll(req.user!.role) ? {} : { actor: req.user!.id }).sort({ createdAt: -1 }).limit(8).populate('actor', 'name role').lean(),
    Task.find({ ...taskScope, status: { $ne: 'Completed' }, dueDate: { $lte: soon } }).sort({ dueDate: 1 }).limit(6).populate('assignedTo', 'name').lean(),
  ])
  const overdueTasks = await Task.countDocuments({ ...taskScope, status: { $ne: 'Completed' }, dueDate: { $lt: now } })
  const overdueFollowUps = await Lead.countDocuments({ ...scope, stage: { $nin: ['Won', 'Lost'] }, nextFollowUpAt: { $lt: now } })
  const noActivity = await Lead.countDocuments({ ...scope, stage: { $nin: ['Won', 'Lost'] }, $or: [{ lastInteractionAt: { $exists: false } }, { lastInteractionAt: null }] })
  res.json({ success: true, data: { metrics: { totalCustomers, activeLeads, pendingTasks, wonDeals, lostDeals, wonDealValue: wonValue[0]?.total || 0 }, leadsByStage, tasksByStatus, recentActivity, dueSoon, focusQueue: { overdueTasks, overdueFollowUps, noActivity } } })
}))
export default router
