-- POLITIQ database schema — Migration 9: notifications, reports, moderation, audit, settings

create table notification_preferences (
  profile_id uuid primary key references profiles(id) on delete cascade,
  connection_requests boolean not null default true,
  messages boolean not null default true,
  contact_requests boolean not null default true,
  verification_updates boolean not null default true,
  job_matches boolean not null default true,
  event_reminders boolean not null default true
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  actor_profile_id uuid references profiles(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_profile_idx on notifications (profile_id, created_at desc);
alter publication supabase_realtime add table notifications;

create table reports (
  id uuid primary key default gen_random_uuid(),
  target_type report_target_type not null,
  target_id uuid not null,
  target_label text not null,
  reporter_profile_id uuid not null references profiles(id) on delete cascade,
  category text not null,
  details text,
  status report_status not null default 'OPEN',
  created_at timestamptz not null default now()
);
create index reports_status_idx on reports (status);

create table moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete set null,
  admin_id uuid not null references admin_users(id),
  action text not null, -- e.g. RESOLVED, DISMISSED, SUSPENDED, BANNED, REMOVED_CONTENT
  target_label text not null,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admin_users(id),
  action text not null,
  target_label text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index audit_logs_created_idx on audit_logs (created_at desc);

create table system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
