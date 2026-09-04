-- POLITIQ database schema — Migration 3: follows, connections, posts, comments, reactions

create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_profile_id uuid not null references profiles(id) on delete cascade,
  following_profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_profile_id, following_profile_id),
  check (follower_profile_id <> following_profile_id)
);
create index follows_follower_idx on follows (follower_profile_id);
create index follows_following_idx on follows (following_profile_id);

create table connection_requests (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references profiles(id) on delete cascade,
  to_profile_id uuid not null references profiles(id) on delete cascade,
  status connection_request_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (from_profile_id <> to_profile_id)
);
create index connection_requests_to_idx on connection_requests (to_profile_id, status);
create index connection_requests_from_idx on connection_requests (from_profile_id, status);

create table connections (
  id uuid primary key default gen_random_uuid(),
  profile_id_a uuid not null references profiles(id) on delete cascade,
  profile_id_b uuid not null references profiles(id) on delete cascade,
  connected_at timestamptz not null default now(),
  unique (profile_id_a, profile_id_b),
  check (profile_id_a < profile_id_b) -- canonical ordering avoids duplicate pairs
);
create index connections_a_idx on connections (profile_id_a);
create index connections_b_idx on connections (profile_id_b);

create table posts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_author_idx on posts (author_profile_id, created_at desc);

create table post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image','video')),
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_profile_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index comments_post_idx on comments (post_id, created_at);

create table reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  type text not null default 'LIKE',
  created_at timestamptz not null default now(),
  unique (post_id, profile_id)
);

create table saved_posts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, profile_id)
);
