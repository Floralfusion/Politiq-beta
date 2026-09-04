# POLITIQ

**Find the Right Person. Build Trusted Connections.**

POLITIQ is a professional networking and trusted-access platform for politics and public life:
Discover → Verify → Connect → Request → Access.

This repository is a working Beta implementation — not a mockup. It runs immediately in a
self-contained **demo mode** with zero configuration, and switches to live Clerk/Supabase/Cashfree
the moment real credentials are supplied.

## Tech stack
- **Frontend**: Vite, React 19, TypeScript (strict), Tailwind CSS v3, React Router, TanStack Query, Zustand, React Hook Form, Zod, Lucide icons
- **Auth**: Clerk (email/phone OTP)
- **Backend**: Supabase (Postgres, Row Level Security, Storage, Realtime, Edge Functions)
- **Payments**: Cashfree, via server-side Edge Functions (demo adapter included, real keys drop in later)
- **Testing**: Vitest + Testing Library (unit), Playwright (E2E, specs included)
- **Deployment**: Vercel (frontend), Supabase (backend)

## Quick start (demo mode — no setup required)
```bash
npm install
npm run dev
```
Open http://localhost:5173. Sign up with any email/phone; the demo OTP code is always `123456`.
Every flow — connections, messaging, verification, contact requests, Cashfree payments, the admin
console at `/admin` — works against local, in-browser demo data (see `src/demo/`).

## Going live
See `docs/deployment.md` for the full checklist (Supabase project + migrations, Clerk app + OTP +
JWT template, Cashfree keys, Vercel env vars). In short: copy `.env.example` to `.env`, fill in
real values, and the app auto-detects and switches out of demo mode — no code changes required.

## Architecture
See `docs/architecture.md`. Key docs:
- `docs/database.md` — schema & migrations
- `docs/security.md` — Clerk↔Supabase auth wiring, RLS guarantees, secret handling
- `docs/verification.md`, `docs/contact-access.md`, `docs/payments.md` — the three core workflows
- `docs/admin.md` — admin console & RBAC
- `docs/deployment.md` — Supabase / Clerk / Vercel setup
- `docs/testing.md` — **what was actually run and what wasn't**, with honest results

## Project structure
```
src/
  components/     shared UI (components/ui) + feature components
  layouts/        PublicLayout, AppLayout, AdminLayout
  pages/          public/, onboarding/, app/, admin/
  services/       demo/live-aware domain services
  demo/           in-browser demo backend (seed data + Zustand store)
  hooks/          useAuth, etc.
  types/          shared domain types (mirrors the Postgres schema)
supabase/
  migrations/     full schema + RLS + storage policies, numbered
  functions/      cashfree-create-order, cashfree-webhook
  seed/           fictional development seed data
tests/
  unit/           Vitest
  e2e/            Playwright
docs/             architecture, database, security, verification, contact-access, payments, admin, deployment, testing
```

## Scripts
```bash
npm run dev         # local dev server
npm run typecheck   # tsc --noEmit, strict mode
npm run lint         # ESLint
npm test             # Vitest unit tests
npm run build        # production build
npm run preview      # preview the production build locally
npx playwright test  # E2E (requires `npx playwright install` first)
```

## Honest status (see docs/testing.md for the full table)
✅ Typecheck, lint, unit tests, and production build all pass in this environment.
⚠️ Playwright E2E and live Supabase/RLS testing were **not** executed here — the sandbox this was
built in has restricted network egress that blocks both Playwright's browser download and
provisioning a live Postgres instance. The specs and migrations are written and ready; run them
in your own environment or CI before treating this as production-verified.

## License
Proprietary — POLITIQ Beta. All rights reserved.
