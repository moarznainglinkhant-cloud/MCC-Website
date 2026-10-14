-- Meeting finder groups: "Core execs" and "Team A". Run in the Supabase SQL editor; safe to re-run.
alter table public.profiles add column if not exists is_core boolean not null default false;
alter table public.profiles add column if not exists team text;

update public.profiles set is_core = true where lower(display_name) in ('tina', 'martin', 'lulu');
update public.profiles set team = 'A'     where lower(display_name) in ('moarz', 'su', 'hsu');

select display_name, role, is_core, team from public.profiles order by display_name;
