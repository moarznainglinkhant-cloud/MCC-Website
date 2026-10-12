-- MCC exec area: one-time database setup.
-- Paste this whole file into Supabase -> SQL Editor -> New query -> Run.
--
-- What it does:
--   * profiles table: one row per exec (display name + role)
--   * Row Level Security: a signed-in exec can read ONLY their own row; nobody can
--     write to it from the website (you edit it in the dashboard's Table Editor)
--   * a trigger that creates a profile automatically when you add a user

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role         text not null default 'exec',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Lock everything down, then grant back only what the site needs.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Auto-create a profile when a user is added in the dashboard.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Backfill: if you already created users before running this script.
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;
