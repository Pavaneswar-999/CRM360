# CRM360 Architecture

## Runtime

```text
React/Vite client
       │ JWT bearer requests
       ▼
Express REST API ── Mongoose ── MongoDB Atlas
       │
       ├── auth + RBAC
       ├── customers / leads / tasks
       ├── activities / notifications
       └── dashboard aggregation
```

## Repository

- `client/src/components` — shared shell, fields, badges, dialogs, empty states.
- `client/src/pages` — route-level product surfaces.
- `server/src/models` — MongoDB/Mongoose models and indexes.
- `server/src/routes` — resource endpoints and request validation.
- `server/src/middleware` — auth, RBAC, validation, error handling.
- `server/src/utils` — activity/notification helpers and query normalization.

## Vertical slice

Login returns a short-lived JWT and public user object while the API rotates a hashed refresh session in an HttpOnly cookie. The client keeps the access token in memory, restores a session with `/api/auth/refresh`, loads `/api/dashboard`, and renders database-derived metrics. Protected resource routes verify issuer/audience and enforce owner/role scope on the backend.

## Scope rules

Admins and Sales Managers can see team records. Sales Executives are limited to assigned/created records and cannot manage users or unrestricted deletion. The client may hide unavailable controls for clarity, but the backend is the authority.
