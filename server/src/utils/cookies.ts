import type { Request, Response } from 'express'
import { env } from '../config/env.js'

export const REFRESH_COOKIE = 'crm360_refresh'

export const readCookie = (req: Request, name: string) => {
  const header = req.headers.cookie || ''
  const entry = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined
}

export const setRefreshCookie = (res: Response, value: string) => {
  const sameSite = env.NODE_ENV === 'production' ? 'SameSite=None; Secure' : 'SameSite=Lax'
  res.setHeader('Set-Cookie', `${REFRESH_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Path=/api/auth; Max-Age=${env.REFRESH_TOKEN_TTL_DAYS * 86400}; ${sameSite}`)
}

export const clearRefreshCookie = (res: Response) => {
  const sameSite = env.NODE_ENV === 'production' ? 'SameSite=None; Secure' : 'SameSite=Lax'
  res.setHeader('Set-Cookie', `${REFRESH_COOKIE}=; HttpOnly; Path=/api/auth; Max-Age=0; ${sameSite}`)
}
