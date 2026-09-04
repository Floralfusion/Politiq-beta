-- POLITIQ database schema — Migration 11: Storage buckets & policies
-- Run this after the buckets exist. Buckets themselves are typically created via the Supabase
-- Dashboard (Storage > New bucket) or the CLI; the INSERTs below create them idempotently via SQL.

insert into storage.buckets (id, name, public)
values
  ('profile-assets', 'profile-assets', true),
  ('post-media', 'post-media', true),
  ('organisation-assets', 'organisation-assets', true),
  ('event-assets', 'event-assets', true),
  ('verification-documents', 'verification-documents', false) -- PRIVATE — never public
on conflict (id) do nothing;

-- Public buckets: anyone can read; only the owning profile can write to their own folder
-- (convention: {profile_id}/{filename}).
create policy "Public read profile-assets" on storage.objects for select using (bucket_id = 'profile-assets');
create policy "Owner write profile-assets" on storage.objects for insert
  with check (bucket_id = 'profile-assets' and (storage.foldername(name))[1] = current_profile_id()::text);
create policy "Owner update profile-assets" on storage.objects for update
  using (bucket_id = 'profile-assets' and (storage.foldername(name))[1] = current_profile_id()::text);

create policy "Public read post-media" on storage.objects for select using (bucket_id = 'post-media');
create policy "Owner write post-media" on storage.objects for insert
  with check (bucket_id = 'post-media' and (storage.foldername(name))[1] = current_profile_id()::text);

create policy "Public read organisation-assets" on storage.objects for select using (bucket_id = 'organisation-assets');
create policy "Admin write organisation-assets" on storage.objects for insert with check (bucket_id = 'organisation-assets' and is_admin('ADMIN'));

create policy "Public read event-assets" on storage.objects for select using (bucket_id = 'event-assets');
create policy "Owner write event-assets" on storage.objects for insert
  with check (bucket_id = 'event-assets' and (storage.foldername(name))[1] = current_profile_id()::text);

-- verification-documents: PRIVATE. Only the owning profile can upload; only the owner or a
-- verification reviewer can read — and reads should go through short-lived signed URLs
-- generated server-side (see services/verificationService.ts), never a public URL.
create policy "Owner write verification-documents" on storage.objects for insert
  with check (bucket_id = 'verification-documents' and (storage.foldername(name))[1] = current_profile_id()::text);
create policy "Owner or reviewer read verification-documents" on storage.objects for select
  using (
    bucket_id = 'verification-documents'
    and ((storage.foldername(name))[1] = current_profile_id()::text or is_admin('VERIFICATION_REVIEWER'))
  );
