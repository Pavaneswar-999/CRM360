# CRM360 Security Notes

- Passwords are hashed with bcrypt and never returned from the API.
- Short-lived JWT access tokens are signed with an environment-provided secret, issuer, and audience, then validated on every protected request. Rotated refresh tokens are hashed in MongoDB and delivered in an HttpOnly cookie; logout and password reset revoke active refresh sessions.
- Roles and ownership are enforced in Express middleware and resource queries; hidden UI controls are not treated as authorization.
- Password reset tokens are random, hashed before storage, expiring, and one-time use.
- Helmet, credentialed allowlisted CORS, JSON body limits, input normalization, Zod validation, safe error responses, readiness checks, and stricter authentication rate limiting are enabled.
- Secrets belong in environment variables. `.env` files are ignored and `.env.example` contains placeholders only.
- For production, use HTTPS, a strong rotated `JWT_SECRET`, a restricted MongoDB Atlas network policy, a specific `CLIENT_URL`, and a real email provider before enabling email reset delivery.
