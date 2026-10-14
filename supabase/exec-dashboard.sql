-- MCC exec area, part 2: announcement banner, lounge, team list.
-- Run AFTER setup.sql. Paste into Supabase -> SQL Editor -> Run. Safe to run again.

-- ---------- Team list: any signed-in exec can see every exec's name + role ----------
-- (profiles holds no emails, only display_name and role.)
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "execs read all profiles" on public.profiles;
create policy "execs read all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- ---------- Announcements: you write them in the dashboard, execs read them ----------
create table if not exists public.announcements (
  id         bigint generated always as identity primary key,
  body       text not null check (char_length(body) between 1 and 600),
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;
revoke all on public.announcements from anon, authenticated;
grant select on public.announcements to authenticated;
drop policy if exists "execs read announcements" on public.announcements;
create policy "execs read announcements"
  on public.announcements for select
  to authenticated
  using (true);

-- ---------- Shout-out wall ----------
create table if not exists public.shoutouts (
  id         bigint generated always as identity primary key,
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 280),
  created_at timestamptz not null default now()
);
alter table public.shoutouts enable row level security;
revoke all on public.shoutouts from anon, authenticated;
grant select, insert, delete on public.shoutouts to authenticated;

drop policy if exists "execs read shoutouts" on public.shoutouts;
create policy "execs read shoutouts"
  on public.shoutouts for select
  to authenticated
  using (true);

drop policy if exists "execs post own shoutouts" on public.shoutouts;
create policy "execs post own shoutouts"
  on public.shoutouts for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "execs delete own shoutouts" on public.shoutouts;
create policy "execs delete own shoutouts"
  on public.shoutouts for delete
  to authenticated
  using ((select auth.uid()) = author_id);

create index if not exists shoutouts_created_at_idx on public.shoutouts (created_at desc);

-- ---------- A first announcement so the banner has something to show ----------
insert into public.announcements (body)
select 'Welcome to the exec area! This is a private space for the MCC team. Drop a note in the lounge.'
where not exists (select 1 from public.announcements);
