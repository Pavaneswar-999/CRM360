import { Router } from 'express'
import { z } from 'zod'
import { Customer, Activity, Lead, User } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/error.js'
import { validate } from '../middleware/validate.js'
import { canSeeAll, logActivity } from '../utils/activity.js'
import { escapeRegex, normalizeEmail, parseLimit, parsePage } from '../utils/normalize.js'

const router = Router(); router.use(requireAuth)
const customerFields = z.object({ name: z.string().trim().min(2).max(100), company: z.string().trim().min(2).max(120), email: z.email(), phone: z.string().max(30).optional(), address: z.string().max(240).optional(), industry: z.string().max(80).optional(), status: z.enum(['Active', 'At Risk', 'Inactive']).optional(), source: z.string().max(80).optional(), owner: z.string().optional(), tags: z.array(z.string().max(30)).max(10).optional(), notes: z.string().max(2000).optional() })
const scope = (req: Express.Request) => canSeeAll(req.user!.role) ? {} : { $or: [{ owner: req.user!.id }, { createdBy: req.user!.id }] }

router.get('/', asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page), limit = parseLimit(req.query.limit), search = String(req.query.search || '').trim(), filter = req.query.status ? { status: req.query.status } : {}
  const searchFilter = search ? { $or: [{ name: { $regex: escapeRegex(search), $options: 'i' } }, { company: { $regex: escapeRegex(search), $options: 'i' } }, { email: { $regex: escapeRegex(search), $options: 'i' } }] } : {}
  const query = { ...scope(req), ...filter, ...searchFilter }; const [items, total] = await Promise.all([Customer.find(query).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).populate('owner', 'name role').lean(), Customer.countDocuments(query)])
  res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } })
}))

router.post('/', validate(z.object({ body: customerFields })), asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email); const owner = canSeeAll(req.user!.role) && req.body.owner ? req.body.owner : req.user!.id
  if (!(await User.exists({ _id: owner, active: true }))) throw new AppError('Customer owner not found', 400)
  if (await Customer.exists({ email, company: req.body.company.trim() })) throw new AppError('A customer with this email and company already exists', 409)
  const customer = await Customer.create({ ...req.body, email, owner, createdBy: req.user!.id })
  await logActivity({ type: 'customer_created', description: `Added ${customer.name} as a customer`, actor: req.user!.id, customer: customer._id.toString() })
  res.status(201).json({ success: true, data: { customer } })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, ...scope(req) }).populate('owner', 'name role').populate('convertedFromLead', 'name stage').lean()
  if (!customer) throw new AppError('Customer not found', 404)
  const [activities, tasks] = await Promise.all([Activity.find({ customer: customer._id }).sort({ createdAt: -1 }).populate('actor', 'name').lean(), (await import('../models/index.js')).Task.find({ relatedCustomer: customer._id }).sort({ dueDate: 1 }).lean()])
  res.json({ success: true, data: { customer, activities, tasks } })
}))

router.patch('/:id', validate(z.object({ body: customerFields.partial() })), asyncHandler(async (req, res) => {
  const updates = { ...req.body, ...(req.body.email ? { email: normalizeEmail(req.body.email) } : {}) }
  if (!canSeeAll(req.user!.role)) delete updates.owner
  if (canSeeAll(req.user!.role) && updates.owner && !(await User.exists({ _id: updates.owner, active: true }))) throw new AppError('Customer owner not found', 400)
  const customer = await Customer.findOneAndUpdate({ _id: req.params.id, ...scope(req) }, updates, { new: true, runValidators: true }).populate('owner', 'name role')
  if (!customer) throw new AppError('Customer not found', 404)
  await logActivity({ type: 'customer_updated', description: `Updated ${customer.name}`, actor: req.user!.id, customer: customer._id.toString() })
  res.json({ success: true, data: { customer } })
}))

router.delete('/:id', requireRole('Admin', 'Sales Manager'), asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id, ...scope(req) }); if (!customer) throw new AppError('Customer not found', 404)
  res.json({ success: true, data: { message: 'Customer deleted' } })
}))
export default router
