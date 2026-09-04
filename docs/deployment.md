# Deployment

## 1. Supabase
1. Create a project at https://supabase.com.
2. `supabase link --project-ref <ref>` then `supabase db push` to apply `supabase/migrations/*.sql` in order.
3. Create Storage buckets if migration 0011's `insert into storage.buckets` doesn't run automatically in your project (Dashboard → Storage → New bucket): `profile-assets`, `post-media`, `organisation-assets`, `event-assets` (public), `verification-documents` (private).
4. Deploy Edge Functions:
   ```bash
   supabase functions deploy cashfree-create-order
   supabase functions deploy cashfree-webhook --no-verify-jwt
   ```
5. Set Edge Function secrets: `supabase secrets set CASHFREE_APP_ID=... CASHFREE_SECRET_KEY=... CASHFREE_WEBHOOK_SECRET=... CASHFREE_ENV=PROD SUPABASE_SERVICE_ROLE_KEY=... APP_URL=https://your-app.vercel.app`
6. Optionally run `supabase/seed/seed.sql` against a staging project only.

## 2. Clerk
1. Create an application at https://dashboard.clerk.com.
2. Enable Email code and/or Phone code (SMS OTP) under User & Authentication.
3. Create a JWT template named `supabase` (claim `sub` = `{{user.id}}`) — see `docs/security.md`.
4. Add a webhook (user.created/updated/deleted) pointing at a `clerk-webhook` Edge Function you
   deploy alongside the two included here, verified with `CLERK_WEBHOOK_SECRET` (see the shape
   documented in `src/services/authService.ts`).
5. In Supabase Dashboard → Authentication, add Clerk as a third-party JWT issuer using its JWKS URL.

## 3. Vercel
1. Import the repository into Vercel.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add all variables from `.env.example` under Project Settings → Environment Variables (only the
   `VITE_`-prefixed ones need to reach the client; `SUPABASE_SERVICE_ROLE_KEY` and
   `CASHFREE_SECRET_KEY` should **not** be added to Vercel at all — they belong only in Supabase
   Edge Function secrets, never in a client-side build).
4. Deploy. `vercel.json` (included) provides the SPA rewrite so refreshing nested routes
   (e.g. `/profile/arjun-sharma`) doesn't 404.
5. Once real `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are
   set, the app automatically switches out of demo mode (see `src/constants/config.ts`) — no code
   changes required. Set `VITE_PAYMENTS_DEMO_MODE=false` once Cashfree is fully wired.

## Local development
```bash
npm install
cp .env.example .env
npm run dev
```
With no real keys in `.env`, the app runs fully in demo mode at `http://localhost:5173`.
