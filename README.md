# Workline Frontend

Workline is a project management platform for teams that plan in sprints. This repository is the Next.js frontend. It talks to a separate Express, Prisma, PostgreSQL and Redis backend.

## Live links

- Live frontend: [https://YOUR-FRONTEND.vercel.app](https://YOUR-FRONTEND.vercel.app)
- Live backend: [https://YOUR-BACKEND.vercel.app](https://YOUR-BACKEND.vercel.app)
- Backend repository: [https://github.com/YOUR-USERNAME/YOUR-BACKEND-REPO](https://github.com/YOUR-USERNAME/YOUR-BACKEND-REPO)

## Demo accounts

The login page has a one click demo button for each role. The same accounts can be used by hand.

| Role | Email | Password |
| --- | --- | --- |
| Admin | YOUR-DEMO-ADMIN-EMAIL | YOUR-DEMO-ADMIN-PASSWORD |
| Organization owner | YOUR-DEMO-OWNER-EMAIL | YOUR-DEMO-OWNER-PASSWORD |
| Team member | YOUR-DEMO-MEMBER-EMAIL | YOUR-DEMO-MEMBER-PASSWORD |

These are demo only accounts. Stripe runs in test mode. Use the card `4242 4242 4242 4242` with any future date and any CVC.

## Features

- Three roles with separate areas: Admin, Organization owner and Team member
- Organizations, members, teams, projects, sprints, tasks, subtasks and comments
- Status rules for tasks, sprints and projects that match the backend
- Dashboards with charts for all three roles
- Search, filters, sorting and pagination saved in the URL
- Stripe Checkout in test mode with a payment history
- Audit log for admins
- Privacy policy and terms pages

## Tech stack

- Next.js 16 (App Router) and TypeScript
- Tailwind CSS and shadcn/ui (Base UI)
- TanStack Query and TanStack Form
- Zod for validation
- Zustand for the saved new project draft
- Recharts, Sonner and Lucide
- Stripe Checkout (through the backend)

## How authentication works

The login action saves the access token and the refresh token in httpOnly cookies. Server Components call the backend with the token. Client Components call `/api/proxy`, which adds the token. The file `src/proxy.ts` renews an expired access token and protects each role area.

## Run it locally

1. Install Node.js 20 or newer and npm.
2. Clone the repository and run:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in the values.
4. Run:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Name | Purpose |
| --- | --- |
| API_BASE_URL | Backend address including `/api/v1` |
| NEXT_PUBLIC_SITE_URL | Address of this frontend |
| NEXT_PUBLIC_CONTACT_EMAIL | Email shown on the contact page |
| DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD | Admin demo account |
| DEMO_OWNER_EMAIL, DEMO_OWNER_PASSWORD | Owner demo account |
| DEMO_MEMBER_EMAIL, DEMO_MEMBER_PASSWORD | Member demo account |