-- POLITIQ database schema — Migration 5: verification workflow

create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type verification_type not null,
  status verification_status not null default 'NOT_STARTED',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, type)
);
create index verification_requests_status_idx on verification_requests (status);

-- Documents reference private Storage objects only — never a public URL.
-- bucket: verification-documents (private). Path convention: {profile_id}/{verification_request_id}/{filename}
create table verification_documents (
  id uuid primary key default gen_random_uuid(),
  verification_request_id uuid not null references verification_requests(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  uploaded_at timestamptz not null default now()
);

create table verification_reviews (
  id uuid primary key default gen_random_uuid(),
  verification_request_id uuid not null references verification_requests(id) on delete cascade,
  reviewer_admin_id uuid not null references admin_users(id),
  decision verification_status not null,
  notes text,
  created_at timestamptz not null default now()
);

create table verification_events (
  id uuid primary key default gen_random_uuid(),
  verification_request_id uuid not null references verification_requests(id) on delete cascade,
  event_type text not null, -- e.g. SUBMITTED, REVIEW_STARTED, APPROVED, REJECTED, EXPIRED
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
