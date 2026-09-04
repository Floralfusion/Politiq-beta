/**
 * authService documents the live-mode auth contract. Actual sign-in/sign-up UI is Clerk's own
 * <SignIn>/<SignUp> components (see src/pages/public/LoginPage.tsx and SignupPage.tsx), which
 * handle email/phone OTP verification end-to-end. This file covers the server-side half: syncing
 * a Clerk user into our `users`/`profiles` tables.
 *
 * Recommended wiring (see docs/deployment.md for full steps):
 *  1. Create a Clerk webhook (user.created / user.updated / user.deleted) pointing at a Supabase
 *     Edge Function (e.g. `clerk-webhook`), verified using CLERK_WEBHOOK_SECRET (svix signature).
 *  2. That function upserts a row into `users` (and, after onboarding, `profiles`) using the
 *     service role key.
 *  3. In the Supabase Dashboard, add Clerk as a third-party JWT issuer so `supabase.auth`
 *     sessions on the client carry the Clerk-issued JWT, letting RLS policies use
 *     `auth.jwt() ->> 'sub'` to identify the caller (see supabase/migrations/0010_row_level_security.sql).
 */
export const authService = {
  // Intentionally thin — see file header. All real auth flows go through Clerk components + the
  // clerk-webhook Edge Function, not through client-side service calls.
};
