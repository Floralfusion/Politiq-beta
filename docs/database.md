# Database

Schema lives in `supabase/migrations/*.sql`, applied in numeric order:

| File | Contents |
|---|---|
| 0001 | Extensions (`pgcrypto`, `pg_trgm`) and enums |
| 0002 | `users`, `organisations`, `organisation_members`, `profiles`, experience/education/expertise/achievements |
| 0003 | `follows`, `connection_requests`, `connections`, `posts`, `post_media`, `comments`, `reactions`, `saved_posts` |
| 0004 | `conversations`, `conversation_members`, `messages`, `blocked_users` (+ Realtime on `messages`) |
| 0005 | `admin_users`, RBAC + `is_admin()` helper function |
| 0006 | `verification_requests`, `verification_documents`, `verification_reviews`, `verification_events` |
| 0007 | `contact_requests`, `contact_access`, `payments`, `payment_events`, `subscriptions`, `pricing_plans` |
| 0008 | `jobs`, `job_applications`, `groups`, `group_members`, `group_posts`, `events`, `event_attendees` |
| 0009 | `notification_preferences`, `notifications`, `reports`, `moderation_actions`, `audit_logs`, `system_settings` |
| 0010 | Row Level Security — enabled + policies on every table above |
| 0011 | Storage buckets + storage policies |

## Applying migrations
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```
Or paste each file into the Supabase Dashboard's SQL editor, in order.

## Seeding
```bash
psql "$DATABASE_URL" -f supabase/seed/seed.sql
```
Only run against a dev/staging project. All seeded identities are fictional.

## Conventions
- UUID primary keys (`gen_random_uuid()`) except `users.id`, which stores the Clerk user id directly.
- Every table has `created_at`; mutable tables have `updated_at`.
- Soft deletion via nullable `deleted_at` on `profiles`, `posts`, and `comments` (never hard-deleted, to preserve referential integrity for audit/moderation history).
- Money is always stored as integer paise (`amount_in_paise`, `price_in_paise`, `fee_in_paise`) — never floats.
