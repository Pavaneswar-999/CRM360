# CRM360 UX Audit and Tomorrow-Ready Scope

## What the screenshot revealed

The registration page was technically usable as a form, but it did not communicate a complete product. The large empty areas and decorative orbital graphic gave the user no evidence of what happens after account creation. The generic error also hid the real blocker: the browser could not complete the API/database-backed registration flow in the current local environment.

## Priority findings

| Priority | Finding | User impact | Correction |
| --- | --- | --- | --- |
| P0 | Registration failure was reported as “Unable to create your account.” | A user cannot distinguish a bad form, duplicate email, offline API, or missing MongoDB. | Show the API response when available and an actionable offline/API message when there is no response. |
| P0 | No visible product preview on account creation. | The user is asked to commit before understanding the value. | Show a Focus Queue preview with ownership, due state, and linked customer context beside the form. |
| P1 | The public page focused on visual atmosphere more than the complete operating surface. | Visitors may assume CRM360 is only a pipeline. | Add a relationship-surface section covering leads, customers, tasks, insights, search, and use-case domains. |
| P1 | The form did not enforce the password rule it displayed. | Invalid data reached the server and feedback was delayed. | Enforce the eight-character minimum client-side and keep server validation authoritative. |
| P1 | Auth layout had weak next-step orientation. | The page felt short and unfinished, especially on a large display. | Add overview navigation, product capability proof, and a more intentional content rhythm. |
| P2 | Visual motion and decoration could compete with task clarity. | Decorative effects can distract and may be uncomfortable for some users. | Keep motion restrained and preserve the existing reduced-motion handling. |

## Product coverage for the MVP

CRM360 should be judged as a relationship operating layer, not only a sales board. The tomorrow-ready slice therefore keeps these connected:

- Customers: owner, contact details, activity history, and relationship context.
- Leads: source, stage, value, owner, and conversion path.
- Tasks: due date, priority, related record, assignment, and completion state.
- Pipeline: stage movement with a clear next action on every active opportunity.
- Dashboard: focus queue, pipeline summary, recent activity, and quick actions.
- Notifications: visible changes that require a person to respond.
- Access: role-aware API enforcement for Admin, Sales Manager, and Sales Executive.
- Foundations: documented MongoDB schema, JWT auth, validation, rate limiting, deployment notes, and honest empty/error states.

## Visual direction

The current implementation follows the CRM360 Figma exploration at `docs/figma-crm360-exploration.png` and the linked Figma board. The visual language is deliberately calm and editorial: near-white surfaces, navy structure, indigo action color, green status signals, and compact data previews. Stitch-style generation can help explore alternate compositions, while React remains the source of truth for the working product.

## Verification gap

The frontend build and server smoke tests can run without external credentials. Full registration, login, and record persistence still require a running MongoDB instance and the server environment in `server/.env`. This is an environment dependency, not a UI success claim.
