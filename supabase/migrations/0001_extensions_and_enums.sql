-- POLITIQ database schema — Migration 1: extensions & enums
-- Run in order against a Supabase Postgres project (supabase db push, or paste into SQL editor).

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm"; -- for fast ILIKE / trigram search on discovery

create type professional_category as enum (
  'Political Professional','Political Staff','Campaign Professional','Political Consultant',
  'Party Professional','Public Affairs','Policy Professional','Journalist','Researcher','Organisation'
);

create type verification_type as enum ('IDENTITY','PROFESSIONAL','ORGANISATION','EXPERIENCE');

create type verification_status as enum (
  'NOT_STARTED','DRAFT','SUBMITTED','UNDER_REVIEW','VERIFIED','REJECTED','NEEDS_MORE_INFORMATION','EXPIRED'
);

create type connection_request_status as enum ('PENDING','ACCEPTED','DECLINED','CANCELLED');

create type contact_request_status as enum (
  'REQUESTED','APPROVED','DECLINED','EXPIRED','CANCELLED','PAYMENT_PENDING','PAID','CONTACT_UNLOCKED'
);

create type payment_status as enum ('PENDING','SUCCESS','FAILED','REFUNDED');
create type payment_purpose as enum ('CONTACT_ACCESS','POLITIQ_VERIFIED_SUBSCRIPTION');

create type subscription_status as enum ('ACTIVE','CANCELLED','EXPIRED','PAST_DUE');

create type admin_role as enum ('SUPER_ADMIN','ADMIN','VERIFICATION_REVIEWER','MODERATOR','SUPPORT');

create type report_target_type as enum ('PROFILE','POST','COMMENT','MESSAGE','GROUP','JOB','EVENT');
create type report_status as enum ('OPEN','RESOLVED','DISMISSED');

create type group_privacy as enum ('PUBLIC','PRIVATE');
create type job_type as enum ('Full-time','Part-time','Contract','Volunteer');
