import type { ErrorRequestHandler, RequestHandler } from 'express'

export class AppError extends Error { statusCode: number; details?: unknown; constructor(message: string, statusCode = 400, details?: unknown) { super(message); this.statusCode = statusCode; this.details = details } }
export const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
export const notFound: RequestHandler = (_req, _res, next) => next(new AppError('Route not found', 404))
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof AppError ? error.statusCode : error?.code === 11000 ? 409 : ['ValidationError', 'CastError'].includes(error?.name) ? 400 : 500
  const message = error instanceof AppError ? error.message : error?.code === 11000 ? 'That record already exists.' : error?.name === 'CastError' ? 'The resource identifier is invalid.' : status === 400 ? 'The request could not be processed.' : 'Something went wrong on the server.'
  res.status(status).json({ success: false, error: message, ...(error instanceof AppError && error.details ? { details: error.details } : {}) })
}
