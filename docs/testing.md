# Testing

## What was actually run in this delivery
| Suite | Command | Result |
|---|---|---|
| TypeScript strict typecheck | `npm run typecheck` | ✅ PASS — 0 errors |
| ESLint | `npm run lint` | ✅ PASS — 0 errors, 0 warnings |
| Unit tests (Vitest) | `npm test` | ✅ PASS — 12/12 tests |
| Production build | `npm run build` | ✅ PASS — builds to `dist/`, no warnings |
| Local smoke check | `vite preview` + `curl` | ✅ PASS — landing page served with HTTP 200 and correct `<title>` |
| Playwright E2E | `npx playwright test` | ⚠️ NOT RUN — see limitation below |
| Supabase migrations | — | ⚠️ NOT RUN against a live database — see limitation below |
| RLS policy tests | — | ⚠️ NOT RUN against a live database — see limitation below |

## Known limitation: Playwright browser binaries
This delivery was built in a sandboxed environment whose network egress is restricted to a fixed
allowlist of package registries (npm, PyPI, crates.io, GitHub, etc). Playwright's browser binaries
are downloaded from a CDN outside that allowlist, so `npx playwright install` fails here. The
E2E spec files in `tests/e2e/` are real, complete, and cover the flows below — run them yourself
after `npm install && npx playwright install && npx playwright test` in an unrestricted
environment (or in CI) to get an actual pass/fail result.

## Known limitation: no live Supabase project
The migrations in `supabase/migrations/` were written against the actual Postgres/Supabase
dialect and reviewed carefully, but were not executed against a running Postgres instance in this
environment (no Supabase project was provisioned here). Run `supabase db push` against your own
project and then work through `docs/security.md`'s RLS test checklist (section 52 of the original
spec) before trusting them in production — in particular:
- User A cannot read User B's private contact information
- User A cannot read User B's verification documents
- User A cannot read User B's private messages
- A non-admin cannot read `admin_users` / `audit_logs`
- A `MODERATOR` cannot perform `SUPER_ADMIN`-only actions

## E2E flows covered by the Playwright specs (tests/e2e/)
- `auth-and-onboarding.spec.ts` — Signup → OTP → Onboarding → Home (Flow 1)
- `discover-and-connect.spec.ts` — Discover → Search → View profile (Flow 2)
- `contact-and-payment.spec.ts` — Pay to unlock an approved contact request (Flow 4, demo payment adapter)
- `pricing.spec.ts` — POLITIQ Verified pricing page renders the configured price
- `responsive.spec.ts` — no horizontal overflow at 375px; sidebar renders at 1440px

## Unit tests (tests/unit/, all passing)
- `utils.test.ts` — currency formatting, initials, relative time, class merging
- `paymentService.test.ts` — demo order creation records a payment; unknown orders report PENDING, never a false SUCCESS
- `demoStore.test.ts` — connection requests, contact requests, and verification submissions never skip intermediate states
