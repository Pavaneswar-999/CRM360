# CRM360 Testing

## Commands

- `npm run lint --prefix server`
- `npm run lint --prefix client`
- `npm run build --prefix server`
- `npm run build --prefix client`
- `npm run test --prefix server`
- `npm audit --prefix client --omit=dev --offline`
- `npm audit --prefix server --omit=dev --offline`

## Automated smoke coverage

The server Vitest suite checks the safe health response, authentication protection on dashboard routes, database readiness behavior, refresh-cookie rejection, and controlled 404 handling. The seeded demo data and UI flows are intended for end-to-end smoke testing with MongoDB running.

## Latest local verification

- Server tests: 1 file passed, 5 tests passed.
- Server type check: passed.
- Client type check: passed.
- Server production TypeScript build: passed.
- Client Vite production build: passed; output split the main bundle (`416.50 kB`) from the lazy WebGL scene (`930.14 kB`) before gzip.
- Offline production dependency audits: 0 vulnerabilities reported for both client and server lockfiles.
- MongoDB connection: not verified in this workspace because no local MongoDB service or Atlas credentials are configured.

## Demo accounts

All seeded demo accounts use password `CRM360-demo-2026`:

- `admin@crm360.demo` — Admin
- `manager@crm360.demo` — Sales Manager
- `maya@crm360.demo` — Sales Executive
- `noah@crm360.demo` — Sales Executive

These are fictional academic credentials and must be changed outside a demo environment.
