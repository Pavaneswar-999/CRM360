# CRM360 Deployment

## Verified showcase deployment

- Frontend: [https://crm360-web-su62.onrender.com](https://crm360-web-su62.onrender.com)
- API health: [https://crm360-api-y6vx.onrender.com/api/health](https://crm360-api-y6vx.onrender.com/api/health)
- API readiness: [https://crm360-api-y6vx.onrender.com/api/health/ready](https://crm360-api-y6vx.onrender.com/api/health/ready)

The public frontend and API readiness endpoint were verified after deployment; the readiness response confirmed that MongoDB was connected.

## MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user.
2. Allow the Render service IP policy required by your account.
3. Copy the connection string into `MONGODB_URI`.
4. Run the seed command once from a trusted environment: `npm run seed` from the repository root.

## Render API

Create a Node web service rooted at `server/`.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`, `PORT` supplied by Render, `MONGODB_URI`, a generated `JWT_SECRET`, `JWT_EXPIRES_IN=1h`, `JWT_ISSUER=crm360-api`, `JWT_AUDIENCE=crm360-web`, `REFRESH_TOKEN_TTL_DAYS=14`, `CLIENT_URL=https://crm360-web-su62.onrender.com`, `APP_URL=https://crm360-web-su62.onrender.com`, `RESET_TOKEN_TTL_MINUTES=30`, and SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) for the real password-reset email flow.
- Verify: `GET https://<render-host>/api/health` and `GET https://<render-host>/api/health/ready` (the readiness endpoint must return 200 only after MongoDB is connected).

## Render frontend

The repository Blueprint now creates both services in the same Render workspace:

- `crm360-api` — Express web service rooted at `server/`
- `crm360-web` — Render Static Site rooted at `client/`

- The frontend build receives the API's Render external URL through Blueprint service wiring. The client normalizes that origin to `/api`.
- The API receives the frontend's Render external URL as both `CLIENT_URL` and `APP_URL`.
- SPA fallback is defined in `render.yaml` so React Router refreshes resolve to `index.html`.
- No Vercel project is required for the one-workspace deployment path. `client/vercel.json` remains available only as an optional alternative.

## Privacy and secret checklist

- Keep repository visibility aligned with the submission requirements. This showcase repository is public so evaluators can open it without an invitation.
- Keep MongoDB, JWT, SMTP, and hosting credentials only in Render/Vercel environment variables or secret stores.
- Use a least-privilege MongoDB user, TLS connection string, and a restricted Atlas network policy appropriate for the Render service.
- This academic showcase uses broad Atlas network access so Render can connect from changing free-tier egress IPs. Do not use this configuration with real customer data; restrict the network policy and use a least-privilege role before production use.
- Keep Vercel project logs and Render logs access-controlled; never log request bodies, passwords, reset tokens, cookies, or authorization headers.

## Final smoke test

Open the live frontend URL, register or use a seeded account, log in, refresh, load dashboard data, create a customer, create/update a lead stage, complete a task, open notifications, and confirm the Render health endpoint. Check the deployed frontend bundle for localhost URLs and confirm no secrets are committed.
