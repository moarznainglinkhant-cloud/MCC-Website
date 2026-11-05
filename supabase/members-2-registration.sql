-- MCC members, step 2: member accounts + event registration.
-- Run AFTER members-1-exec-lockdown.sql. Paste into Supabase -> SQL Editor -> New query -> Run.
-- Safe to run again.
--
-- What it sets up:
--   members              one row per member (made automatically when someone signs up on the website)
--   event_registrations  one row per person per event: a member, or a guest (name + email)
--   register_for_event() the only way the website adds a registration (checks everything first)
--
-- Who can see what:
--   * visitors (not signed in): can't read anything; can only register through the function
--   * members: can read their own profile and their own registrations (tickets)
--   * execs: can read all members and all registrations, and mark people as checked in

-- ---------- Members ----------
create table if not exists public.members (
  id             uuid primary key references auth.users (id) on delete cascade,
  full_name      text not null check (char_length(full_name) between 1 and 120),
  email          text not null check (char_length(email) <= 254),
  student_number text check (student_number ~ '^[0-9]{9,10}$'),
  year           text check (char_length(year) <= 40),
  program        text check (char_length(program) <= 120),
  created_at     timestamptz not null default now()
);
alter table public.members enable row level security;
revoke all on public.members from anon, authenticated;
grant select on public.members to authenticated;
grant update (full_name, student_number, year, program) on public.members to authenticated;

drop policy if exists "member reads own" on public.members;
create policy "member reads own" on public.members for select to authenticated
  using ((select auth.uid()) = id);
drop policy if exists "member updates own" on public.members;
create policy "member updates own" on public.members for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
drop policy if exists "execs read members" on public.members;
create policy "execs read members" on public.members for select to authenticated
  using (public.is_exec());

-- ---------- Registrations ----------
create table if not exists public.event_registrations (
  id            bigint generated always as identity primary key,
  event_id      text not null check (event_id ~ '^[a-z0-9-]{1,80}$'),   -- the "id" column in the Events sheet
  event_name    text not null default '' check (char_length(event_name) <= 200),
  event_date    date,
  user_id       uuid references public.members (id) on delete set null,
  guest_name    text check (char_length(guest_name) <= 120),
  guest_email   text check (char_length(guest_email) <= 254),
  ticket_code   uuid not null unique default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  checked_in_at timestamptz,
  check (user_id is not null or (guest_name is not null and guest_email is not null))
);
create unique index if not exists event_reg_member_once on public.event_registrations (event_id, user_id) where user_id is not null;
create unique index if not exists event_reg_guest_once on public.event_registrations (event_id, lower(guest_email)) where user_id is null;
create index if not exists event_reg_event_idx on public.event_registrations (event_id, created_at);

alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from anon, authenticated;
grant select on public.event_registrations to authenticated;
grant update (checked_in_at) on public.event_registrations to authenticated;

drop policy if exists "member reads own tickets" on public.event_registrations;
create policy "member reads own tickets" on public.event_registrations for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "execs read registrations" on public.event_registrations;
create policy "execs read registrations" on public.event_registrations for select to authenticated
  using (public.is_exec());
drop policy if exists "execs check people in" on public.event_registrations;
create policy "execs check people in" on public.event_registrations for update to authenticated
  using (public.is_exec()) with check (public.is_exec());

-- ---------- register_for_event(): the website's one way in ----------
-- Signed-in members: registers them (once). Everyone else: registers a guest by name + email (once
-- per email per event). Returns the ticket either way, plus whether they were already registered.
create or replace function public.register_for_event(
  p_event_id text, p_event_name text, p_event_date date,
  p_guest_name text default null, p_guest_email text default null)
returns table (ticket_code uuid, already boolean, holder text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_member public.members%rowtype;
  v_email text := lower(trim(coalesce(p_guest_email, '')));
  v_name text := trim(coalesce(p_guest_name, ''));
  v_code uuid;
begin
  if p_event_id is null or p_event_id !~ '^[a-z0-9-]{1,80}$' then
    raise exception 'Unknown event';
  end if;
  -- simple flood guard: at most 40 new registrations a minute across the whole site
  if (select count(*) from public.event_registrations where created_at > now() - interval '1 minute') >= 40 then
    raise exception 'Too many registrations right now, please try again in a minute';
  end if;

  if v_uid is not null then
    select * into v_member from public.members m where m.id = v_uid;
  end if;

  if v_member.id is not null then
    select r.ticket_code into v_code from public.event_registrations r
      where r.event_id = p_event_id and r.user_id = v_member.id;
    if v_code is not null then
      return query select v_code, true, v_member.full_name; return;
    end if;
    insert into public.event_registrations (event_id, event_name, event_date, user_id)
      values (p_event_id, left(coalesce(p_event_name, ''), 200), p_event_date, v_member.id)
      returning event_registrations.ticket_code into v_code;
    return query select v_code, false, v_member.full_name; return;
  end if;

  -- guest
  if char_length(v_name) < 1 or char_length(v_name) > 120 then
    raise exception 'Please enter your name';
  end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' or char_length(v_email) > 254 then
    raise exception 'Please enter a valid email';
  end if;
  select r.ticket_code into v_code from public.event_registrations r
    where r.event_id = p_event_id and r.user_id is null and lower(r.guest_email) = v_email;
  if v_code is not null then
    return query select v_code, true, v_name; return;
  end if;
  insert into public.event_registrations (event_id, event_name, event_date, guest_name, guest_email)
    values (p_event_id, left(coalesce(p_event_name, ''), 200), p_event_date, v_name, v_email)
    returning event_registrations.ticket_code into v_code;
  return query select v_code, false, v_name;
end;
$$;
revoke execute on function public.register_for_event(text, text, date, text, text) from public;
grant execute on function public.register_for_event(text, text, date, text, text) to anon, authenticated;

-- ---------- New accounts ----------
-- Website sign-ups send account = 'member' with their details: they get a members row (and any
-- guest registrations made earlier with the same email move into their account).
-- Anything else (you adding an exec in the dashboard) gets a profiles row, not an exec until you tick is_exec.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if coalesce(meta ->> 'account', '') = 'member' then
    insert into public.members (id, full_name, email, student_number, year, program)
    values (
      new.id,
      left(coalesce(nullif(trim(meta ->> 'full_name'), ''), split_part(new.email, '@', 1)), 120),
      lower(new.email),
      nullif(regexp_replace(coalesce(meta ->> 'student_number', ''), '[^0-9]', '', 'g'), ''),
      left(nullif(trim(meta ->> 'year'), ''), 40),
      left(nullif(trim(meta ->> 'program'), ''), 120)
    )
    on conflict (id) do nothing;
    update public.event_registrations
       set user_id = new.id
     where user_id is null and lower(guest_email) = lower(new.email)
       and not exists (select 1 from public.event_registrations r2
                        where r2.event_id = event_registrations.event_id and r2.user_id = new.id);
    return new;
  end if;
  insert into public.profiles (id, display_name, is_exec)
  values (new.id, coalesce(meta ->> 'display_name', split_part(new.email, '@', 1)), false)
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------- Check ----------
select 'members' as tbl, count(*) from public.members
union all select 'event_registrations', count(*) from public.event_registrations;
