# CRM360 Execution Plan

## Current state

- Repository is empty except for an uncommitted Git repository.
- No frontend, backend, database schema, environment files, tests, deployment configuration, or documentation exist yet.
- Deadline is tomorrow, so the plan prioritizes a complete, testable vertical slice over speculative features.

## Recommended architecture

- Frontend: React + Vite + TypeScript, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Recharts, and Lucide React.
- Backend: Node.js + Express + TypeScript, modular REST API, JWT access authentication, bcrypt, Zod, Helmet, CORS, and rate limiting.
- Database: MongoDB Atlas with Mongoose models and indexes.
- Deployment target: Vercel frontend, Render backend, MongoDB Atlas database.
- Repository structure: `client/`, `server/`, `docs/`, and root-level setup/documentation files.

## Product and design decisions

- Product promise: “Every relationship. Every next step.”
- Authenticated UI is a calm, information-dense productivity workspace.
- Public landing page gets restrained depth and motion inspired by premium 3D/web references; no heavy WebGL scene is required for the CRM workspace.
- The differentiator is the database-derived Focus Queue and Next Action system, not an unimplemented AI feature.
- Stage movement uses reliable explicit controls first; drag-and-drop is optional only after core workflows are verified.
- Forgot/reset password uses hashed, expiring tokens and a development-safe reset link response when no email provider is configured; the limitation is documented honestly.

## Delivery order

1. Scaffold client/server, shared environment templates, design tokens, and documentation skeleton.
2. Build authentication + protected dashboard vertical slice: register/login/session restore/logout, seeded user, real dashboard API, and one database-backed record path.
3. Add backend models, RBAC middleware, and CRUD for customers, leads, tasks, activities, and notifications.
4. Add customer/lead/task screens, pipeline stages, next actions, lead conversion, and Focus Queue.
5. Add landing page, responsive shell, states, accessibility, validation, and interaction feedback.
6. Add seed data, API/UI tests, production build, deployment configuration, and submission report.
7. Run actual verification and report only evidenced outcomes.

## Owner decisions that materially affect scope

- GitHub repository URL and deployment account/project names are needed for live deployment; code and deployment-ready configuration can proceed without them.
- MongoDB Atlas, Render, and Vercel credentials/environment values must be supplied by the owner when deploying.
- No approval is needed for small UI, copy, schema, or implementation details that preserve the brief and MVP scope.

## Acceptance checkpoints

- Checkpoint A: `npm run build` succeeds for client and server type-check/build.
- Checkpoint B: auth and RBAC tests pass against a test database or isolated in-memory test setup.
- Checkpoint C: customer, lead, pipeline conversion, tasks, dashboard, and notifications use real API/database data.
- Checkpoint D: production environment templates, health endpoint, CORS, SPA fallback, README, and docs are complete.
- Checkpoint E: live deployment is marked complete only after actual smoke tests and URLs are available.
