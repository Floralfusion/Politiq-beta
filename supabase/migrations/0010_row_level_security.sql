-- POLITIQ database schema — Migration 10: Row Level Security
-- Every table with user-controlled or private data has RLS enabled. Policies assume Clerk is
-- configured as a third-party JWT issuer in Supabase Auth settings, so auth.jwt() ->> 'sub'
-- carries the Clerk user id (see docs/security.md for the exact Clerk <-> Supabase wiring steps).

-- Helper: resolve the caller's profile id from their Clerk user id.
create or replace function current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id from profiles p where p.user_id = auth.jwt() ->> 'sub';
$$;

-- ── users ────────────────────────────────────────────────────────────────
alter table users enable row level security;
create policy users_select_own on users for select using (id = auth.jwt() ->> 'sub' or is_admin());
create policy users_update_own on users for update using (id = auth.jwt() ->> 'sub');

-- ── profiles (public directory — Discover requires public read of non-deleted profiles) ────
alter table profiles enable row level security;
create policy profiles_select_public on profiles for select using (deleted_at is null or user_id = auth.jwt() ->> 'sub' or is_admin());
create policy profiles_insert_own on profiles for insert with check (user_id = auth.jwt() ->> 'sub');
create policy profiles_update_own on profiles for update using (user_id = auth.jwt() ->> 'sub' or is_admin());

alter table profile_experiences enable row level security;
create policy profile_experiences_select_public on profile_experiences for select using (true);
create policy profile_experiences_write_own on profile_experiences for all
  using (profile_id = current_profile_id() or is_admin())
  with check (profile_id = current_profile_id());

alter table profile_education enable row level security;
create policy profile_education_select_public on profile_education for select using (true);
create policy profile_education_write_own on profile_education for all
  using (profile_id = current_profile_id() or is_admin())
  with check (profile_id = current_profile_id());

alter table profile_expertise enable row level security;
create policy profile_expertise_select_public on profile_expertise for select using (true);
create policy profile_expertise_write_own on profile_expertise for all
  using (profile_id = current_profile_id() or is_admin())
  with check (profile_id = current_profile_id());

alter table profile_achievements enable row level security;
create policy profile_achievements_select_public on profile_achievements for select using (true);
create policy profile_achievements_write_own on profile_achievements for all
  using (profile_id = current_profile_id() or is_admin())
  with check (profile_id = current_profile_id());

-- ── organisations ────────────────────────────────────────────────────────
alter table organisations enable row level security;
create policy organisations_select_public on organisations for select using (true);
create policy organisations_write_admin on organisations for all using (is_admin('ADMIN')) with check (is_admin('ADMIN'));

alter table organisation_members enable row level security;
create policy organisation_members_select_public on organisation_members for select using (true);
create policy organisation_members_write_admin on organisation_members for all using (is_admin('ADMIN')) with check (is_admin('ADMIN'));

-- ── follows ──────────────────────────────────────────────────────────────
alter table follows enable row level security;
create policy follows_select_public on follows for select using (true);
create policy follows_insert_own on follows for insert with check (follower_profile_id = current_profile_id());
create policy follows_delete_own on follows for delete using (follower_profile_id = current_profile_id());

-- ── connection_requests / connections ───────────────────────────────────
alter table connection_requests enable row level security;
create policy connection_requests_select_participant on connection_requests for select
  using (from_profile_id = current_profile_id() or to_profile_id = current_profile_id() or is_admin());
create policy connection_requests_insert_own on connection_requests for insert
  with check (from_profile_id = current_profile_id());
create policy connection_requests_update_participant on connection_requests for update
  using (to_profile_id = current_profile_id() or from_profile_id = current_profile_id());

alter table connections enable row level security;
create policy connections_select_participant on connections for select
  using (profile_id_a = current_profile_id() or profile_id_b = current_profile_id() or is_admin());
-- Inserts happen only via accept_connection_request() (security definer), never directly by clients.

create or replace function accept_connection_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  req connection_requests%rowtype;
  a uuid; b uuid;
begin
  select * into req from connection_requests where id = request_id;
  if req.to_profile_id <> current_profile_id() then
    raise exception 'Not authorized to accept this request';
  end if;
  update connection_requests set status = 'ACCEPTED', responded_at = now() where id = request_id;
  a := least(req.from_profile_id, req.to_profile_id);
  b := greatest(req.from_profile_id, req.to_profile_id);
  insert into connections (profile_id_a, profile_id_b) values (a, b) on conflict do nothing;
  update profiles set connections_count = connections_count + 1 where id in (req.from_profile_id, req.to_profile_id);
end;
$$;

-- ── posts / comments / reactions / saved_posts ──────────────────────────
alter table posts enable row level security;
create policy posts_select_public on posts for select using (deleted_at is null or is_admin());
create policy posts_insert_own on posts for insert with check (author_profile_id = current_profile_id());
create policy posts_update_own on posts for update using (author_profile_id = current_profile_id() or is_admin());

alter table post_media enable row level security;
create policy post_media_select_public on post_media for select using (true);
create policy post_media_write_owner on post_media for all
  using (exists (select 1 from posts p where p.id = post_id and p.author_profile_id = current_profile_id()))
  with check (exists (select 1 from posts p where p.id = post_id and p.author_profile_id = current_profile_id()));

alter table comments enable row level security;
create policy comments_select_public on comments for select using (deleted_at is null or is_admin());
create policy comments_insert_own on comments for insert with check (author_profile_id = current_profile_id());
create policy comments_update_own on comments for update using (author_profile_id = current_profile_id() or is_admin());

alter table reactions enable row level security;
create policy reactions_select_public on reactions for select using (true);
create policy reactions_write_own on reactions for all
  using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

alter table saved_posts enable row level security;
create policy saved_posts_select_own on saved_posts for select using (profile_id = current_profile_id());
create policy saved_posts_write_own on saved_posts for all
  using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

-- ── messaging (only conversation members may read) ──────────────────────
alter table conversations enable row level security;
create policy conversations_select_member on conversations for select
  using (exists (select 1 from conversation_members cm where cm.conversation_id = id and cm.profile_id = current_profile_id()));

alter table conversation_members enable row level security;
create policy conversation_members_select_self on conversation_members for select
  using (profile_id = current_profile_id() or exists (
    select 1 from conversation_members cm2 where cm2.conversation_id = conversation_id and cm2.profile_id = current_profile_id()
  ));

alter table messages enable row level security;
create policy messages_select_member on messages for select
  using (exists (select 1 from conversation_members cm where cm.conversation_id = conversation_id and cm.profile_id = current_profile_id()));
create policy messages_insert_member on messages for insert
  with check (
    sender_profile_id = current_profile_id()
    and exists (select 1 from conversation_members cm where cm.conversation_id = conversation_id and cm.profile_id = current_profile_id())
  );

alter table blocked_users enable row level security;
create policy blocked_users_select_own on blocked_users for select using (blocker_profile_id = current_profile_id());
create policy blocked_users_write_own on blocked_users for all
  using (blocker_profile_id = current_profile_id())
  with check (blocker_profile_id = current_profile_id());

-- ── verification (documents are strictly private) ───────────────────────
alter table verification_requests enable row level security;
create policy verification_requests_select_own_or_reviewer on verification_requests for select
  using (profile_id = current_profile_id() or is_admin('VERIFICATION_REVIEWER'));
create policy verification_requests_insert_own on verification_requests for insert
  with check (profile_id = current_profile_id());
create policy verification_requests_update_own_or_reviewer on verification_requests for update
  using (profile_id = current_profile_id() or is_admin('VERIFICATION_REVIEWER'));

alter table verification_documents enable row level security;
create policy verification_documents_select_own_or_reviewer on verification_documents for select
  using (
    exists (select 1 from verification_requests vr where vr.id = verification_request_id and vr.profile_id = current_profile_id())
    or is_admin('VERIFICATION_REVIEWER')
  );
create policy verification_documents_insert_own on verification_documents for insert
  with check (exists (select 1 from verification_requests vr where vr.id = verification_request_id and vr.profile_id = current_profile_id()));

alter table verification_reviews enable row level security;
create policy verification_reviews_select_reviewer on verification_reviews for select using (is_admin('VERIFICATION_REVIEWER'));
create policy verification_reviews_insert_reviewer on verification_reviews for insert with check (is_admin('VERIFICATION_REVIEWER'));

alter table verification_events enable row level security;
create policy verification_events_select on verification_events for select
  using (
    exists (select 1 from verification_requests vr where vr.id = verification_request_id and vr.profile_id = current_profile_id())
    or is_admin('VERIFICATION_REVIEWER')
  );

-- ── contact access & payments ────────────────────────────────────────────
alter table contact_requests enable row level security;
create policy contact_requests_select_participant on contact_requests for select
  using (requester_profile_id = current_profile_id() or recipient_profile_id = current_profile_id() or is_admin());
create policy contact_requests_insert_own on contact_requests for insert
  with check (requester_profile_id = current_profile_id());
create policy contact_requests_update_recipient on contact_requests for update
  using (recipient_profile_id = current_profile_id() or requester_profile_id = current_profile_id() or is_admin());

alter table contact_access enable row level security;
create policy contact_access_select_participant on contact_access for select
  using (
    exists (
      select 1 from contact_requests cr
      where cr.id = contact_request_id
        and (cr.requester_profile_id = current_profile_id() or cr.recipient_profile_id = current_profile_id())
    ) or is_admin()
  );
-- No client insert/update policy: rows are created exclusively by the cashfree-webhook Edge
-- Function using the service role key, only after signature verification + payment success.

alter table payments enable row level security;
create policy payments_select_own_or_admin on payments for select using (profile_id = current_profile_id() or is_admin());
-- No client insert policy — payments are created by the cashfree-create-order Edge Function.

alter table payment_events enable row level security;
create policy payment_events_select_admin on payment_events for select using (is_admin());

alter table subscriptions enable row level security;
create policy subscriptions_select_own_or_admin on subscriptions for select using (profile_id = current_profile_id() or is_admin());

alter table pricing_plans enable row level security;
create policy pricing_plans_select_public on pricing_plans for select using (true);
create policy pricing_plans_write_admin on pricing_plans for all using (is_admin('ADMIN')) with check (is_admin('ADMIN'));

-- ── jobs / groups / events ───────────────────────────────────────────────
alter table jobs enable row level security;
create policy jobs_select_approved_or_admin on jobs for select using (is_approved or posted_by_profile_id = current_profile_id() or is_admin());
create policy jobs_insert_own on jobs for insert with check (posted_by_profile_id = current_profile_id());
create policy jobs_update_own_or_admin on jobs for update using (posted_by_profile_id = current_profile_id() or is_admin());

alter table job_applications enable row level security;
create policy job_applications_select_participant on job_applications for select
  using (
    applicant_profile_id = current_profile_id()
    or exists (select 1 from jobs j where j.id = job_id and j.posted_by_profile_id = current_profile_id())
    or is_admin()
  );
create policy job_applications_insert_own on job_applications for insert with check (applicant_profile_id = current_profile_id());

alter table groups enable row level security;
create policy groups_select_public_or_member on groups for select
  using (
    privacy = 'PUBLIC' or is_admin()
    or exists (select 1 from group_members gm where gm.group_id = id and gm.profile_id = current_profile_id())
  );
create policy groups_insert_own on groups for insert with check (created_by_profile_id = current_profile_id());
create policy groups_update_moderator_or_admin on groups for update
  using (is_admin() or exists (select 1 from group_members gm where gm.group_id = id and gm.profile_id = current_profile_id() and gm.role = 'MODERATOR'));

alter table group_members enable row level security;
create policy group_members_select_public_or_member on group_members for select
  using (
    exists (select 1 from groups g where g.id = group_id and g.privacy = 'PUBLIC')
    or profile_id = current_profile_id()
    or is_admin()
  );
create policy group_members_insert_public_join on group_members for insert
  with check (
    profile_id = current_profile_id()
    and exists (select 1 from groups g where g.id = group_id and g.privacy = 'PUBLIC')
  );
create policy group_members_delete_own on group_members for delete using (profile_id = current_profile_id());

alter table group_posts enable row level security;
create policy group_posts_select_member on group_posts for select
  using (exists (select 1 from group_members gm where gm.group_id = group_id and gm.profile_id = current_profile_id()) or is_admin());
create policy group_posts_insert_member on group_posts for insert
  with check (
    author_profile_id = current_profile_id()
    and exists (select 1 from group_members gm where gm.group_id = group_id and gm.profile_id = current_profile_id())
  );

alter table events enable row level security;
create policy events_select_approved_or_admin on events for select using (is_approved or organiser_profile_id = current_profile_id() or is_admin());
create policy events_insert_own on events for insert with check (organiser_profile_id = current_profile_id());
create policy events_update_own_or_admin on events for update using (organiser_profile_id = current_profile_id() or is_admin());

alter table event_attendees enable row level security;
create policy event_attendees_select_public on event_attendees for select using (true);
create policy event_attendees_write_own on event_attendees for all
  using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

-- ── notifications ────────────────────────────────────────────────────────
alter table notification_preferences enable row level security;
create policy notification_preferences_owner on notification_preferences for all
  using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

alter table notifications enable row level security;
create policy notifications_select_own on notifications for select using (profile_id = current_profile_id());
create policy notifications_update_own on notifications for update using (profile_id = current_profile_id());

-- ── reports / moderation / audit ────────────────────────────────────────
alter table reports enable row level security;
create policy reports_select_own_or_moderator on reports for select using (reporter_profile_id = current_profile_id() or is_admin('MODERATOR'));
create policy reports_insert_own on reports for insert with check (reporter_profile_id = current_profile_id());
create policy reports_update_moderator on reports for update using (is_admin('MODERATOR'));

alter table moderation_actions enable row level security;
create policy moderation_actions_select_moderator on moderation_actions for select using (is_admin('MODERATOR'));
create policy moderation_actions_insert_moderator on moderation_actions for insert with check (is_admin('MODERATOR'));

alter table audit_logs enable row level security;
create policy audit_logs_select_admin on audit_logs for select using (is_admin());
create policy audit_logs_insert_admin on audit_logs for insert with check (is_admin());

-- ── admin_users / system_settings ───────────────────────────────────────
alter table admin_users enable row level security;
create policy admin_users_select_self_or_super on admin_users for select using (user_id = auth.jwt() ->> 'sub' or is_admin('SUPER_ADMIN'));
create policy admin_users_write_super on admin_users for all using (is_admin('SUPER_ADMIN')) with check (is_admin('SUPER_ADMIN'));

alter table system_settings enable row level security;
create policy system_settings_select_admin on system_settings for select using (is_admin());
create policy system_settings_write_admin on system_settings for all using (is_admin('ADMIN')) with check (is_admin('ADMIN'));
