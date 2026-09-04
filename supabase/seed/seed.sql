-- POLITIQ development seed data — FICTIONAL identities only, never real people.
-- Run against a fresh dev/staging Supabase project only:
--   psql "$DATABASE_URL" -f supabase/seed/seed.sql
-- Do NOT run against production.

-- Note: `users.id` values below are placeholders. In a real flow, rows in `users` are created by
-- the Clerk webhook (see docs/deployment.md) when someone signs up. For local seeding without
-- live Clerk, insert directly as shown here so the rest of the seed data has valid foreign keys.

insert into users (id, email) values
  ('seed_user_01', 'arjun.sharma@example-politiq.dev'),
  ('seed_user_02', 'meera.iyer@example-politiq.dev'),
  ('seed_user_03', 'rohit.verma@example-politiq.dev'),
  ('seed_user_04', 'neha.kapoor@example-politiq.dev'),
  ('seed_user_05', 'siddharth.rao@example-politiq.dev')
on conflict do nothing;

insert into organisations (id, name, description, category, location, is_verified) values
  ('a0000000-0000-0000-0000-000000000001', 'Bharat Vikas Party', 'National political party focused on inclusive development and public policy reform.', 'Political Party', 'New Delhi, India', true),
  ('a0000000-0000-0000-0000-000000000002', 'Jan Shakti Party', 'Regional political party working on grassroots mobilisation.', 'Political Party', 'Bengaluru, India', true),
  ('a0000000-0000-0000-0000-000000000003', 'Lokniti Research Foundation', 'Independent research foundation studying political communication.', 'Think Tank', 'New Delhi, India', true)
on conflict do nothing;

insert into profiles (id, user_id, username, full_name, headline, category, organisation_id, location, is_verified, years_experience, nationality, languages, onboarding_complete) values
  ('b0000000-0000-0000-0000-000000000001', 'seed_user_01', 'arjun-sharma', 'Arjun Sharma', 'Political Strategist & Campaign Advisor', 'Political Consultant', 'a0000000-0000-0000-0000-000000000001', 'New Delhi, India', true, 10, 'Indian', array['English','Hindi'], true),
  ('b0000000-0000-0000-0000-000000000002', 'seed_user_02', 'meera-iyer', 'Meera Iyer', 'Policy Analyst', 'Policy Professional', null, 'Mumbai, India', true, 6, 'Indian', array['English','Hindi'], true),
  ('b0000000-0000-0000-0000-000000000003', 'seed_user_03', 'rohit-verma', 'Rohit Verma', 'Political Consultant', 'Political Consultant', null, 'Bengaluru, India', false, 8, 'Indian', array['English'], true),
  ('b0000000-0000-0000-0000-000000000004', 'seed_user_04', 'neha-kapoor', 'Neha Kapoor', 'Media Professional', 'Journalist', null, 'New Delhi, India', true, 7, 'Indian', array['English','Hindi'], true),
  ('b0000000-0000-0000-0000-000000000005', 'seed_user_05', 'siddharth-rao', 'Siddharth Rao', 'Researcher, Public Opinion', 'Researcher', 'a0000000-0000-0000-0000-000000000003', 'Chennai, India', true, 5, 'Indian', array['English','Tamil'], true)
on conflict do nothing;

insert into verification_requests (profile_id, type, status) values
  ('b0000000-0000-0000-0000-000000000001', 'IDENTITY', 'VERIFIED'),
  ('b0000000-0000-0000-0000-000000000001', 'PROFESSIONAL', 'VERIFIED'),
  ('b0000000-0000-0000-0000-000000000001', 'EXPERIENCE', 'VERIFIED'),
  ('b0000000-0000-0000-0000-000000000001', 'ORGANISATION', 'NOT_STARTED')
on conflict do nothing;

insert into posts (author_profile_id, content) values
  ('b0000000-0000-0000-0000-000000000002', 'Interesting discussion at the roundtable on youth participation in politics.'),
  ('b0000000-0000-0000-0000-000000000003', 'Honoured to have contributed to the campaign strategy workshop in Bengaluru.')
on conflict do nothing;

insert into jobs (organisation_id, posted_by_profile_id, title, location, type, category, description, is_approved) values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Campaign Field Coordinator', 'New Delhi, India', 'Full-time', 'Campaign', 'Coordinate ground operations for constituency-level campaigns.', true)
on conflict do nothing;

insert into groups (name, description, privacy, created_by_profile_id) values
  ('Political Communication Professionals', 'A community for practitioners working in political communication.', 'PUBLIC', 'b0000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into events (title, description, event_date, event_time, location, organiser_profile_id, is_approved) values
  ('Public Policy Forum 2026', 'Annual forum on emerging governance challenges.', '2026-09-24', '10:00 AM', 'New Delhi, India', 'b0000000-0000-0000-0000-000000000003', true)
on conflict do nothing;
