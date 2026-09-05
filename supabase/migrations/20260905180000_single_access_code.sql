-- Existing bcrypt hashes cannot be converted to a lookup digest. Reset those
-- credentials explicitly; the compatibility identifier RPC remains available.
alter table public.academy_accounts add column if not exists code_digest text;

create or replace function public.academy_sign_in_code(access_code text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare identifier text; fingerprint text; attempt public.academy_attempts;
begin
  if access_code is null or length(access_code)<4 or octet_length(access_code)>72 then return jsonb_build_object('ok',false,'error','invalid_credentials'); end if;
  fingerprint:=encode(extensions.digest(access_code,'sha256'),'hex');
  select login into identifier from public.academy_accounts where code_digest=fingerprint;
  if identifier is not null then return public.academy_sign_in(identifier,access_code); end if;
  -- Unknown codes have bounded repeated attempts too. Infrastructure must also
  -- impose per-IP limits, since random guesses cannot share an account bucket.
  delete from public.academy_attempts where window_start<now()-interval '1 day';
  insert into public.academy_attempts(identifier_hash) values(fingerprint) on conflict do nothing;
  select * into attempt from public.academy_attempts where identifier_hash=fingerprint for update;
  if attempt.window_start<now()-interval '15 minutes' then
    update public.academy_attempts set attempts=0,window_start=now() where identifier_hash=fingerprint;
    attempt.attempts:=0;
  end if;
  if attempt.attempts>=5 then return jsonb_build_object('ok',false,'error','rate_limited'); end if;
  update public.academy_attempts set attempts=attempts+1 where identifier_hash=fingerprint;
  return jsonb_build_object('ok',false,'error','invalid_credentials');
end $$;
revoke all on function public.academy_sign_in_code(text) from public;
grant execute on function public.academy_sign_in_code(text) to anon,authenticated;

-- Owner-only provisioning; never callable with a browser key or session.
create or replace function public.academy_bootstrap_admin(account_login text, account_name text, access_code text)
returns uuid language plpgsql security definer set search_path=pg_catalog as $$
declare provisioned_id uuid;
begin
  if access_code is null or length(access_code)<4 or octet_length(access_code)>72 then raise exception 'invalid_secret'; end if;
  if exists(select 1 from public.academy_accounts where login=lower(trim(account_login)) and role<>'admin') then raise exception 'login_taken'; end if;
  insert into public.academy_accounts(login,display_name,role,secret_hash,code_digest)
  values(lower(trim(account_login)),trim(account_name),'admin',extensions.crypt(access_code,extensions.gen_salt('bf',10)),encode(extensions.digest(access_code,'sha256'),'hex'))
  on conflict(login) do update set display_name=excluded.display_name,secret_hash=excluded.secret_hash,code_digest=excluded.code_digest,enabled=true
  returning id into provisioned_id;
  delete from public.academy_sessions where academy_sessions.account_id=provisioned_id;
  return provisioned_id;
end $$;
revoke all on function public.academy_bootstrap_admin(text,text,text) from public,anon,authenticated;

-- Convert currently visible learner codes into one-field access codes, then
-- erase the reversible copy. A duplicate code fails at the unique index.
update public.academy_accounts a
set secret_hash=extensions.crypt(l.pin_visible,extensions.gen_salt('bf',10)),
    code_digest=encode(extensions.digest(l.pin_visible,'sha256'),'hex'),
    enabled=true
from public.learners l
where a.learner_id=l.id and l.pin_visible is not null and length(l.pin_visible)>=4 and octet_length(l.pin_visible)<=72;

create unique index if not exists academy_accounts_code_unique on public.academy_accounts(code_digest) where code_digest is not null;

update public.learners set pin_visible=null where pin_visible is not null;

create or replace function public.academy_admin_create(session_token text, learner jsonb, initial_secret text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; l public.learners; account_id uuid; account_login text;
begin
  actor:=public.academy_require_admin(session_token);
  if initial_secret is null or length(initial_secret) < 4 or octet_length(initial_secret) > 72 then raise exception 'invalid_secret'; end if;
  account_login:=lower(trim(learner->>'login'));
  insert into public.learners(name,email,pin_hash,level,goal,tools,notes,locale,status)
  values(trim(learner->>'name'),coalesce(nullif(trim(coalesce(learner->>'email','')),''),account_login || '@academy.local'),extensions.crypt(initial_secret,extensions.gen_salt('bf',10)),coalesce(learner->>'level','basico'),
    coalesce(learner->>'goal',''),coalesce(learner->>'tools',''),coalesce(learner->>'notes',''),coalesce(learner->>'locale','es'),coalesce(nullif(learner->>'status',''),'active')) returning * into l;
  insert into public.academy_accounts(id,learner_id,login,display_name,role,secret_hash,access_expires_at,code_digest)
  values(l.id,l.id,account_login,l.name,'learner',l.pin_hash,nullif(learner->>'expiresAt','')::timestamptz,encode(extensions.digest(initial_secret,'sha256'),'hex')) returning id into account_id;
  insert into public.academy_audit(actor_id,subject_id,action) values(actor.id,account_id,'learner.created');
  return jsonb_build_object('id',l.id,'login',account_login);
end $$;

create or replace function public.academy_admin_reset_secret(session_token text, learner_id uuid, new_secret text)
returns void language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; hashed text;
begin
  actor:=public.academy_require_admin(session_token);
  if new_secret is null or length(new_secret) < 4 or octet_length(new_secret) > 72 then raise exception 'invalid_secret'; end if;
  if not exists(select 1 from public.learners where id=learner_id) then raise exception 'not_found'; end if;
  hashed:=extensions.crypt(new_secret,extensions.gen_salt('bf',10));
  update public.academy_accounts set secret_hash=hashed,enabled=true,code_digest=encode(extensions.digest(new_secret,'sha256'),'hex') where academy_accounts.learner_id=academy_admin_reset_secret.learner_id;
  update public.learners set pin_hash=hashed,pin_visible=null where id=learner_id;
  delete from public.academy_sessions where account_id=learner_id;
  insert into public.academy_audit(actor_id,subject_id,action) values(actor.id,learner_id,'learner.secret_reset');
end $$;


-- Four-character access codes are an explicit academy requirement.
create or replace function public.academy_sign_in(login_identifier text, login_secret text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare identifier text:=lower(trim(login_identifier)); bucket text; attempt public.academy_attempts;
  a public.academy_accounts; raw_token text; response jsonb;
begin
  if identifier is null or length(identifier) not between 3 and 120 or login_secret is null or length(login_secret) < 4 or octet_length(login_secret) > 72 then
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

