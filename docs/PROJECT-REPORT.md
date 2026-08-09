# CRM360 Project Report

## Abstract

CRM360 is a web-based customer relationship management platform for small and medium-sized teams. It replaces disconnected spreadsheets, email threads, and personal task lists with a single workspace for customers, leads, tasks, follow-ups, activity history, and pipeline progress. The application uses the MERN stack: React and TypeScript on the client, Node.js and Express on the server, and MongoDB through Mongoose. Its dashboard is calculated from stored records, so the priorities and totals shown to a signed-in user reflect the data available to that user.

## Problem statement

When customer information is spread across files and messages, teams lose context. The same contact may be entered more than once, a lead may have no clear owner, and a promised follow-up can be missed. Larger CRM products address these problems, but they can be expensive or unnecessarily complex for a small team or an academic project. CRM360 addresses the core daily work: record a relationship, assign responsibility, set the next action, track progress, and review what needs attention.

## Objectives

The project was designed to provide secure account access, role-based permissions, customer and lead management, task assignment, a structured sales pipeline, activity history, notifications, and dashboard insights. It also aims to remain responsive, readable, and maintainable across desktop and mobile screens.

## Proposed solution

CRM360 provides a public introduction to the product and a protected workspace after sign-in. Users can add and update customers and leads, assign work, add lead notes, change a lead stage, convert an eligible lead to a customer, and record or complete tasks. The application keeps related activity visible with each record. The dashboard combines current tasks, follow-ups, pipeline counts, recent activity, and summary metrics from MongoDB data.

## Technology stack and architecture

The frontend uses React, Vite, TypeScript, React Router, React Hook Form, Framer Motion, GSAP, Lenis, and Lucide icons. The backend uses Node.js, Express, TypeScript, Mongoose, Zod, bcrypt, JWT, Helmet, CORS, and rate limiting. MongoDB Atlas stores the application data. The public showcase is deployed through a Render Blueprint containing the Express API and the React static site.

The client sends authenticated requests to REST endpoints under `/api`. The API validates the request, applies role and ownership checks, and reads or writes MongoDB documents. Protected requests use a short-lived access token. Refresh sessions are stored as hashed records and delivered in an HttpOnly cookie.

## Main modules

### Authentication and profiles

Users can register, sign in, sign out, refresh a session, request a password reset, reset a password, and update profile information. Passwords are hashed before storage. Reset tokens are random, hashed, time-limited, and single-use.

### Roles and permissions

CRM360 supports Admin, Sales Manager, and Sales Executive roles. Admins can manage users and workspace-wide records. Sales Managers work within their team scope. Sales Executives are restricted to records they own, create, or are assigned. The backend enforces these rules; hiding a button in the client is not treated as security.

### Customers, leads, and the pipeline

Customer records store company and contact information, ownership, tags, notes, and activity. Lead records store source, stage, estimated value, follow-up details, next actions, notes, and conversion information. Leads move through New, Contacted, Qualified, Proposal Sent, Won, and Lost stages. Eligible qualified or won leads can be converted into customers while keeping their relationship history.

### Tasks, activity, and notifications

Users can create, assign, prioritize, and complete tasks. Tasks can be connected to a lead or customer and have due dates. Activity records show meaningful changes, such as an assignment or a stage update. Notifications are stored for assignments, lead changes, and upcoming or overdue tasks. The client checks for updates when the notifications area is opened and on a controlled refresh interval.

### Dashboard and search

The dashboard presents a current work queue, pipeline stage counts, recent activity, and totals calculated from stored records. Its zero-data state provides genuine creation routes rather than sample records. Search, filters, and route-specific actions connect to the relevant CRM area.

## Role and permission matrix

| Capability | Admin | Sales Manager | Sales Executive |
| --- | --- | --- | --- |
| View workspace records | Yes | Team scope | Assigned or created scope |
| Change user roles | Yes | No | No |
| Assign leads and tasks | Yes | Yes | Own work |
| Delete records | Yes | Customer scope | No unrestricted delete |
| View dashboard data | Yes | Team scope | Assigned or created scope |
| Convert eligible leads | Yes | Yes | Eligible assigned leads |

## Security and reliability

CRM360 applies bcrypt password hashing, JWT verification, role and ownership checks, Zod validation, Helmet security headers, credentialed allowlisted CORS, request size limits, authentication rate limiting, safe error responses, and database indexes. Secrets are supplied through environment variables and are not committed to the repository. The `.env.example` files contain variable names and example values only.

For the public demonstration, MongoDB Atlas allows the deployed Render service to connect. A production system using real customer information should use a least-privilege database user and a restricted network policy.

## Interface and accessibility

The interface uses an editorial visual system with readable Manrope text, restrained monospace metadata, mineral-bone surfaces, carbon and moss structure, and a muted citron action signal. The public landing page uses original text-free images and a static relationship map. The signed-in workspace emphasizes current work and real record actions. The application supports visible focus states, labelled fields, keyboard navigation, reduced motion, responsive layouts, loading states, empty states, errors, and permission-denied states.

## Testing and deployment

The project includes server tests, client linting and production builds, Playwright route and responsive checks, and Axe accessibility scans. The latest local checks recorded in `docs/TESTING.md` show five server tests passed, fifteen Playwright tests passed with one expected skip, no serious or critical Axe findings on the checked routes, and no reported production dependency vulnerabilities in the offline audit.

The live frontend is available at https://crm360-web-su62.onrender.com. The API health endpoint is available at https://crm360-api-y6vx.onrender.com/api/health, and the database readiness endpoint is available at https://crm360-api-y6vx.onrender.com/api/health/ready.

## Current scope and future work

The deployed project is a functioning academic showcase rather than a billing or multi-tenant product. Password reset email delivery requires SMTP configuration. Notifications use controlled polling instead of real-time sockets. The current sales process uses one pipeline and explicit stage controls. Future work could add calendar and email integrations, data import, real-time events, configurable workspaces, and richer reporting.

## Conclusion

CRM360 gives a small team one clear place to manage a relationship from the first lead through the next completed action. The delivered application focuses on database-backed workflows, permissions, and useful daily views rather than static demonstration content.
