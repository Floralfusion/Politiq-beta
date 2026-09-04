-- POLITIQ database schema — Migration 8: jobs, groups, events

create table jobs (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisations(id) on delete set null,
  posted_by_profile_id uuid references profiles(id) on delete set null,
  title text not null,
  location text,
  type job_type not null default 'Full-time',
  category text,
  description text not null,
  is_approved boolean not null default false, -- admin moderation gate
  created_at timestamptz not null default now()
);
create index jobs_approved_idx on jobs (is_approved, created_at desc);

create table job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  applicant_profile_id uuid not null references profiles(id) on delete cascade,
  message text,
  created_at timestamptz not null default now(),
  unique (job_id, applicant_profile_id)
);

create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_url text,
  privacy group_privacy not null default 'PUBLIC',
  created_by_profile_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'MEMBER' check (role in ('MEMBER','MODERATOR')),
  joined_at timestamptz not null default now(),
  unique (group_id, profile_id)
);

create table group_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  author_profile_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  event_time text,
  location text,
  online_link text,
  organiser_profile_id uuid references profiles(id) on delete set null,
  organiser_org_id uuid references organisations(id) on delete set null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique (event_id, profile_id)
);
