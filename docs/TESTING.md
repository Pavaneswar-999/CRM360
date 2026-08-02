# CRM360 Testing

## Commands

- `npm run lint --prefix server`
- `npm run lint --prefix client`
- `npm run build --prefix server`
- `npm run build --prefix client`
- `npm run test --prefix server`
- `npm run test:e2e --prefix client`
- `npm audit --prefix client --omit=dev --offline`
- `npm audit --prefix server --omit=dev --offline`

## Automated smoke coverage

The server Vitest suite checks the safe health response, authentication protection on dashboard routes, database readiness behavior, refresh-cookie rejection, and controlled 404 handling. The Playwright suite checks landing routes, sign-in form behavior, dashboard actions, customer empty states, lead and task assignment controls, task status control, the 375/768/1024/1440 responsive matrix, and serious/critical Axe findings on landing, auth, dashboard, and customers.

## Latest local verification

- Server tests: 1 file passed, 5 tests passed.
- Server type check: passed.
- Client type check: passed.
- Server production TypeScript build: passed.
- Client Vite production build: passed; the optional Three.js enhancement remains in its own lazy chunk.
- Playwright: 15 tests passed across desktop and mobile; one duplicate mobile run of the desktop-only width matrix was intentionally skipped.
- Axe: no serious or critical issues detected on the landing page, sign-in page, dashboard, or customers page.
- Offline production dependency audits: 0 vulnerabilities reported for both client and server lockfiles.
- MongoDB connection: not verified in this workspace because no local MongoDB service or Atlas credentials are configured.

## Demo accounts

All seeded demo accounts use password `CRM360-demo-2026`:

- `admin@crm360.demo` — Admin
- `manager@crm360.demo` — Sales Manager
- `maya@crm360.demo` — Sales Executive
- `noah@crm360.demo` — Sales Executive

These are fictional academic credentials and must be changed outside a demo environment.
