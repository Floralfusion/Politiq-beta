# Admin Console

Accessible at `/admin` (guarded client-side by `AdminRoute` — see `docs/security.md` for the
server-side enforcement that actually matters). Sections: Dashboard, Users, Verification queue +
review, Organisations, Posts, Reports, Contact requests, Payments, Subscriptions, Jobs, Groups,
Events, Notifications, Audit logs, Settings.

## Roles (RBAC)
`SUPER_ADMIN > ADMIN > VERIFICATION_REVIEWER / MODERATOR / SUPPORT` — enforced via the `is_admin()`
Postgres function used throughout RLS policies (`supabase/migrations/0005_admin_rbac.sql`).

## Pricing configuration
`/admin/settings` edits the `pricing_plans` table (demo: the `pricingPlans` slice of the local
store) — the public `/pricing` page always reads from here, never a hard-coded value, satisfying
the "pricing must be configurable" requirement.

## Demo vs. live data
The dashboard visibly labels demo metrics ("Development seed data") rather than presenting them as
real production numbers, per the no-fake-metrics requirement.
