# Security

## Identity: Clerk ↔ Supabase
1. In Clerk Dashboard → JWT Templates, create a template named `supabase` with claim `sub` = `{{user.id}}`.
2. In Supabase Dashboard → Authentication → Sign In / Providers, add Clerk as a third-party JWT
   issuer using Clerk's JWKS URL (`https://<your-clerk-domain>/.well-known/jwks.json`).
3. The client passes the Clerk session JWT as the Supabase `Authorization: Bearer` header
   (`@clerk/clerk-react`'s `getToken({ template: "supabase" })`), so `auth.jwt() ->> 'sub'`
   inside RLS policies resolves to the Clerk user id — matching `users.id` and `profiles.user_id`.
4. A Clerk webhook (`user.created`/`user.updated`/`user.deleted`) calls a `clerk-webhook` Edge
   Function (verified via svix signature using `CLERK_WEBHOOK_SECRET`) to keep `users` in sync.

## Row Level Security
Every table is covered — see `supabase/migrations/0010_row_level_security.sql`. Key guarantees:
- A user can only read/write their own private rows (messages in conversations they're a member
  of, their own verification documents, their own payments).
- Verification documents are readable only by their owner or a `VERIFICATION_REVIEWER`+ admin.
- Contact information is never returned by any policy directly — `contact_access` rows (which
  gate the actual contact-detail lookup) are only ever inserted by the `cashfree-webhook` Edge
  Function using the service role key, after payment is confirmed server-side.
- Admin tables (`admin_users`, `audit_logs`, `system_settings`, `reports` updates) require
  `is_admin()` / `is_admin('ROLE')` to pass, checked against the `admin_users` table server-side —
  never only hidden in the UI (`src/components/AdminRoute.tsx` is a UX convenience only).

## Secrets
Never exposed to the browser: `SUPABASE_SERVICE_ROLE_KEY`, `CASHFREE_SECRET_KEY`,
`CASHFREE_WEBHOOK_SECRET`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`. These are only referenced
in `supabase/functions/*` (Edge Function runtime) and set via `supabase secrets set`, never in
`VITE_`-prefixed variables (which Vite inlines into the client bundle).

## Payments
`paymentSuccess` is never trusted from the browser. The flow is: client requests an order via the
`cashfree-create-order` Edge Function → Cashfree Checkout runs client-side with a session id only
→ Cashfree calls `cashfree-webhook` server-to-server with a signed payload → the webhook verifies
the HMAC signature, checks idempotency via `payment_events.provider_event_id`, and only then marks
the payment `SUCCESS` and unlocks the resource. See `docs/payments.md`.

## File uploads
Verification documents go to the private `verification-documents` Storage bucket. MIME type,
extension and size should be validated both client-side (fast feedback) and — critically — in a
Storage policy / Edge Function server-side before accepting the upload in production. Documents
are never served via public URLs; only short-lived signed URLs generated for an authorized viewer.

## Known gaps in this Beta pass
- Rate limiting on Edge Functions is not yet implemented (recommended: Supabase's built-in rate
  limits or a lightweight token-bucket in Postgres before going to production traffic).
- The `clerk-webhook` Edge Function referenced above is documented but not included in this
  delivery — it's a small, mechanical addition once real Clerk keys are available (see
  docs/deployment.md for the shape it should take).
