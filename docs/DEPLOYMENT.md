# CRM360 Deployment

## MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user.
2. Allow the Render service IP policy required by your account.
3. Copy the connection string into `MONGODB_URI`.
4. Run the seed command once from a trusted environment: `npm run seed` from the repository root.

## Render API

Create a Node web service rooted at `server/`.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`, `PORT` supplied by Render, `MONGODB_URI`, a generated `JWT_SECRET`, `JWT_EXPIRES_IN=1h`, `JWT_ISSUER=crm360-api`, `JWT_AUDIENCE=crm360-web`, `REFRESH_TOKEN_TTL_DAYS=14`, `CLIENT_URL=<Vercel URL>`, `RESET_TOKEN_TTL_MINUTES=30`
- Verify: `GET https://<render-host>/api/health` and `GET https://<render-host>/api/health/ready` (the readiness endpoint must return 200 only after MongoDB is connected).

## Vercel frontend

Create a Vercel project rooted at `client/`.

- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_API_BASE_URL=https://<render-host>/api`
- Set `VITE_API_BASE_URL=https://<render-host>/api`, enable SPA fallback so React Router refreshes resolve to `index.html`, and allow credentials for the HttpOnly refresh cookie.

## Final smoke test

Open the Vercel URL, register or use a seeded account, log in, refresh, load dashboard data, create a customer, create/update a lead stage, complete a task, open notifications, and confirm the Render health endpoint. Check the deployed frontend bundle for localhost URLs and confirm no secrets are committed.
