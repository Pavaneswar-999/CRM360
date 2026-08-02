import type { RequestHandler } from 'express'
import { z } from 'zod'
import { AppError } from './error.js'

export const validate = (schema: z.ZodType): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query })
  if (!result.success) return next(new AppError('Please check the highlighted fields', 422, result.error.issues.map((issue) => ({ path: issue.path, message: issue.message }))))
  req.body = result.data && typeof result.data === 'object' && 'body' in result.data ? result.data.body : req.body
  next()
}
