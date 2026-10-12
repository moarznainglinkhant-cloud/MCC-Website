-- MCC exec area, part 4: meeting finder (weekly availability + days off). See the paste-ready version in chat.
alter table public.profiles add column if not exists is_core boolean not null default false;

create table if not exists public.availability (
  user_id    uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  cells      text not null check (cells ~ '^[012]{210}$'),
  updated_at timestamptz not null default now()
);
alter table public.availability enable row level security;
revoke all on public.availability from anon, authenticated;
grant select, insert on public.availability to authenticated;
grant update (user_id, cells, updated_at) on public.availability to authenticated;

drop policy if exists "execs read availability" on public.availability;
create policy "execs read availability" on public.availability for select to authenticated using (true);
drop policy if exists "execs add own availability" on public.availability;
create policy "execs add own availability" on public.availability for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "execs change own availability" on public.availability;
create policy "execs change own availability" on public.availability for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table if not exists public.unavailable_dates (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  day     date not null,
  primary key (user_id, day)
);
alter table public.unavailable_dates enable row level security;
revoke all on public.unavailable_dates from anon, authenticated;
grant select, insert, delete on public.unavailable_dates to authenticated;

drop policy if exists "execs read days off" on public.unavailable_dates;
create policy "execs read days off" on public.unavailable_dates for select to authenticated using (true);
drop policy if exists "execs add own days off" on public.unavailable_dates;
create policy "execs add own days off" on public.unavailable_dates for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "execs remove own days off" on public.unavailable_dates;
create policy "execs remove own days off" on public.unavailable_dates for delete to authenticated using ((select auth.uid()) = user_id);
