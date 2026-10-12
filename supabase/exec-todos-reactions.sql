-- MCC exec area, part 3: reactions on shout-outs + the exec to-do board.
-- Run AFTER setup.sql and exec-dashboard.sql. Paste into Supabase -> SQL Editor -> Run. Safe to run again.

-- ---------- Reactions on shout-outs ----------
create table if not exists public.shoutout_reactions (
  shoutout_id bigint not null references public.shoutouts (id) on delete cascade,
  user_id     uuid   not null default auth.uid() references public.profiles (id) on delete cascade,
  emoji       text   not null check (emoji in ('🎉', '👏', '🔥', '💛')),
  created_at  timestamptz not null default now(),
  primary key (shoutout_id, user_id, emoji)
);
alter table public.shoutout_reactions enable row level security;
revoke all on public.shoutout_reactions from anon, authenticated;
grant select, insert, delete on public.shoutout_reactions to authenticated;

drop policy if exists "execs read reactions" on public.shoutout_reactions;
create policy "execs read reactions"
  on public.shoutout_reactions for select
  to authenticated
  using (true);

drop policy if exists "execs add own reactions" on public.shoutout_reactions;
create policy "execs add own reactions"
  on public.shoutout_reactions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "execs remove own reactions" on public.shoutout_reactions;
create policy "execs remove own reactions"
  on public.shoutout_reactions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------- Exec to-do board (collaborative) ----------
create table if not exists public.todos (
  id           bigint generated always as identity primary key,
  title        text not null check (char_length(title) between 1 and 140),
  assignee_id  uuid references public.profiles (id) on delete set null,
  created_by   uuid default auth.uid() references public.profiles (id) on delete set null,
  status       text not null default 'open' check (status in ('open', 'done')),
  due_date     date,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.todos enable row level security;
revoke all on public.todos from anon, authenticated;
grant select, insert, delete on public.todos to authenticated;
-- Execs may edit these columns only (never created_by / created_at / id).
grant update (title, assignee_id, status, due_date, completed_at) on public.todos to authenticated;

drop policy if exists "execs read todos" on public.todos;
create policy "execs read todos"
  on public.todos for select
  to authenticated
  using (true);

drop policy if exists "execs add todos" on public.todos;
create policy "execs add todos"
  on public.todos for insert
  to authenticated
  with check ((select auth.uid()) = created_by);

-- Collaborative: any exec can tick off, reassign or edit any task.
drop policy if exists "execs update todos" on public.todos;
create policy "execs update todos"
  on public.todos for update
  to authenticated
  using (true)
  with check (true);

-- Only the person who created a task can delete it (you can delete any from the dashboard).
drop policy if exists "creator deletes todo" on public.todos;
create policy "creator deletes todo"
  on public.todos for delete
  to authenticated
  using ((select auth.uid()) = created_by);

create index if not exists todos_status_idx on public.todos (status, due_date);
