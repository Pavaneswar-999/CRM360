import { Router } from 'express'
import { User, ROLES, publicUser } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/error.js'
import { z } from 'zod'
import { validate } from '../middleware/validate.js'
import bcrypt from 'bcryptjs'

const router = Router(); router.use(requireAuth)
router.get('/', requireRole('Admin', 'Sales Manager'), asyncHandler(async (_req, res) => res.json({ success: true, data: { users: (await User.find({ active: true }).sort({ name: 1 })).map(publicUser) } })))
router.patch('/:id/role', requireRole('Admin'), validate(z.object({ body: z.object({ role: z.enum(ROLES) }) })), asyncHandler(async (req, res) => {
  if (req.params.id === req.user!.id && req.body.role !== 'Admin' && await User.countDocuments({ role: 'Admin', active: true }) <= 1) throw new AppError('Keep at least one active admin', 409)
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })
  if (!user) throw new AppError('User not found', 404)
  res.json({ success: true, data: { user: publicUser(user) } })
}))
router.patch('/profile', validate(z.object({ body: z.object({ name: z.string().trim().min(2).max(80), phone: z.string().max(30).optional(), password: z.string().min(8).optional() }) })), asyncHandler(async (req, res) => {
  const updates: Record<string, unknown> = { name: req.body.name, phone: req.body.phone }
  if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, 12)
  const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true })
  if (!user) throw new AppError('User not found', 404)
  res.json({ success: true, data: { user: publicUser(user) } })
}))
export default router
