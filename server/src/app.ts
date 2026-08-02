import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { env } from './config/env.js'
import { notFound, errorHandler } from './middleware/error.js'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import userRoutes from './routes/users.js'
import customerRoutes from './routes/customers.js'
import leadRoutes from './routes/leads.js'
import taskRoutes from './routes/tasks.js'
import notificationRoutes from './routes/notifications.js'

export const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL.split(',').map((value) => value.trim()), credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'crm360-api', environment: env.NODE_ENV }))
app.get('/api/health/ready', (_req, res) => { const ready = mongoose.connection.readyState === 1; res.status(ready ? 200 : 503).json({ ok: ready, service: 'crm360-api', database: ready ? 'connected' : 'unavailable' }) })
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, skipSuccessfulRequests: true, standardHeaders: 'draft-8', legacyHeaders: false, handler: (_req, res) => res.status(429).json({ success: false, error: 'Too many authentication attempts. Try again later.' }) }), authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/users', userRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/notifications', notificationRoutes)
app.use(notFound)
app.use(errorHandler)
