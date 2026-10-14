-- Activity tracking for the exec area: one row per visit, with start and last-seen times.
-- Run in the Supabase SQL editor. Safe to re-run.
--
-- A "visit" starts when someone signs in (or opens the dashboard while already signed in) and
-- keeps a heartbeat while the tab is open and visible. Time spent = last_seen_at - started_at.
-- Execs cannot read or write this table from the website; only the track_activity() function
-- below can write their own row. You read it here in the SQL editor.

create table if not exists public.activity_sessions (
  id           uuid primary key,
  user_id      uuid not null references auth.users (id) on delete cascade,
  started_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  via_signin   boolean not null default false
);
create index if not exists activity_sessions_user_idx on public.activity_sessions (user_id, started_at desc);

alter table public.activity_sessions enable row level security;
revoke all on public.activity_sessions from anon, authenticated;

create or replace function public.track_activity(p_session uuid, p_signin boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or p_session is null then return; end if;
  insert into public.activity_sessions (id, user_id, via_signin)
  values (p_session, auth.uid(), coalesce(p_signin, false))
  on conflict (id) do update set last_seen_at = now()
    where public.activity_sessions.user_id = auth.uid();
end;
$$;
revoke execute on function public.track_activity(uuid, boolean) from public, anon;
grant execute on function public.track_activity(uuid, boolean) to authenticated;

-- Summary per person (run this whenever you want the numbers):
select p.display_name,
       count(*) filter (where s.via_signin)                                  as sign_ins,
       count(*)                                                              as visits,
       round(sum(extract(epoch from (s.last_seen_at - s.started_at))) / 60)  as total_minutes,
       round(avg(extract(epoch from (s.last_seen_at - s.started_at))) / 60, 1) as avg_minutes_per_visit,
       max(s.last_seen_at)                                                   as last_seen
from public.profiles p
left join public.activity_sessions s on s.user_id = p.id
group by p.display_name
order by total_minutes desc nulls last;

-- Every visit, newest first (change 'tina' to see someone else):
-- select s.started_at, s.last_seen_at, s.via_signin,
--        round(extract(epoch from (s.last_seen_at - s.started_at)) / 60, 1) as minutes
-- from public.activity_sessions s join public.profiles p on p.id = s.user_id
-- where lower(p.display_name) = 'tina'
-- order by s.started_at desc;
