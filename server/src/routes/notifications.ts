import { Router } from 'express'
import { Notification } from '../models/index.js'
import { requireAuth } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/error.js'
import { syncDeadlineNotifications } from '../utils/activity.js'

const router = Router(); router.use(requireAuth)
router.get('/', asyncHandler(async (req, res) => { await syncDeadlineNotifications(req.user!.id); const items = await Notification.find({ recipient: req.user!.id }).sort({ createdAt: -1 }).limit(40).lean(); res.json({ success: true, data: { items, unreadCount: items.filter((item) => !item.read).length } }) }))
router.patch('/:id/read', asyncHandler(async (req, res) => { const item = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user!.id }, { read: true }, { new: true }); if (!item) throw new AppError('Notification not found', 404); res.json({ success: true, data: { notification: item } }) }))
router.post('/read-all', asyncHandler(async (req, res) => { await Notification.updateMany({ recipient: req.user!.id, read: false }, { read: true }); res.json({ success: true, data: { message: 'Notifications marked as read' } }) }))
export default router
