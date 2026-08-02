import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/crm360'),
  JWT_SECRET: z.string().min(16).default('development-only-crm360-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_ISSUER: z.string().default('crm360-api'),
  JWT_AUDIENCE: z.string().default('crm360-web'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(14),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  APP_URL: z.string().default('http://localhost:5173'),
  RESET_TOKEN_TTL_MINUTES: z.coerce.number().default(30),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
})

export const env = schema.parse(process.env)
if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'development-only-crm360-secret-change-me') throw new Error('JWT_SECRET must be set to a strong production secret')
if (env.NODE_ENV === 'production' && (!process.env.MONGODB_URI || !process.env.CLIENT_URL)) throw new Error('MONGODB_URI and CLIENT_URL must be set in production')
if (env.NODE_ENV === 'production' && (!env.APP_URL || !env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD || !env.SMTP_FROM)) throw new Error('APP_URL and SMTP settings must be set in production')
