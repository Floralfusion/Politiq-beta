-- POLITIQ database schema — Migration 2: core identity & profile tables

-- `users` mirrors Clerk's user id (auth.uid() equivalent). We store the Clerk user id as the
-- primary key so RLS policies can compare it directly against the JWT's `sub` claim once the
-- Clerk <-> Supabase JWT template is configured (see docs/security.md).
create table users (
  id text primary key, -- Clerk user id (e.g. "user_2abc...")
  email text unique,
  phone text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description text,
  category text,
  location text,
  website text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  role text,
  created_at timestamptz not null default now(),
  unique (organisation_id, user_id)
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references users(id) on delete cascade,
  username text not null unique,
  full_name text not null,
  headline text,
  category professional_category not null,
  organisation_id uuid references organisations(id) on delete set null,
  location text,
  avatar_url text,
  cover_url text,
  about text,
  years_experience int,
  nationality text,
  languages text[] default '{}',
  is_verified boolean not null default false,
  connections_count int not null default 0,
  followers_count int not null default 0,
  following_count int not null default 0,
  onboarding_complete boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_search_idx on profiles using gin (
  (full_name || ' ' || coalesce(headline,'') || ' ' || coalesce(location,'')) gin_trgm_ops
);
create index profiles_category_idx on profiles (category);
create index profiles_location_idx on profiles (location);

create table profile_experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  organisation text not null,
  role text not null,
  start_date date not null,
  end_date date,
  location text,
  description text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
create index profile_experiences_profile_idx on profile_experiences (profile_id);

create table profile_education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  institution text not null,
  degree text not null,
  field text,
  start_year int not null,
  end_year int,
  created_at timestamptz not null default now()
);
create index profile_education_profile_idx on profile_education (profile_id);

create table profile_expertise (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  unique (profile_id, label)
);

create table profile_achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  achieved_at date,
  created_at timestamptz not null default now()
);
