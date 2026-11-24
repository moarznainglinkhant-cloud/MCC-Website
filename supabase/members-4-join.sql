-- MCC members, step 4: the "Join the Club" form (join.html).
-- Run AFTER members-1-exec-lockdown.sql and members-2-registration.sql.
-- Paste into Supabase -> SQL Editor -> New query -> Run. Safe to run again.
--
-- What it sets up:
--   club_members   the club's member list: one row per person who filled in the join form
--   join_club()    the only way the website adds a row (checks everything first)
--
-- Who can see what:
--   * visitors: can't read anything; can only join through join_club()
--   * execs (signed in, is_exec): read the list, remove a row
--
-- How this differs from public.members: that table is website accounts (email + password).
-- Joining the club needs no password. When someone on this list later makes an account with
-- the same email, account_id is filled in so the two can be read together.

create table if not exists public.club_members (
  id             bigint generated always as identity primary key,
  full_name      text not null check (char_length(full_name) between 1 and 120),   -- one name: many Burmese names have no first/last split
  preferred_name text check (char_length(preferred_name) between 1 and 60),
  email          text not null unique check (email = lower(email) and char_length(email) <= 254),
  affiliation    text not null check (affiliation in ('undergrad', 'grad', 'faculty', 'alumni', 'external')),
  utorid         text check (utorid ~ '^[a-z0-9]{3,8}$'),
  student_number text check (student_number ~ '^[0-9]{9,10}$'),
  year_of_study  text check (year_of_study in ('1', '2', '3', '4', '5+')),
  ideas          text check (char_length(ideas) <= 1000),
  newsletter     boolean not null default false,          -- asked for the newsletter (the list itself lives in Kit)
  account_id     uuid references public.members (id) on delete set null,
  created_at     timestamptz not null default now(),
  -- UTORid and student number are kept for current students only
  check (affiliation in ('undergrad', 'grad') or (utorid is null and student_number is null)),
  check (affiliation = 'undergrad' or year_of_study is null)
);
create index if not exists club_members_created on public.club_members (created_at desc);

-- The first version of this file kept first and last name apart. If that table is already
-- here, fold the two into full_name (nobody is lost) and retire the old function.
do $$
begin
  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'club_members' and column_name = 'first_name') then
    alter table public.club_members add column if not exists full_name text;
    update public.club_members set full_name = btrim(first_name || ' ' || last_name) where full_name is null;
    alter table public.club_members alter column full_name set not null;
    alter table public.club_members add constraint club_members_full_name_check check (char_length(full_name) between 1 and 120);
    alter table public.club_members drop column first_name, drop column last_name;
  end if;
end $$;
drop function if exists public.join_club(text, text, text, text, text, text, text, text, text, boolean);

alter table public.club_members enable row level security;
revoke all on public.club_members from anon, authenticated;
grant select, delete on public.club_members to authenticated;

drop policy if exists "execs read club members" on public.club_members;
create policy "execs read club members" on public.club_members for select to authenticated
  using (public.is_exec());
drop policy if exists "execs remove club members" on public.club_members;
create policy "execs remove club members" on public.club_members for delete to authenticated
  using (public.is_exec());

-- ---------- join_club(): the website's one way in ----------
-- Joining twice with the same email changes nothing and answers the same as the first time, so
-- the form can't be used to find out whether an email is already on the list.
create or replace function public.join_club(
  p_full_name text, p_email text, p_affiliation text,
  p_preferred_name text default null, p_utorid text default null,
  p_student_number text default null, p_year_of_study text default null,
  p_ideas text default null, p_newsletter boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name    text := regexp_replace(btrim(coalesce(p_full_name, '')), '\s+', ' ', 'g');
  v_pref    text := nullif(regexp_replace(btrim(coalesce(p_preferred_name, '')), '\s+', ' ', 'g'), '');
  v_email   text := lower(btrim(coalesce(p_email, '')));
  v_aff     text := coalesce(p_affiliation, '');
  v_utorid  text := nullif(lower(btrim(coalesce(p_utorid, ''))), '');
  v_student text := nullif(regexp_replace(coalesce(p_student_number, ''), '[^0-9]', '', 'g'), '');
  v_year    text := nullif(btrim(coalesce(p_year_of_study, '')), '');
  v_ideas   text := nullif(btrim(coalesce(p_ideas, '')), '');
begin
  if char_length(v_name) < 1 or char_length(v_name) > 120 then
    raise exception 'Please enter your name';
  end if;
  if char_length(v_pref) > 60 then
    raise exception 'Please shorten your preferred name';
  end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' or char_length(v_email) > 254 then
    raise exception 'Please enter a valid email';
  end if;
  if v_aff not in ('undergrad', 'grad', 'faculty', 'alumni', 'external') then
    raise exception 'Please choose how you are connected to UofT';
  end if;

  if v_aff in ('undergrad', 'grad') then
    if v_utorid is null or v_utorid !~ '^[a-z0-9]{3,8}$' then
      raise exception 'Please enter your UTORid';
    end if;
    if v_student is null or v_student !~ '^[0-9]{9,10}$' then
      raise exception 'Please enter your 9 or 10 digit student number';
    end if;
  else
    v_utorid := null; v_student := null;        -- never stored for anyone else, whatever was sent
  end if;
  if v_aff = 'undergrad' then
    if v_year is null or v_year not in ('1', '2', '3', '4', '5+') then
      raise exception 'Please choose your year of study';
    end if;
  else
    v_year := null;
  end if;

  -- flood guard: at most 30 new members a minute across the whole site
  if (select count(*) from public.club_members where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Too many sign-ups right now, please try again in a minute';
  end if;

  insert into public.club_members
    (full_name, preferred_name, email, affiliation, utorid, student_number,
     year_of_study, ideas, newsletter, account_id)
  values
    (v_name, v_pref, v_email, v_aff, v_utorid, v_student, v_year, left(v_ideas, 1000),
     coalesce(p_newsletter, false),
     (select m.id from public.members m where lower(m.email) = v_email limit 1))
  on conflict (email) do nothing;
end;
$$;
revoke execute on function public.join_club(text, text, text, text, text, text, text, text, boolean) from public;
grant execute on function public.join_club(text, text, text, text, text, text, text, text, boolean) to anon, authenticated;

-- ---------- Link a later website account to the member row ----------
create or replace function public.link_club_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.club_members set account_id = new.id
   where account_id is null and email = lower(new.email);
  return new;
end;
$$;
revoke execute on function public.link_club_member() from public, anon, authenticated;
drop trigger if exists members_link_club_member on public.members;
create trigger members_link_club_member after insert on public.members
  for each row execute function public.link_club_member();

-- Tell the API about the new function straight away.
notify pgrst, 'reload schema';

-- ---------- Check ----------
select 'club_members' as tbl, count(*) from public.club_members;
