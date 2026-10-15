-- Run in Supabase SQL editor before enabling real account registration.
create table if not exists public.student_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 profile jsonb not null default '{}'::jsonb,
 saved jsonb not null default '[]'::jsonb,
 updated_at timestamptz not null default now(),
 constraint profile_object check (jsonb_typeof(profile)='object'),
 constraint saved_array check (jsonb_typeof(saved)='array'),
 constraint profile_size check (octet_length(profile::text)<10000),
 constraint saved_size check (octet_length(saved::text)<10000)
);
alter table public.student_profiles enable row level security;
revoke all on public.student_profiles from anon;
grant select,insert,update,delete on public.student_profiles to authenticated;
drop policy if exists "own profile select" on public.student_profiles;
create policy "own profile select" on public.student_profiles for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "own profile insert" on public.student_profiles;
create policy "own profile insert" on public.student_profiles for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists "own profile update" on public.student_profiles;
create policy "own profile update" on public.student_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "own profile delete" on public.student_profiles;
create policy "own profile delete" on public.student_profiles for delete to authenticated using ((select auth.uid())=user_id);
