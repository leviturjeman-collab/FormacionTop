create extension if not exists pgcrypto;

create table if not exists public.learners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  pin text not null unique,
  pin_hash text not null unique,
  level text not null default 'basico',
  goal text not null default '',
  tools text not null default '',
  notes text not null default '',
  status text not null default 'pendiente' check (status in ('pendiente', 'entregado', 'activo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learners_pin_idx on public.learners (pin);
create index if not exists learners_status_idx on public.learners (status);
create index if not exists learners_updated_at_idx on public.learners (updated_at desc);

alter table public.learners enable row level security;
alter table public.learners force row level security;

revoke all on table public.learners from anon;
revoke all on table public.learners from authenticated;

drop policy if exists learners_no_direct_client_access on public.learners;
create policy learners_no_direct_client_access
on public.learners
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists learners_set_updated_at on public.learners;
create trigger learners_set_updated_at
before update on public.learners
for each row
execute function public.set_updated_at();

create table if not exists public.learner_progress (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learner_progress_updated_at_idx on public.learner_progress (updated_at desc);

alter table public.learner_progress enable row level security;
alter table public.learner_progress force row level security;

revoke all on table public.learner_progress from anon;
revoke all on table public.learner_progress from authenticated;

drop policy if exists learner_progress_no_direct_client_access on public.learner_progress;
create policy learner_progress_no_direct_client_access
on public.learner_progress
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

drop trigger if exists learner_progress_set_updated_at on public.learner_progress;
create trigger learner_progress_set_updated_at
before update on public.learner_progress
for each row
execute function public.set_updated_at();
