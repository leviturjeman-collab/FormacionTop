alter table public.learners add column if not exists pin_visible text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'learners' and column_name = 'pin'
  ) then
    execute 'update public.learners set pin_visible = coalesce(pin_visible, nullif(pin::text, '''')) where pin is not null';
  end if;
end $$;

drop function if exists public.list_learners_admin(text);

create function public.list_learners_admin(admin_pin text)
returns table (
  id uuid,
  name text,
  email text,
  pin text,
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
  select l.id, l.name, l.email, l.pin_visible, l.level, l.goal, l.tools, l.notes, l.locale, l.status, l.created_at, l.updated_at
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

  insert into public.learners (name, email, pin_hash, pin_visible, level, goal, tools, notes, locale)
  values (
    trim(learner_name),
    nullif(trim(coalesce(learner_email, '')), ''),
    extensions.crypt(learner_pin, extensions.gen_salt('bf')),
    learner_pin,
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
