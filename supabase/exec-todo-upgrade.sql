-- MCC exec area: to-do upgrade (adds the "In progress" status and due dates relative to an event).
-- Paste this whole file into Supabase -> SQL Editor -> Run. Safe to run more than once.

-- Allow a third status. (Drops whatever check currently limits status, then re-adds a wider one.)
do $$
declare c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.todos'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.todos drop constraint %I', c);
  end loop;
end $$;
alter table public.todos add constraint todos_status_check check (status in ('open', 'doing', 'done'));

-- "Due N days before the event". The site works out the real date from the event's date.
alter table public.todos add column if not exists due_offset integer check (due_offset between 0 and 365);
grant update (due_offset) on public.todos to authenticated;
