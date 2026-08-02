# CRM360

CRM360 is a focused customer relationship workspace for small teams. It keeps every relationship, next action, owner, follow-up, pipeline stage, task, and interaction in one clear place.

## Project status

CRM360 implements the core CRM workflows described in the project brief. The product is centered on working, database-backed customer, lead, task, pipeline, and follow-up workflows rather than decorative dashboard content.

The public experience uses the original **Editorial Signal Room** direction: mineral bone, carbon and moss structure, a muted citron action signal, and one canonical text-free image of record cards and task tabs. The landing page explains the real CRM workflow without presenting sample records as live data. Its workflow actions open the matching CRM area after registration.

## Structure

- `client/` — React + Vite frontend
- `server/` — Express + MongoDB REST API
- `docs/` — research, architecture, security, testing, deployment, and project report
- `docs/DESIGN-HANDOFF.md` — Stitch prompt, Figma handoff, and design iteration workflow
- `docs/UX-AUDIT.md` — screenshot findings, product coverage, and verification gaps
- `PLAN.md` — implementation plan and scope decisions

## Run locally

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and `JWT_SECRET`. For production password reset, also configure `APP_URL` and the SMTP variables.
2. Copy `client/.env.example` to `client/.env` if the API is not running on the default local URL.
3. Install dependencies: `npm run install:all`
4. Seed demo data: `npm run seed`
5. Start both apps: `npm run dev`

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`

## Live demo

- [Open the CRM360 frontend](https://crm360-web-su62.onrender.com)
- [API health](https://crm360-api-y6vx.onrender.com/api/health)
- [API readiness and database health](https://crm360-api-y6vx.onrender.com/api/health/ready)

If the browser shows “CRM360 API is offline,” the frontend is working but the API or MongoDB is not running. This machine currently has neither `mongod` on PATH nor a MongoDB Windows service, so account creation cannot persist until `MONGODB_URI` points to a running local or Atlas database.

## Demo credentials

The seed script creates fictional accounts for local demonstration. The credentials are documented in `docs/TESTING.md`; change them before any non-demo use.

## Deployment

The deployed showcase uses MongoDB Atlas plus one Render Blueprint containing both the API and frontend. Vercel remains an optional frontend alternative. Follow `docs/DEPLOYMENT.md` for environment variables, CORS, health checks, SPA fallback, and smoke tests.

## Current limitations

- In local development without SMTP, password reset returns a safe reset link for testing. Production sends reset links through the configured email provider.
- Notifications refresh when the page opens and through controlled polling. Assignment, stage, upcoming-deadline, and overdue-deadline notifications are persisted; real-time sockets are not currently included.
- Pipeline stages use explicit controls. Drag-and-drop can be added later after the interaction and accessibility details are verified.
