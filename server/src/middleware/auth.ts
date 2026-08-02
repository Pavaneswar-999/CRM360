import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User, type Role } from '../models/index.js'
import { AppError, asyncHandler } from './error.js'

type TokenPayload = { sub: string }
export const signToken = (id: string) => jwt.sign({ sub: id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'], issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE })

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401)
  try {
    const decoded = jwt.verify(header.slice(7), env.JWT_SECRET, { issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE }) as TokenPayload
    const user = await User.findById(decoded.sub).lean()
    if (!user || !user.active) throw new AppError('Your session is no longer active', 401)
    req.user = { id: user._id.toString(), role: user.role, name: user.name, email: user.email }
    next()
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError('Invalid or expired session', 401)
  }
})

export const requireRole = (...roles: Role[]): RequestHandler => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403))
  next()
}
