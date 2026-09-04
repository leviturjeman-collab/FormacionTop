create extension if not exists pgcrypto with schema extensions;

create table if not exists public.learners (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text,
  pin_hash text not null,
  level text not null default 'basico' check (level in ('basico', 'intermedio', 'avanzado')),
  goal text not null default '',
  tools text not null default '',
  notes text not null default '',
  locale text not null default 'es' check (locale in ('es', 'en')),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learner_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  session_token_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

create table if not exists public.learner_progress (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor text not null default 'system',
  action text not null,
  learner_id uuid references public.learners(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value)
values ('admin_pin_hash', extensions.crypt('5555', extensions.gen_salt('bf')))
on conflict (key) do nothing;

alter table public.learners enable row level security;
alter table public.learner_sessions enable row level security;
alter table public.learner_progress enable row level security;
alter table public.audit_log enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "admin can manage learners" on public.learners;
drop policy if exists "admin can manage sessions" on public.learner_sessions;
drop policy if exists "admin can manage progress" on public.learner_progress;
drop policy if exists "admin can read audit" on public.audit_log;

create policy "admin can manage learners"
on public.learners
for all
to authenticated
using ((auth.jwt() ->> 'app_role') = 'admin')
with check ((auth.jwt() ->> 'app_role') = 'admin');

create policy "admin can manage sessions"
on public.learner_sessions
for all
to authenticated
using ((auth.jwt() ->> 'app_role') = 'admin')
with check ((auth.jwt() ->> 'app_role') = 'admin');

create policy "admin can manage progress"
on public.learner_progress
for all
to authenticated
using ((auth.jwt() ->> 'app_role') = 'admin')
with check ((auth.jwt() ->> 'app_role') = 'admin');

create policy "admin can read audit"
on public.audit_log
for select
to authenticated
using ((auth.jwt() ->> 'app_role') = 'admin');

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_pin(admin_pin text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_settings s
    where s.key = 'admin_pin_hash'
      and s.value = extensions.crypt(admin_pin, s.value)
  );
$$;

drop trigger if exists learners_touch_updated_at on public.learners;
create trigger learners_touch_updated_at
before update on public.learners
for each row execute function public.touch_updated_at();

drop trigger if exists learner_progress_touch_updated_at on public.learner_progress;
create trigger learner_progress_touch_updated_at
before update on public.learner_progress
for each row execute function public.touch_updated_at();

create or replace function public.create_learner_with_pin(
  admin_pin text,
  learner_name text,
  learner_pin text,
  learner_level text default 'basico',
  learner_goal text default '',
  learner_tools text default '',
  learner_notes text default '',
  learner_locale text default 'es',
  learner_email text default null
)
returns public.learners
language plpgsql
security definer
set search_path = public
as $$
declare
  created public.learners;
begin
  if not public.is_admin_pin(admin_pin) then
    raise exception 'not allowed';
  end if;

  insert into public.learners (name, email, pin_hash, level, goal, tools, notes, locale)
  values (
    trim(learner_name),
    nullif(trim(coalesce(learner_email, '')), ''),
    extensions.crypt(learner_pin, extensions.gen_salt('bf')),
    learner_level,
    trim(coalesce(learner_goal, '')),
    trim(coalesce(learner_tools, '')),
    trim(coalesce(learner_notes, '')),
    learner_locale
  )
  returning * into created;

  insert into public.audit_log (actor, action, learner_id, metadata)
  values ('admin', 'learner.created', created.id, jsonb_build_object('level', learner_level, 'locale', learner_locale));

  return created;
end;
$$;

create or replace function public.list_learners_admin(admin_pin text)
returns table (
  id uuid,
  name text,
  email text,
  level text,
  goal text,
  tools text,
  notes text,
  locale text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_pin(admin_pin) then
    raise exception 'not allowed';
  end if;

  return query
  select l.id, l.name, l.email, l.level, l.goal, l.tools, l.notes, l.locale, l.status, l.created_at, l.updated_at
  from public.learners l
  order by l.created_at desc;
end;
$$;

create or replace function public.delete_learner_admin(admin_pin text, learner_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_pin(admin_pin) then
    raise exception 'not allowed';
  end if;

  insert into public.audit_log (actor, action, learner_id)
  values ('admin', 'learner.deleted', learner_id);

  delete from public.learners where id = learner_id;
end;
$$;

create or replace function public.verify_learner_pin(learner_pin text)
returns table (
  id uuid,
  name text,
  level text,
  goal text,
  tools text,
  locale text,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select l.id, l.name, l.level, l.goal, l.tools, l.locale, l.status
  from public.learners l
  where l.status = 'active'
    and l.pin_hash = crypt(learner_pin, l.pin_hash)
  limit 1;
end;
$$;

revoke all on function public.is_admin_pin(text) from public;
grant execute on function public.is_admin_pin(text) to anon, authenticated;

revoke all on function public.create_learner_with_pin(text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.create_learner_with_pin(text, text, text, text, text, text, text, text, text) to anon, authenticated;

revoke all on function public.list_learners_admin(text) from public;
grant execute on function public.list_learners_admin(text) to anon, authenticated;

revoke all on function public.delete_learner_admin(text, uuid) from public;
grant execute on function public.delete_learner_admin(text, uuid) to anon, authenticated;

revoke all on function public.verify_learner_pin(text) from public;
grant execute on function public.verify_learner_pin(text) to anon, authenticated;
