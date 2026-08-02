# CRM360 Database Schema

Mongoose models are in `server/src/models/index.ts`.

- **User**: name, unique email, hashed password, role, active state, profile fields.
- **Customer**: company/contact information, status, owner, tags, notes, creator, converted lead reference.
- **Lead**: contact information, stage, estimated value, expected close date, assigned owner, next action, follow-up timestamps, notes, conversion reference.
- **Task**: title, description, status, priority, due date, assignment, related lead/customer, completion timestamp.
- **Activity**: event type, description, actor, related customer/lead/task, metadata, timestamp.
- **Notification**: recipient, type, title, message, related entity, read state, timestamp.
- **PasswordResetToken**: hashed token, user, expiry, used timestamp.
- **RefreshToken**: hashed rotating session token, user, expiry, revocation timestamp, user-agent, and source IP metadata.

Indexes cover unique user email, customer email/company duplicates, lead search fields, owners, lead stage, task due/status, notification recipient/read state, and automatic expiry of password-reset/refresh sessions.
