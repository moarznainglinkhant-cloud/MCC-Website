-- MCC exec area: newsletters table.
-- Run AFTER setup.sql. Paste into Supabase -> SQL Editor -> Run. Safe to run again.
--
-- One row per newsletter issue. The issue's actual text lives in a Google Doc
-- (this table only tracks who's working on what) -- the public site reads the
-- published rows straight from here and renders its own copy of each doc's
-- content via that doc's "Publish to web" link, so visitors never see Google
-- Docs itself.
--
--   edit_link    -- the normal docs.google.com/.../edit link execs use to edit it
--   publish_link -- File > Share > Publish to web on the doc; this is what the
--                   public site fetches to render the issue on its own page

create table if not exists public.newsletters (
  id           bigint generated always as identity primary key,
  name         text not null check (char_length(name) between 1 and 160),
  status       text not null default 'draft' check (status in ('draft', 'in_review', 'published')),
  edit_link    text not null check (edit_link ~ '^https://'),
  publish_link text check (publish_link is null or publish_link ~ '^https://'),
  updated_by   uuid references public.profiles (id) on delete set null,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

alter table public.newsletters enable row level security;
revoke all on public.newsletters from anon, authenticated;

-- ---------- Execs: full read/write on every row (shared editing, like the to-do board) ----------
grant select, insert, update, delete on public.newsletters to authenticated;

drop policy if exists "execs read newsletters" on public.newsletters;
create policy "execs read newsletters"
  on public.newsletters for select
  to authenticated
  using (true);

drop policy if exists "execs add newsletters" on public.newsletters;
create policy "execs add newsletters"
  on public.newsletters for insert
  to authenticated
  with check (true);

drop policy if exists "execs update newsletters" on public.newsletters;
create policy "execs update newsletters"
  on public.newsletters for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "execs delete newsletters" on public.newsletters;
create policy "execs delete newsletters"
  on public.newsletters for delete
  to authenticated
  using (true);

-- Keep updated_at honest -- stamped by the database on every edit, not the browser.
create or replace function public.touch_newsletter()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists newsletters_touch on public.newsletters;
create trigger newsletters_touch
  before update on public.newsletters
  for each row execute function public.touch_newsletter();

-- ---------- Public site: anyone can read ONLY published issues, and only the
-- columns the public page actually needs (name, when it was last touched, and
-- the publish-to-web link used to render it) -- never the private edit_link,
-- and never a draft or in-review issue. ----------
grant select (id, name, updated_at, publish_link) on public.newsletters to anon;

drop policy if exists "public reads published newsletters" on public.newsletters;
create policy "public reads published newsletters"
  on public.newsletters for select
  to anon
  using (status = 'published');

create index if not exists newsletters_status_idx on public.newsletters (status, updated_at desc);
