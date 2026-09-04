# Payments (Cashfree)

## Why an abstraction
`src/services/paymentService.ts` is the only place the app calls into payment logic. It is
demo/live-aware: in demo mode it simulates an order + immediate success against local state (see
`src/demo/store.ts`), clearly labelled everywhere it's shown ("Demo mode" badge in
`PaymentModal.tsx`). In live mode it calls the `cashfree-create-order` Edge Function and polls
order status — it never marks a payment successful itself.

## Going live
1. Get `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` from https://merchant.cashfree.com (Developers → API Keys).
2. `supabase secrets set CASHFREE_APP_ID=... CASHFREE_SECRET_KEY=... CASHFREE_ENV=PROD CASHFREE_WEBHOOK_SECRET=...`
3. `supabase functions deploy cashfree-create-order`
4. `supabase functions deploy cashfree-webhook --no-verify-jwt` (Cashfree calls this directly, so
   it can't require a Supabase user JWT — authenticity instead comes from the HMAC signature check
   inside the function).
5. In the Cashfree Dashboard, set the webhook URL to
   `https://<project-ref>.supabase.co/functions/v1/cashfree-webhook`.
6. Set `VITE_PAYMENTS_DEMO_MODE=false` in your Vercel environment variables.
7. Install Cashfree's Checkout JS SDK on the client (`npm install @cashfreepayments/cashfree-js`)
   and launch it with the `paymentSessionId` returned by `cashfree-create-order` — this one small
   piece (the actual `cashfree.checkout()` call) is left for you to wire once you have a real
   Cashfree sandbox account to test the redirect/callback URLs against, since that flow can only
   be verified against Cashfree's real sandbox, not simulated safely offline.

## Idempotency & correctness
- `payment_events.provider_event_id` has a unique constraint — a retried webhook delivery is a
  safe no-op on the second attempt.
- The webhook re-derives what to unlock from `payments.purpose` / `payments.contact_request_id` —
  it never trusts anything from the original client request at confirmation time.
- Contact-access fee amounts are re-validated server-side in `cashfree-create-order` against the
  `contact_requests` row, not taken from the client payload.
