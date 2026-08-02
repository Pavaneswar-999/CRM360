# CRM360

CRM360 is a focused customer relationship workspace for small teams. It keeps every relationship, next action, owner, follow-up, pipeline stage, task, and interaction in one clear place.

## MVP status

This project is being built as a submission-ready MERN MVP. The implementation is intentionally centered on working CRM workflows rather than decorative dashboard content.

## Structure

- `client/` — React + Vite frontend
- `server/` — Express + MongoDB REST API
- `docs/` — research, architecture, security, testing, deployment, and project report
- `docs/DESIGN-HANDOFF.md` — Stitch prompt, Figma handoff, and design iteration workflow
- `docs/UX-AUDIT.md` — screenshot findings, product coverage, and verification gaps
- `PLAN.md` — deadline-aware execution plan and scope decisions

## Run locally

1. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and `JWT_SECRET`. For production password reset, also configure `APP_URL` and the SMTP variables.
2. Copy `client/.env.example` to `client/.env` if the API is not running on the default local URL.
3. Install dependencies: `npm run install:all`
4. Seed demo data: `npm run seed`
5. Start both apps: `npm run dev`

Frontend: `http://localhost:5173`  
API: `http://localhost:5000`

If the browser shows “CRM360 API is offline,” the frontend is working but the API or MongoDB is not running. This machine currently has neither `mongod` on PATH nor a MongoDB Windows service, so account creation cannot persist until `MONGODB_URI` points to a running local or Atlas database.

## Demo credentials

The seed script creates fictional accounts for local demonstration. The credentials are documented in `docs/TESTING.md`; change them before any non-demo use.

## Deployment

The intended production targets are MongoDB Atlas, Render, and Vercel. Follow `docs/DEPLOYMENT.md` for environment variables, CORS, health checks, SPA fallback, and smoke tests.

## Known limitations

- Password reset uses a development-safe reset-link response when no email provider is configured.
- Notifications refresh on navigation and controlled polling; real-time sockets are intentionally out of the one-day MVP scope.
- The initial pipeline uses explicit stage controls; drag-and-drop is only added if it can be verified reliably after core workflows are complete.
