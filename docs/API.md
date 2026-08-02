# CRM360 API Overview

All routes are prefixed with `/api`. Protected routes require a short-lived `Authorization: Bearer <JWT>` access token. Refresh sessions are rotated, stored hashed in MongoDB, and sent only in an HttpOnly cookie.

| Area | Endpoints |
| --- | --- |
| Health | `GET /health`, `GET /health/ready` |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| Dashboard | `GET /dashboard` |
| Users | `GET /users`, `PATCH /users/:id/role`, `PATCH /users/profile` |
| Customers | `GET /customers`, `POST /customers`, `GET /customers/:id`, `PATCH /customers/:id`, `DELETE /customers/:id` |
| Leads | `GET /leads`, `POST /leads`, `GET /leads/:id`, `PATCH /leads/:id`, `POST /leads/:id/notes`, `POST /leads/:id/convert` |
| Tasks | `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read`, `POST /notifications/read-all` |

Success responses use `{ success: true, data: ... }`. Errors use `{ success: false, error: string, details?: [...] }`.
