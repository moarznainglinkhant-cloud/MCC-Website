-- Ask MCC: "Ask the exec team" inbox.
-- Run AFTER members-1-exec-lockdown.sql (needs public.is_exec()). Paste into Supabase ->
-- SQL Editor -> New query -> Run. Safe to run again.
--
-- What it sets up:
--   ask_questions          questions visitors send from the Ask MCC chat when it can't answer
--   ask_exec()             the only way the chat adds one (checks everything first)
--   ask_answers_public     answered questions an exec chose to "teach" Ask MCC. Ask MCC reads
--                          this view at every refresh (every 6 hours) and answers from it.
--
-- Who can see what:
--   * visitors: can't read anything; can only send a question through ask_exec()
--   * execs (signed in, is_exec): read every question, write answers, dismiss
--   * anyone: can read ask_answers_public (question + answer only; never the email)

create table if not exists public.ask_questions (
  id           bigint generated always as identity primary key,
  question     text not null check (char_length(question) between 3 and 500),
  email        text check (email is null or (char_length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')),
  context      text check (char_length(context) <= 2000),     -- the bot's answer, so execs see what was missing
  session_id   text check (char_length(session_id) <= 64),
  status       text not null default 'open' check (status in ('open', 'answered', 'dismissed')),
  answer       text check (char_length(answer) <= 2000),
  teach        boolean not null default false,                 -- show this Q&A to Ask MCC
  answered_by  uuid references auth.users (id) on delete set null,
  answered_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists ask_questions_created on public.ask_questions (created_at desc);

alter table public.ask_questions enable row level security;
revoke all on public.ask_questions from anon, authenticated;
grant select on public.ask_questions to authenticated;
grant update (answer, teach, status, answered_by, answered_at) on public.ask_questions to authenticated;

drop policy if exists "execs read questions" on public.ask_questions;
create policy "execs read questions" on public.ask_questions for select to authenticated
  using (public.is_exec());
drop policy if exists "execs answer questions" on public.ask_questions;
create policy "execs answer questions" on public.ask_questions for update to authenticated
  using (public.is_exec()) with check (public.is_exec());

-- ---------- The chat's only way in ----------
create or replace function public.ask_exec(p_question text, p_email text default null,
                                           p_context text default null, p_session text default null)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  q text := btrim(coalesce(p_question, ''));
  e text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  new_id bigint;
begin
  if char_length(q) < 3 then raise exception 'Please write your question'; end if;
  if char_length(q) > 500 then q := left(q, 500); end if;
  if e is not null and (char_length(e) > 254 or e !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$') then
    raise exception 'Please enter a valid email';
  end if;
  -- flood guards: 20 a minute across the site, 5 an hour per chat session
  if (select count(*) from public.ask_questions where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Too many questions right now, please try again in a minute';
  end if;
  if p_session is not null and (select count(*) from public.ask_questions
      where session_id = left(p_session, 64) and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'You have sent a few questions already. The team will get back to you soon';
  end if;
  insert into public.ask_questions (question, email, context, session_id)
  values (q, e, left(p_context, 2000), left(p_session, 64))
  returning id into new_id;
  return new_id;
end;
$$;
revoke execute on function public.ask_exec(text, text, text, text) from public;
grant execute on function public.ask_exec(text, text, text, text) to anon, authenticated;

-- ---------- What Ask MCC learns from ----------
-- security_invoker = false: the view reads the table as its owner, so anon sees exactly these
-- three columns of taught answers and nothing else.
create or replace view public.ask_answers_public with (security_invoker = false) as
  select id, question, answer, answered_at
  from public.ask_questions
  where status = 'answered' and teach and answer is not null and char_length(btrim(answer)) > 0
  order by answered_at desc
  limit 200;
revoke all on public.ask_answers_public from anon, authenticated;
grant select on public.ask_answers_public to anon, authenticated;
