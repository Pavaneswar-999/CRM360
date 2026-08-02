import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { z } from 'zod'
import { env } from '../config/env.js'
import { PasswordResetToken, RefreshToken, User, publicUser } from '../models/index.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/error.js'
import { validate } from '../middleware/validate.js'
import { normalizeEmail } from '../utils/normalize.js'
import { clearRefreshCookie, readCookie, setRefreshCookie } from '../utils/cookies.js'

const router = Router()
const registerSchema = z.object({ body: z.object({ name: z.string().trim().min(2).max(80), email: z.email(), password: z.string().min(8).max(100) }) })
const loginSchema = z.object({ body: z.object({ email: z.email(), password: z.string().min(1) }) })
const forgotSchema = z.object({ body: z.object({ email: z.email() }) })
const resetSchema = z.object({ body: z.object({ token: z.string().min(20), password: z.string().min(8).max(100) }) })

const hashToken = (value: string) => crypto.createHash('sha256').update(value).digest('hex')

const issueRefreshToken = async (userId: string, req: Request, res: Response) => {
  const rawToken = crypto.randomBytes(48).toString('base64url')
  await RefreshToken.create({ user: userId, tokenHash: hashToken(rawToken), expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000), userAgent: String(req.headers['user-agent'] || '').slice(0, 240), ip: req.ip })
  setRefreshCookie(res, rawToken)
}

const session = async (userId: string, req: Request, res: Response) => {
  await issueRefreshToken(userId, req, res)
  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found', 404)
  return { user: publicUser(user), token: signToken(userId) }
}

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email)
  if (await User.exists({ email })) throw new AppError('An account with that email already exists', 409)
  // Public registration can never mint an elevated role. Role changes are an
  // authenticated admin operation handled by the users route.
  const user = await User.create({ name: req.body.name, email, passwordHash: await bcrypt.hash(req.body.password, 12), role: 'Sales Executive' })
  res.status(201).json({ success: true, data: await session(user._id.toString(), req, res) })
}))

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: normalizeEmail(req.body.email) }).select('+passwordHash')
  if (!user || !user.active || !(await bcrypt.compare(req.body.password, user.passwordHash))) throw new AppError('Email or password is incorrect', 401)
  res.json({ success: true, data: await session(user._id.toString(), req, res) })
}))

router.post('/refresh', asyncHandler(async (req, res) => {
  const rawToken = readCookie(req, 'crm360_refresh')
  if (!rawToken) throw new AppError('Refresh session required', 401)
  const current = await RefreshToken.findOne({ tokenHash: hashToken(rawToken), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
  if (!current) { clearRefreshCookie(res); throw new AppError('Refresh session expired', 401) }
  current.revokedAt = new Date(); await current.save()
  const user = await User.findOne({ _id: current.user, active: true })
  if (!user) { clearRefreshCookie(res); throw new AppError('Your account is no longer active', 401) }
  res.json({ success: true, data: await session(user._id.toString(), req, res) })
}))

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.id)
  if (!user) throw new AppError('User not found', 404)
  res.json({ success: true, data: { user: publicUser(user) } })
}))

router.post('/logout', asyncHandler(async (req, res) => {
  const rawToken = readCookie(req, 'crm360_refresh')
  if (rawToken) await RefreshToken.updateOne({ tokenHash: hashToken(rawToken), revokedAt: { $exists: false } }, { revokedAt: new Date() })
  clearRefreshCookie(res)
  res.json({ success: true, data: { message: 'Signed out' } })
}))

router.post('/forgot-password', validate(forgotSchema), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: normalizeEmail(req.body.email) })
  if (!user) return res.json({ success: true, data: { message: 'If an account exists, a reset flow is available.' } })
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  await PasswordResetToken.deleteMany({ user: user._id, usedAt: { $exists: false } })
  await PasswordResetToken.create({ user: user._id, tokenHash, expiresAt: new Date(Date.now() + env.RESET_TOKEN_TTL_MINUTES * 60 * 1000) })
  const data: { message: string; resetToken?: string } = { message: 'A development reset token was created. No email was sent because no email provider is configured.' }
  if (env.NODE_ENV !== 'production') data.resetToken = rawToken
  res.json({ success: true, data })
}))

router.post('/reset-password', validate(resetSchema), asyncHandler(async (req, res) => {
  const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex')
  const reset = await PasswordResetToken.findOne({ tokenHash, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
  if (!reset) throw new AppError('That reset link is invalid or expired', 400)
  const user = await User.findById(reset.user).select('+passwordHash')
  if (!user) throw new AppError('User not found', 404)
  user.passwordHash = await bcrypt.hash(req.body.password, 12)
  await user.save()
  await RefreshToken.updateMany({ user: user._id, revokedAt: { $exists: false } }, { revokedAt: new Date() })
  reset.usedAt = new Date(); await reset.save()
  res.json({ success: true, data: { message: 'Password updated. You can sign in now.' } })
}))

export default router
