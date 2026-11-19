-- Burmese voice clips for the Learn page and Ask MCC (the `speak` Edge Function).
-- Run once in Supabase → SQL Editor. Safe to run again.

-- 1. A public bucket for the clips. Anyone can play a clip by its link; only the function
--    (service role) can add clips.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('speech', 'speech', true, 1048576, array['audio/mpeg'])
on conflict (id) do update set public = true, file_size_limit = 1048576, allowed_mime_types = array['audio/mpeg'];

-- 2. Daily counts of NEW clips (stored clips are free), so nobody can burn the free Azure quota.
--    `who` is a hash of the visitor's network address, never the address itself.
create table if not exists public.speech_usage (
  day date not null,
  who text not null,
  n int not null default 0,
  primary key (day, who)
);
alter table public.speech_usage enable row level security;  -- no policies: only the function can touch it

-- true = allowed (and counted), false = over today's limit (per visitor or for everyone).
create or replace function public.speech_bump(p_who text, p_per_visitor int, p_total int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'America/Toronto')::date;
  mine int;
  total int;
begin
  select coalesce(sum(n), 0) into total from speech_usage where day = today;
  select coalesce(n, 0) into mine from speech_usage where day = today and who = p_who;
  if coalesce(mine, 0) >= p_per_visitor or total >= p_total then
    return false;
  end if;
  insert into speech_usage (day, who, n) values (today, p_who, 1)
  on conflict (day, who) do update set n = speech_usage.n + 1;
  delete from speech_usage where day < today - 7;  -- keep the table tiny
  return true;
end;
$$;
revoke all on function public.speech_bump(text, int, int) from public, anon, authenticated;
