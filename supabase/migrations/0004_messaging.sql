-- POLITIQ database schema — Migration 4: messaging (requires an active connection)

create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  last_read_at timestamptz,
  unique (conversation_id, profile_id)
);
create index conversation_members_profile_idx on conversation_members (profile_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_profile_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on messages (conversation_id, created_at);

create table blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_profile_id uuid not null references profiles(id) on delete cascade,
  blocked_profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_profile_id, blocked_profile_id)
);

-- Enable Realtime on messages for live chat updates.
alter publication supabase_realtime add table messages;
