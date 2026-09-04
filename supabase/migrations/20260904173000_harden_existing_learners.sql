create extension if not exists pgcrypto with schema extensions;

alter table public.learners add column if not exists email text;
alter table public.learners add column if not exists pin_hash text;
alter table public.learners add column if not exists level text not null default 'basico';
alter table public.learners add column if not exists goal text not null default '';
alter table public.learners add column if not exists tools text not null default '';
alter table public.learners add column if not exists notes text not null default '';
alter table public.learners add column if not exists locale text not null default 'es';
alter table public.learners add column if not exists status text not null default 'active';
alter table public.learners add column if not exists created_at timestamptz not null default now();
alter table public.learners add column if not exists updated_at timestamptz not null default now();

update public.learners
set pin_hash = extensions.crypt(coalesce(pin_hash, '000000'), extensions.gen_salt('bf'))
where pin_hash is null;

alter table public.learners alter column pin_hash set not null;

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value)
values ('admin_pin_hash', extensions.crypt('5555', extensions.gen_salt('bf')))
on conflict (key) do nothing;

alter table public.learners enable row level security;
alter table public.learner_progress enable row level security;
alter table public.app_settings enable row level security;

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
    and l.pin_hash = extensions.crypt(learner_pin, l.pin_hash)
  limit 1;
end;
$$;

grant execute on function public.is_admin_pin(text) to anon, authenticated;
grant execute on function public.list_learners_admin(text) to anon, authenticated;
grant execute on function public.create_learner_with_pin(text, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.verify_learner_pin(text) to anon, authenticated;
