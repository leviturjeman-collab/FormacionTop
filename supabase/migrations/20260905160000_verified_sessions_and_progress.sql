-- Apply only after reviewing the deployment runbook. No default administrator
-- credential is created. Legacy learner credentials require an explicit reset.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.academy_accounts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid unique references public.learners(id) on delete cascade,
  login text not null unique check (login = lower(trim(login)) and length(login) between 3 and 120 and login ~ '^[a-z0-9._@-]+$'),
  display_name text not null check (length(trim(display_name)) between 1 and 120),
  role text not null check (role in ('admin', 'learner')),
  secret_hash text not null,
  enabled boolean not null default true,
  access_expires_at timestamptz,
  created_at timestamptz not null default now(),
  check ((role = 'learner' and learner_id is not null) or (role = 'admin' and learner_id is null))
);
create table if not exists public.academy_sessions (
  token_hash text primary key,
  account_id uuid not null references public.academy_accounts(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '8 hours',
  created_at timestamptz not null default now()
);
create index if not exists academy_sessions_account on public.academy_sessions(account_id);
create table if not exists public.academy_attempts (
  identifier_hash text primary key,
  attempts integer not null default 0,
  window_start timestamptz not null default now()
);
create index if not exists academy_attempts_expiry on public.academy_attempts(window_start);
create table if not exists public.academy_progress (
  account_id uuid primary key references public.academy_accounts(id) on delete cascade,
  state jsonb not null default '{"name":"","teacher":false,"preferredLevel":"basico","lessons":{},"projects":[]}'::jsonb,
  version bigint not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.academy_audit (
  id bigint generated always as identity primary key,
  actor_id uuid,
  subject_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.academy_accounts enable row level security;
alter table public.academy_sessions enable row level security;
alter table public.academy_attempts enable row level security;
alter table public.academy_progress enable row level security;
alter table public.academy_audit enable row level security;
revoke all on public.academy_accounts, public.academy_sessions, public.academy_attempts, public.academy_progress, public.academy_audit from anon, authenticated;

-- Invalidate weak historical credentials without deleting profiles or evidence.
insert into public.academy_accounts (id, learner_id, login, display_name, role, secret_hash, enabled)
select id, id, id::text, name, 'learner', pin_hash, false from public.learners
on conflict (learner_id) do nothing;
insert into public.academy_progress(account_id,state)
select p.learner_id,p.state from public.learner_progress p
join public.academy_accounts a on a.id=p.learner_id
on conflict (account_id) do nothing;

-- Remove legacy anonymous entry points. Reversible PIN copies are cleared by
-- the single-code migration after it has converted them into hashed lookups.
revoke all on function public.is_admin_pin(text) from public, anon, authenticated;
revoke all on function public.verify_learner_pin(text) from public, anon, authenticated;
revoke all on function public.list_learners_admin(text) from public, anon, authenticated;
revoke all on function public.create_learner_with_pin(text,text,text,text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.delete_learner_admin(text,uuid) from public, anon, authenticated;
revoke all on public.learners, public.learner_sessions, public.learner_progress, public.app_settings, public.audit_log from anon, authenticated;
delete from public.app_settings where key='admin_pin_hash';
do $$ begin
  if exists(select 1 from information_schema.columns where table_schema='public' and table_name='learners' and column_name='pin') then
    -- Legacy column may have NOT NULL; remove it rather than keeping plaintext.
    alter table public.learners drop column pin;
  end if;
end $$;

create or replace function public.academy_account_for_token(session_token text)
returns public.academy_accounts language plpgsql security definer set search_path=pg_catalog as $$
declare result public.academy_accounts;
begin
  if session_token is null or length(session_token) <> 64 then return null; end if;
  select a.* into result from public.academy_sessions s
  join public.academy_accounts a on a.id=s.account_id
  left join public.learners l on l.id=a.learner_id
  where s.token_hash=encode(extensions.digest(session_token,'sha256'),'hex')
    and s.expires_at>now() and a.enabled and (a.access_expires_at is null or a.access_expires_at>now())
    and (a.role='admin' or l.status='active');
  return result;
end $$;

create or replace function public.academy_session(session_token text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts; l public.learners; p public.academy_progress; expiry timestamptz;
begin
  a:=public.academy_account_for_token(session_token);
  if a.id is null then return jsonb_build_object('ok',false,'error','session_expired'); end if;
  select * into l from public.learners where id=a.learner_id;
  select * into p from public.academy_progress where account_id=a.id;
  select expires_at into expiry from public.academy_sessions where token_hash=encode(extensions.digest(session_token,'sha256'),'hex');
  return jsonb_build_object('ok',true,'expiresAt',expiry,'profile',jsonb_build_object(
    'id',a.id,'name',a.display_name,'role',a.role,'level',coalesce(l.level,'intermedio'),
    'locale',coalesce(l.locale,'es'),'goal',coalesce(l.goal,''),'tools',coalesce(l.tools,'')),
    'progress',coalesce(p.state,'{"name":"","teacher":false,"preferredLevel":"basico","lessons":{},"projects":[]}'::jsonb),'version',coalesce(p.version,0));
end $$;

create or replace function public.academy_sign_in(login_identifier text, login_secret text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare identifier text:=lower(trim(login_identifier)); bucket text; attempt public.academy_attempts;
  a public.academy_accounts; raw_token text; response jsonb;
begin
  if identifier is null or length(identifier) not between 3 and 120 or login_secret is null or length(login_secret) < 10 or octet_length(login_secret) > 72 then
    return jsonb_build_object('ok',false,'error','invalid_credentials');
  end if;
  bucket:=encode(extensions.digest(identifier,'sha256'),'hex');
  -- Expired buckets cannot grow indefinitely across normal operation.
  delete from public.academy_attempts where window_start < now()-interval '1 day';
  insert into public.academy_attempts(identifier_hash) values(bucket) on conflict do nothing;
  select * into attempt from public.academy_attempts where identifier_hash=bucket for update;
  if attempt.window_start < now()-interval '15 minutes' then
    update public.academy_attempts set attempts=0,window_start=now() where identifier_hash=bucket;
    attempt.attempts:=0;
  end if;
  if attempt.attempts >= 5 then return jsonb_build_object('ok',false,'error','rate_limited'); end if;
  update public.academy_attempts set attempts=attempts+1 where identifier_hash=bucket;
  select * into a from public.academy_accounts where login=identifier and enabled and (access_expires_at is null or access_expires_at>now());
  if a.id is null or a.secret_hash <> extensions.crypt(login_secret,a.secret_hash) then
    insert into public.academy_audit(action,details) values('login.failed',jsonb_build_object('identifierHash',bucket));
    return jsonb_build_object('ok',false,'error','invalid_credentials');
  end if;
  if a.role='learner' and not exists(select 1 from public.learners where id=a.learner_id and status='active') then
    return jsonb_build_object('ok',false,'error','invalid_credentials');
  end if;
  delete from public.academy_attempts where identifier_hash=bucket;
  delete from public.academy_sessions where expires_at<=now();
  raw_token:=encode(extensions.gen_random_bytes(32),'hex');
  insert into public.academy_sessions(token_hash,account_id) values(encode(extensions.digest(raw_token,'sha256'),'hex'),a.id);
  insert into public.academy_audit(actor_id,subject_id,action) values(a.id,a.id,'login.succeeded');
  response:=public.academy_session(raw_token);
  return response || jsonb_build_object('token',raw_token);
end $$;

create or replace function public.academy_authorize(session_token text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts; expiry timestamptz;
begin
  a:=public.academy_account_for_token(session_token);
  if a.id is null then return jsonb_build_object('ok',false); end if;
  select expires_at into expiry from public.academy_sessions where token_hash=encode(extensions.digest(session_token,'sha256'),'hex');
  return jsonb_build_object('ok',true,'expiresAt',expiry);
end $$;

create or replace function public.academy_sign_out(session_token text)
returns void language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts;
begin
  a:=public.academy_account_for_token(session_token);
  delete from public.academy_sessions where token_hash=encode(extensions.digest(session_token,'sha256'),'hex');
  if a.id is not null then insert into public.academy_audit(actor_id,subject_id,action) values(a.id,a.id,'logout'); end if;
end $$;

create or replace function public.academy_load_progress(session_token text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts; p public.academy_progress;
begin
  a:=public.academy_account_for_token(session_token); if a.id is null then raise exception 'session_expired'; end if;
  insert into public.academy_progress(account_id) values(a.id) on conflict do nothing;
  select * into p from public.academy_progress where account_id=a.id;
  return jsonb_build_object('state',p.state,'version',p.version);
end $$;

create or replace function public.academy_save_progress(session_token text, progress_state jsonb, expected_version bigint)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts; v bigint; sanitized jsonb;
begin
  a:=public.academy_account_for_token(session_token); if a.id is null then raise exception 'session_expired'; end if;
  if jsonb_typeof(progress_state)<>'object' or jsonb_typeof(progress_state->'lessons') is distinct from 'object'
    or jsonb_typeof(progress_state->'projects') is distinct from 'array' or octet_length(progress_state::text)>5000000 then
    raise exception 'invalid_progress';
  end if;
  sanitized:=progress_state - array['id','access','teacher','session','token'];
  insert into public.academy_progress(account_id) values(a.id) on conflict do nothing;
  select version into v from public.academy_progress where account_id=a.id for update;
  if expected_version is null or v<>expected_version then return jsonb_build_object('ok',false,'conflict',true,'version',v); end if;
  update public.academy_progress set state=sanitized,version=v+1,updated_at=now() where account_id=a.id;
  return jsonb_build_object('ok',true,'version',v+1);
end $$;

create or replace function public.academy_require_admin(session_token text)
returns public.academy_accounts language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts;
begin
  a:=public.academy_account_for_token(session_token);
  if a.id is null or a.role<>'admin' then raise exception 'not_allowed'; end if;
  return a;
end $$;

create or replace function public.academy_admin_learners(session_token text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare a public.academy_accounts; result jsonb;
begin
  a:=public.academy_require_admin(session_token);
  select coalesce(jsonb_agg(jsonb_build_object('id',l.id,'login',ac.login,'name',l.name,'level',l.level,'goal',l.goal,'tools',l.tools,'notes',l.notes,'locale',l.locale,'status',l.status,'enabled',ac.enabled,'expiresAt',ac.access_expires_at,'createdAt',l.created_at) order by l.created_at desc),'[]'::jsonb)
  into result from public.learners l join public.academy_accounts ac on ac.learner_id=l.id;
  insert into public.academy_audit(actor_id,action) values(a.id,'learners.listed');
  return result;
end $$;

create or replace function public.academy_admin_create(session_token text, learner jsonb, initial_secret text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; l public.learners; account_id uuid;
begin
  actor:=public.academy_require_admin(session_token);
  if initial_secret is null or length(initial_secret) < 10 or octet_length(initial_secret) > 72 then raise exception 'invalid_secret'; end if;
  insert into public.learners(name,pin_hash,level,goal,tools,notes,locale)
  values(trim(learner->>'name'),extensions.crypt(initial_secret,extensions.gen_salt('bf',10)),coalesce(learner->>'level','basico'),
    coalesce(learner->>'goal',''),coalesce(learner->>'tools',''),coalesce(learner->>'notes',''),coalesce(learner->>'locale','es')) returning * into l;
  insert into public.academy_accounts(id,learner_id,login,display_name,role,secret_hash,access_expires_at)
  values(l.id,l.id,lower(trim(learner->>'login')),l.name,'learner',l.pin_hash,nullif(learner->>'expiresAt','')::timestamptz) returning id into account_id;
  insert into public.academy_audit(actor_id,subject_id,action) values(actor.id,account_id,'learner.created');
  return jsonb_build_object('id',l.id,'login',lower(trim(learner->>'login')));
end $$;

create or replace function public.academy_admin_update(session_token text, learner_id uuid, changes jsonb)
returns void language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts;
begin
  actor:=public.academy_require_admin(session_token);
  if not exists(select 1 from public.learners where id=learner_id) then raise exception 'not_found'; end if;
  update public.learners set name=coalesce(changes->>'name',name),level=coalesce(changes->>'level',level),goal=coalesce(changes->>'goal',goal),
    tools=coalesce(changes->>'tools',tools),notes=coalesce(changes->>'notes',notes),locale=coalesce(changes->>'locale',locale),status=coalesce(changes->>'status',status)
  where id=learner_id;
  update public.academy_accounts set display_name=coalesce(changes->>'name',display_name),login=coalesce(lower(trim(changes->>'login')),login)
    ,access_expires_at=case when changes ? 'expiresAt' then nullif(changes->>'expiresAt','')::timestamptz else access_expires_at end
  where academy_accounts.learner_id=academy_admin_update.learner_id;
  if changes->>'status' in ('paused','archived') then delete from public.academy_sessions where account_id=learner_id; end if;
  insert into public.academy_audit(actor_id,subject_id,action,details) values(actor.id,learner_id,'learner.updated',jsonb_build_object('fields',array(select jsonb_object_keys(changes))));
end $$;

create or replace function public.academy_admin_reset_secret(session_token text, learner_id uuid, new_secret text)
returns void language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; hashed text;
begin
  actor:=public.academy_require_admin(session_token);
  if new_secret is null or length(new_secret) < 10 or octet_length(new_secret) > 72 then raise exception 'invalid_secret'; end if;
  if not exists(select 1 from public.learners where id=learner_id) then raise exception 'not_found'; end if;
  hashed:=extensions.crypt(new_secret,extensions.gen_salt('bf',10));
  update public.academy_accounts set secret_hash=hashed,enabled=true where academy_accounts.learner_id=academy_admin_reset_secret.learner_id;
  update public.learners set pin_hash=hashed,pin_visible=null where id=learner_id;
  delete from public.academy_sessions where account_id=learner_id;
  insert into public.academy_audit(actor_id,subject_id,action) values(actor.id,learner_id,'learner.secret_reset');
end $$;

-- Only reviewed session entry points are callable by the browser. Internal
-- helpers have no PUBLIC execute grant (PostgreSQL grants that by default).
revoke all on function public.academy_account_for_token(text),public.academy_require_admin(text) from public,anon,authenticated;
revoke all on function public.academy_authorize(text) from public;
grant execute on function public.academy_authorize(text) to anon,authenticated;
revoke all on function public.academy_session(text),public.academy_sign_in(text,text),public.academy_sign_out(text),public.academy_load_progress(text),public.academy_save_progress(text,jsonb,bigint),public.academy_admin_learners(text),public.academy_admin_create(text,jsonb,text),public.academy_admin_update(text,uuid,jsonb),public.academy_admin_reset_secret(text,uuid,text) from public;
grant execute on function public.academy_session(text),public.academy_sign_in(text,text),public.academy_sign_out(text),public.academy_load_progress(text),public.academy_save_progress(text,jsonb,bigint),public.academy_admin_learners(text),public.academy_admin_create(text,jsonb,text),public.academy_admin_update(text,uuid,jsonb),public.academy_admin_reset_secret(text,uuid,text) to anon,authenticated;
