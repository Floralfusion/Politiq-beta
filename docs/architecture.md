# Architecture

## Overview
POLITIQ is a single Vite + React 19 + TypeScript SPA, backed by Supabase (Postgres, Auth-adjacent
via Clerk, Storage, Realtime, Edge Functions), with Clerk handling authentication/OTP and Cashfree
handling payments through server-side Edge Functions.

```
Browser (React SPA)
  ├─ Clerk (auth UI + session) ──────────────► Clerk webhook ──► Supabase Edge Function (user sync)
  ├─ TanStack Query + services/*.ts ─────────► Supabase Postgres (RLS-protected)
  ├─ Supabase Storage (signed URLs) ─────────► private verification-documents bucket
  ├─ Supabase Realtime ───────────────────────► messages, notifications tables
  └─ Cashfree Checkout JS ────────────────────► cashfree-create-order Edge Function
                                                  └─► Cashfree API (order creation)
     Cashfree ──(server-to-server webhook)────► cashfree-webhook Edge Function ──► marks payment
                                                                                     SUCCESS, unlocks
                                                                                     contact/subscription
```

## Directory layout
- `src/pages` — route-level components, one per screen, split into `public/`, `onboarding/`, `app/`, `admin/`
- `src/layouts` — `PublicLayout`, `AppLayout` (responsive shell), `AdminLayout`
- `src/components` — shared UI primitives (`components/ui`) and feature components (`ProfileCard`, `PostCard`, etc.)
- `src/services` — one file per domain, each demo/live-aware (see `src/services/profileService.ts` for the reference pattern)
- `src/demo` — the in-browser demo backend: seed data + a persisted Zustand store standing in for Postgres when no real Supabase project is configured
- `src/hooks` — cross-cutting hooks (`useAuth`)
- `src/types` — shared domain types, mirrored by the Postgres schema in `supabase/migrations`
- `supabase/migrations` — full schema, RLS policies, storage bucket policies, in numbered order
- `supabase/functions` — Edge Functions (`cashfree-create-order`, `cashfree-webhook`)
- `supabase/seed` — fictional development seed data

## Demo mode vs. live mode
Controlled centrally in `src/constants/config.ts`. The app auto-detects whether real Clerk/Supabase
keys are present; if not, it runs entirely against local demo data (persisted to `localStorage` via
Zustand) so every flow — including payments — is fully explorable with zero external setup. Demo
mode is visibly labelled in the UI (banner in `AppLayout`, "Demo mode" badges on payment/pricing
screens) so it is never mistaken for a real transaction.

## Why Clerk + Supabase together
Clerk owns identity and OTP verification (its UX is more mature than rolling this by hand).
Supabase owns data, RLS, storage and realtime. The two are connected by treating Clerk as a
third-party JWT issuer for Supabase Auth, so Postgres RLS policies can trust `auth.jwt() ->> 'sub'`
as the authenticated user's Clerk ID. See `docs/security.md` for the exact configuration steps.
