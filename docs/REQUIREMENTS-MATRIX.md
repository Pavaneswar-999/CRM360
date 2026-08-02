# CRM360 Requirements Matrix

This is the completion checklist for the problem statement. “Implemented” means there is a route, persisted model, UI action, permission boundary, and verification path—not merely a visual placeholder.

| Requirement | API/data | UI route | Status / evidence |
| --- | --- | --- | --- |
| Registration | `POST /api/auth/register`, User, RefreshToken | `/register` | Implemented; requires MongoDB readiness. |
| Secure login | `POST /api/auth/login`, bcrypt, JWT issuer/audience | `/login` | Implemented; short-lived access token plus HttpOnly refresh cookie. |
| Forgot/reset password | Reset token model and routes | `/forgot-password`, `/reset-password` | Implemented; production email provider remains deployment configuration. |
| Profile management | `PATCH /api/users/profile` | `/app/settings` | Implemented. |
| Role management | `GET /api/users`, `PATCH /api/users/:id/role` | `/app/team` | Implemented for Admin/Manager views; invite email is intentionally not represented as a fake action. |
| Customer CRUD | Scoped customer routes and indexes | `/app/customers` | Implemented; search/filter/edit/delete and empty/error states. |
| Customer details | `GET /api/customers/:id` with activity/tasks | Customer details dialog from `/app/customers` | Implemented with live activity and open-task context. |
| Lead CRUD and notes | Lead routes, notes, activities | `/app/leads` | Implemented. |
| Lead conversion | `POST /api/leads/:id/convert` | Lead workflow/pipeline | Implemented; qualified/won guard enforced server-side. |
| Pipeline | Stage enum and scoped stage updates | `/app/pipeline` | Implemented; stage changes persist through API. |
| Tasks | CRUD, assignment, due state, completion | `/app/tasks`, dashboard quick add | Implemented. |
| Dashboard insights | Aggregations for metrics, stages, tasks, activity, focus queue | `/app` | Implemented against live MongoDB data. |
| Notifications | Assignment/stage events and read state | `/app/notifications` | Implemented; refresh on navigation and controlled polling are the current delivery method. |
| Responsive UI | CSS breakpoints, mobile nav, tables scroll safely | All frontend routes | Implemented and must be verified at 375/768/1024/1440px. |
| Deployment | Render API, MongoDB Atlas, Vercel frontend config | `render.yaml`, `client/vercel.json` | Configured; a real production deploy still requires user-owned hosting credentials and URLs. |

## Explicit non-claims

- No fake analytics or hardcoded “success” state is used as proof of backend persistence.
- No customer data or local source code was exported to Figma.
- No invite button is considered complete until an email/invitation persistence flow exists.
