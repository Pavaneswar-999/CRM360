# CRM360 UX Audit

## Purpose

CRM360 is useful only when the visible interface leads to a real action. This audit records the rules used while rebuilding the product experience.

## Corrections made

| Area | Previous issue | Current behavior |
| --- | --- | --- |
| Public landing | Repeated cards and links led to the same destination. | Each workflow action has its own registration destination: leads, customers, tasks, or pipeline. |
| Hero imagery | Generated visual directions could drift between unrelated images. | One approved text-free master image is reused with controlled crops and overlays. |
| Authentication | The form was visually separate from the product story. | Live sign-in, registration, and password reset forms sit in the same full-canvas system with labels, errors, focus states, and password visibility controls. |
| Dashboard | Equal-weight metrics obscured daily priorities. | The “Now” queue comes from actual dashboard tasks, follow-ups, and lead activity. Zero-data actions open the real creation routes. |
| Navigation | Some display treatment implied workspace switching. | The sidebar now states the current workspace and role without implying an unavailable switcher. |
| Notifications | Due work needed an explicit system path. | The API creates persisted upcoming and overdue task notifications when the notifications endpoint is checked; the client refreshes them on load and every 30 seconds. |
| Motion | Visual effects risked hiding content or slowing work. | Marketing-only scroll motion leaves DOM content visible, while app/auth transitions are short and reduced-motion-safe. |

## Functional surface

- Customers: create, search, update, delete where authorised, and inspect activity/task context.
- Leads: create, assign, update, add notes, change stage, convert when allowed, and inspect follow-up details.
- Pipeline: display persisted stages and update lead stage through the API.
- Tasks: create, assign, set a due date and priority, and complete work.
- Dashboard: calculate metrics, current work, pipeline counts, and activity from MongoDB data.
- Notifications: show assignments, lead changes, and upcoming or overdue task work.
- Search and settings: use real routes and protected API data.

## Quality bar

No public page presents mock records as live data. No product claim exists without a supporting route, API behavior, or security control. Every visible CTA is tested for a meaningful path, and keyboard, screen-reader labels, contrast, responsive layout, and reduced-motion behavior are checked before release.
