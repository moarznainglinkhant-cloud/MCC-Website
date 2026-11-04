-- MCC members, step 1: separate execs from (future) member accounts.
-- Paste this whole file into Supabase -> SQL Editor -> New query -> Run. Safe to run again.
--
-- Before this, every exec table said "any signed-in user may read/write". That was fine
-- while only execs had accounts. Members are about to get accounts, so from now on:
--   * profiles.is_exec marks who is an exec. Only you can change it (Table Editor).
--   * public.is_exec() answers "is the signed-in person an exec?"
--   * every exec access rule now also requires is_exec().
--
-- ADDING A NEW EXEC FROM NOW ON: add the user in Authentication as before, then in
-- Table Editor -> profiles, tick is_exec on their row. Until you do, they can sign in
-- but see nothing in the exec portal.
--
-- If you ever re-run one of the older exec-*.sql files, run this file again afterwards
-- (the old files recreate the open rules).

-- ---------- 1. The exec flag ----------
alter table public.profiles add column if not exists is_exec boolean not null default false;

-- First run only: everyone who already has a profile is an exec today.
do $$
begin
  if not exists (select 1 from public.profiles where is_exec) then
    update public.profiles set is_exec = true;
  end if;
end $$;

-- ---------- 2. "Is the signed-in person an exec?" ----------
create or replace function public.is_exec()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select p.is_exec from public.profiles p where p.id = (select auth.uid())), false);
$$;
revoke execute on function public.is_exec() from public, anon;
grant execute on function public.is_exec() to authenticated;

-- ---------- 3. Profiles: execs see the exec team; anyone sees only their own row ----------
drop policy if exists "execs read all profiles" on public.profiles;
drop policy if exists "execs read exec profiles" on public.profiles;
create policy "execs read exec profiles"
  on public.profiles for select
  to authenticated
  using (is_exec and public.is_exec());

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- ---------- 4. Every other exec rule now also requires is_exec() ----------
-- Walks every signed-in-user rule in the public schema (except profiles and the member
-- tables coming in step 2) and adds "and public.is_exec()". Already-locked rules are skipped.
do $$
declare
  r record;
  clause text;
begin
  for r in
    select * from pg_policies
    where schemaname = 'public'
      and 'authenticated'::name = any (roles)
      and tablename not in ('profiles', 'members', 'event_registrations')
  loop
    if coalesce(r.qual, '') ilike '%is_exec%' or coalesce(r.with_check, '') ilike '%is_exec%' then
      continue;
    end if;
    clause := '';
    if r.qual is not null then
      clause := clause || format(' using ((%s) and public.is_exec())', r.qual);
    end if;
    if r.with_check is not null then
      clause := clause || format(' with check ((%s) and public.is_exec())', r.with_check);
    end if;
    if clause <> '' then
      execute format('alter policy %I on public.%I', r.policyname, r.tablename) || clause;
    end if;
  end loop;
end $$;

-- ---------- 5. Activity tracking: execs only ----------
create or replace function public.track_activity(p_session uuid, p_signin boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or p_session is null or not public.is_exec() then return; end if;
  insert into public.activity_sessions (id, user_id, via_signin)
  values (p_session, auth.uid(), coalesce(p_signin, false))
  on conflict (id) do update set last_seen_at = now()
    where public.activity_sessions.user_id = auth.uid();
end;
$$;
revoke execute on function public.track_activity(uuid, boolean) from public, anon;
grant execute on function public.track_activity(uuid, boolean) to authenticated;

-- ---------- 6. New accounts are never execs automatically ----------
-- Website sign-ups (step 2) will send account = 'member' and get a members row instead
-- of a profile. Anything else (e.g. you adding a user in the dashboard) still gets a
-- profile, but with is_exec = false until you tick it.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'account', '') = 'member' then
    return new;
  end if;
  insert into public.profiles (id, display_name, is_exec)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------- 7. Check ----------
-- Every rule below should show locked = true. Send a screenshot if any say false.
select tablename, policyname, cmd,
       (coalesce(qual, '') || coalesce(with_check, '')) ilike '%is_exec%' as locked
from pg_policies
where schemaname = 'public' and 'authenticated'::name = any (roles)
order by locked, tablename, policyname;
