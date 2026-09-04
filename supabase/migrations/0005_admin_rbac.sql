-- POLITIQ database schema — Migration 5: admin users & RBAC
-- Admin authorization is enforced here (server-side) — never solely in the frontend.

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references users(id) on delete cascade,
  name text not null,
  email text not null,
  role admin_role not null,
  created_at timestamptz not null default now()
);

-- Helper used throughout RLS policies to check "is the current JWT subject an admin,
-- and if a minimum role is required, do they hold it (or a higher role)?"
create or replace function is_admin(min_role admin_role default 'SUPPORT')
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_users au
    where au.user_id = auth.jwt() ->> 'sub'
      and (
        min_role = 'SUPPORT'
        or (min_role = 'MODERATOR' and au.role in ('MODERATOR','VERIFICATION_REVIEWER','ADMIN','SUPER_ADMIN'))
        or (min_role = 'VERIFICATION_REVIEWER' and au.role in ('VERIFICATION_REVIEWER','ADMIN','SUPER_ADMIN'))
        or (min_role = 'ADMIN' and au.role in ('ADMIN','SUPER_ADMIN'))
        or (min_role = 'SUPER_ADMIN' and au.role = 'SUPER_ADMIN')
      )
  );
$$;
