import { Router } from 'express'
import { z } from 'zod'
import { Customer, Lead, Activity, User, Task } from '../models/index.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/error.js'
import { validate } from '../middleware/validate.js'
import { canSeeAll, logActivity, notify } from '../utils/activity.js'
import { escapeRegex, normalizeEmail, parseLimit, parsePage } from '../utils/normalize.js'

const router = Router(); router.use(requireAuth)
const leadFields = z.object({ name: z.string().trim().min(2).max(100), company: z.string().trim().min(2).max(120), email: z.email(), phone: z.string().max(30).optional(), source: z.string().max(80).optional(), stage: z.enum(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']).optional(), estimatedValue: z.coerce.number().min(0).optional(), probability: z.coerce.number().min(0).max(100).optional(), expectedCloseDate: z.coerce.date().optional(), assignedTo: z.string().optional(), nextAction: z.string().max(180).optional(), nextFollowUpAt: z.coerce.date().optional(), notes: z.string().max(3000).optional(), lostReason: z.string().max(500).optional() })
const scope = (req: Express.Request) => canSeeAll(req.user!.role) ? {} : { $or: [{ assignedTo: req.user!.id }, { createdBy: req.user!.id }] }

router.get('/', asyncHandler(async (req, res) => {
  const page = parsePage(req.query.page), limit = parseLimit(req.query.limit), search = String(req.query.search || '').trim(), stage = req.query.stage ? { stage: req.query.stage } : {}
  const text = search ? { $or: [{ name: { $regex: escapeRegex(search), $options: 'i' } }, { company: { $regex: escapeRegex(search), $options: 'i' } }, { email: { $regex: escapeRegex(search), $options: 'i' } }] } : {}
  const query = { ...scope(req), ...stage, ...text }; const [items, total] = await Promise.all([Lead.find(query).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).populate('assignedTo', 'name role').lean(), Lead.countDocuments(query)])
  res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } })
}))

router.post('/', validate(z.object({ body: leadFields })), asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email); const assignedTo = canSeeAll(req.user!.role) && req.body.assignedTo ? req.body.assignedTo : req.user!.id
  if (!(await User.exists({ _id: assignedTo, active: true }))) throw new AppError('Assigned teammate not found', 400)
  const lead = await Lead.create({ ...req.body, email, assignedTo, createdBy: req.user!.id })
  await logActivity({ type: 'lead_created', description: `Created ${lead.name} in ${lead.stage}`, actor: req.user!.id, lead: lead._id.toString() })
  if (assignedTo !== req.user!.id) await notify({ recipient: assignedTo, type: 'lead_assigned', title: 'New lead assigned', message: `${lead.name} is now assigned to you`, relatedEntityType: 'lead', relatedEntityId: lead._id.toString() })
  res.status(201).json({ success: true, data: { lead } })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, ...scope(req) }).populate('assignedTo', 'name role').populate('convertedCustomer', 'name').lean(); if (!lead) throw new AppError('Lead not found', 404)
  const [activities, tasks] = await Promise.all([Activity.find({ lead: lead._id }).sort({ createdAt: -1 }).populate('actor', 'name').lean(), Task.find({ relatedLead: lead._id }).sort({ dueDate: 1 }).lean()])
  res.json({ success: true, data: { lead, activities, tasks } })
}))

router.patch('/:id', validate(z.object({ body: leadFields.partial() })), asyncHandler(async (req, res) => {
  const current = await Lead.findOne({ _id: req.params.id, ...scope(req) }); if (!current) throw new AppError('Lead not found', 404)
  if (canSeeAll(req.user!.role) && req.body.assignedTo && !(await User.exists({ _id: req.body.assignedTo, active: true }))) throw new AppError('Assigned teammate not found', 400)
  const updates = { ...req.body, ...(req.body.email ? { email: normalizeEmail(req.body.email) } : {}) }
  if (!canSeeAll(req.user!.role)) delete updates.assignedTo
  const lead = await Lead.findByIdAndUpdate(current._id, updates, { new: true, runValidators: true }).populate('assignedTo', 'name role')
  if (!lead) throw new AppError('Lead not found', 404)
  if (req.body.stage && req.body.stage !== current.stage) {
    await logActivity({ type: 'stage_changed', description: `Moved ${lead.name} from ${current.stage} to ${lead.stage}`, actor: req.user!.id, lead: lead._id.toString(), metadata: { from: current.stage, to: lead.stage } })
    await notify({ recipient: (lead.assignedTo as unknown as { _id: string })._id.toString(), type: 'lead_stage_changed', title: 'Lead stage updated', message: `${lead.name} moved to ${lead.stage}`, relatedEntityType: 'lead', relatedEntityId: lead._id.toString() })
  }
  res.json({ success: true, data: { lead } })
}))

router.post('/:id/notes', validate(z.object({ body: z.object({ description: z.string().trim().min(2).max(3000) }) })), asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, ...scope(req) }); if (!lead) throw new AppError('Lead not found', 404)
  lead.notes = lead.notes ? `${lead.notes}\n\n${req.body.description}` : req.body.description; lead.lastInteractionAt = new Date(); await lead.save()
  const activity = await logActivity({ type: 'note_added', description: req.body.description, actor: req.user!.id, lead: lead._id.toString() })
  res.status(201).json({ success: true, data: { activity, lead } })
}))

router.post('/:id/convert', requireRole('Admin', 'Sales Manager', 'Sales Executive'), asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, ...scope(req) }); if (!lead) throw new AppError('Lead not found', 404)
  if (lead.convertedCustomer) throw new AppError('This lead has already been converted', 409)
  if (!['Qualified', 'Won'].includes(lead.stage)) throw new AppError('Only qualified or won leads can be converted', 422)
  const existing = await Customer.findOne({ email: lead.email, company: lead.company }); if (existing) { lead.convertedCustomer = existing._id; lead.convertedAt = new Date(); await lead.save(); return res.json({ success: true, data: { customer: existing, lead, alreadyExisting: true } }) }
  const customer = await Customer.create({ name: lead.name, company: lead.company, email: lead.email, phone: lead.phone, source: lead.source, owner: lead.assignedTo, createdBy: lead.createdBy, convertedFromLead: lead._id })
  lead.convertedCustomer = customer._id; lead.convertedAt = new Date(); lead.stage = 'Won'; await lead.save()
  await logActivity({ type: 'lead_converted', description: `Converted ${lead.name} into a customer`, actor: req.user!.id, lead: lead._id.toString(), customer: customer._id.toString() })
  res.status(201).json({ success: true, data: { customer, lead } })
}))
export default router
