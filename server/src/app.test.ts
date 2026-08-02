import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from './app.js'

describe('CRM360 API smoke tests', () => {
  it('returns safe health information', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ ok: true, service: 'crm360-api' })
    expect(response.body).not.toHaveProperty('MONGODB_URI')
  })

  it('protects dashboard routes without a token', async () => {
    const response = await request(app).get('/api/dashboard')
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Authentication required')
  })

  it('distinguishes a live API from a database-ready API', async () => {
    const response = await request(app).get('/api/health/ready')
    expect(response.status).toBe(503)
    expect(response.body).toMatchObject({ ok: false, database: 'unavailable' })
  })

  it('does not create a refresh session without the HttpOnly cookie', async () => {
    const response = await request(app).post('/api/auth/refresh')
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Refresh session required')
  })

  it('returns a controlled response for unknown routes', async () => {
    const response = await request(app).get('/api/not-a-real-route')
    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
  })
})
