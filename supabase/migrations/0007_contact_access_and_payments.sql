-- POLITIQ database schema — Migration 7: contact access & payments (Cashfree)

create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  requester_profile_id uuid not null references profiles(id) on delete cascade,
  recipient_profile_id uuid not null references profiles(id) on delete cascade,
  status contact_request_status not null default 'REQUESTED',
  message text,
  fee_in_paise int not null,
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  expires_at timestamptz,
  check (requester_profile_id <> recipient_profile_id)
);
create index contact_requests_recipient_idx on contact_requests (recipient_profile_id, status);
create index contact_requests_requester_idx on contact_requests (requester_profile_id, status);

-- The row that actually grants access — created ONLY after server-verified payment.
-- Never created directly by client code.
create table contact_access (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid not null unique references contact_requests(id) on delete cascade,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique, -- Cashfree order id
  profile_id uuid not null references profiles(id) on delete cascade,
  purpose payment_purpose not null,
  contact_request_id uuid references contact_requests(id),
  amount_in_paise int not null,
  status payment_status not null default 'PENDING',
  provider text not null default 'CASHFREE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_profile_idx on payments (profile_id);
create index payments_status_idx on payments (status);

-- Raw webhook events for audit/replay-protection (Cashfree may retry webhooks).
create table payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references payments(id) on delete set null,
  provider_event_id text unique, -- idempotency key from Cashfree's payload
  raw_payload jsonb not null,
  received_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  plan text not null default 'POLITIQ_VERIFIED',
  status subscription_status not null default 'ACTIVE',
  started_at timestamptz not null default now(),
  renews_at timestamptz not null,
  cancelled_at timestamptz,
  price_in_paise int not null,
  cashfree_subscription_id text
);
create index subscriptions_profile_idx on subscriptions (profile_id);

-- Configurable pricing (see requirement: pricing must never be hard-coded).
create table pricing_plans (
  id text primary key, -- e.g. 'politiq_verified_monthly'
  name text not null,
  price_in_paise int not null,
  billing_period text not null default 'month',
  benefits text[] not null default '{}',
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into pricing_plans (id, name, price_in_paise, billing_period, benefits) values (
  'politiq_verified_monthly',
  'POLITIQ Verified',
  99900,
  'month',
  array[
    'Verified badge on your profile',
    'Priority identity verification review',
    'Priority professional verification review',
    'Verified experience highlighting',
    'Higher visibility in Discover and search',
    'Access to premium profile insights'
  ]
);
