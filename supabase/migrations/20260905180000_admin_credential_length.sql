-- Allow an individually configured four-character credential for the admin account.
-- The credential remains hashed and verified; this migration creates no account or password.
create or replace function public.academy_sign_in(login_identifier text, login_secret text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare identifier text:=lower(trim(login_identifier)); bucket text; attempt public.academy_attempts;
  a public.academy_accounts; raw_token text; response jsonb;
begin
  if identifier is null or length(identifier) not between 3 and 120 or login_secret is null or length(login_secret) < (case when identifier='admin' then 4 else 10 end) or octet_length(login_secret) > 72 then
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
  if length(login_secret)<10 and a.role<>'admin' then
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
