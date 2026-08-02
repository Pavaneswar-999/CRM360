# CRM360 Project Report

## Abstract

CRM360 is a focused SaaS CRM platform for small and medium-sized teams that need one reliable place for customers, leads, follow-ups, tasks, ownership, and pipeline progress. Its differentiator is a deterministic Focus Queue that turns live CRM records into clear next actions.

## Introduction and problem statement

Small teams often split customer information between spreadsheets, email, chat, and personal task lists. This creates duplicate records, unclear ownership, and missed follow-ups. Enterprise CRMs can solve these problems but often introduce more configuration and visual complexity than a small team needs.

## Objectives

Centralize relationship records; protect data with authentication and roles; make pipeline progress visible; connect notes and tasks to records; calculate dashboard values from the database; and provide a responsive, readable SaaS experience.

## Proposed solution

CRM360 provides a public introduction, secure account flows, a protected workspace, customer and lead records, a six-stage pipeline, task management, activity history, notifications, team permissions, and a dashboard with a Focus Queue.

## Functional and non-functional requirements

Functional requirements cover authentication, role management, customer/lead/task workflows, pipeline movement, conversion, dashboard metrics, notifications, and profile settings. Non-functional requirements cover responsive layout, accessibility, validation, security middleware, safe errors, indexes, buildability, and deployability.

## Technology stack and architecture

React/Vite/TypeScript powers the frontend. Express/Node/TypeScript exposes REST APIs. Mongoose maps the domain models to MongoDB Atlas. Render provides the verified showcase deployment, while Vercel remains an optional frontend alternative. See `ARCHITECTURE.md` and `DATABASE-SCHEMA.md`.

## Module descriptions

Authentication and RBAC, customers, leads, pipeline, tasks, dashboard, notifications, team, search, and settings are implemented as separate API/resource and route-level UI areas with shared components.

## Role and permission matrix

| Capability | Admin | Sales Manager | Sales Executive |
| --- | --- | --- | --- |
| Full workspace records | Yes | Team scope | Assigned/created scope |
| User roles | Yes | No | No |
| Assign leads/tasks | Yes | Yes | Own work |
| Delete records | Yes | Customer scope | No unrestricted delete |
| Dashboard analytics | Yes | Yes | Own/team-visible data |
| Convert authorized leads | Yes | Yes | Qualified/won permitted leads |

## Security implementation

Bcrypt password hashing, JWT middleware, backend RBAC, ownership checks, Zod validation, Helmet, CORS, reset-token hashing/expiry, rate limiting, normalized input, and sanitized public users are included. See `SECURITY.md`.

## Testing and deployment

The test/build outputs are documented by the repository checks and `TESTING.md`. Deployment follows `DEPLOYMENT.md`; the public frontend and API readiness endpoints have been verified after deployment.

## Limitations and future scope

In local development without SMTP, password reset returns a safe reset link for testing; production sends reset links through the configured email provider. Notifications use controlled refresh instead of real-time sockets, the product currently uses one pipeline, and stage movement uses explicit controls instead of drag-and-drop. Future work may include email and calendar integrations, real-time events, imports, richer analytics, and configurable workspaces.

## Conclusion

CRM360 is designed around a simple promise: every relationship and every next step should be visible enough to act on. The implementation prioritizes honest, database-backed workflows and a calm interface that helps small teams keep momentum.
