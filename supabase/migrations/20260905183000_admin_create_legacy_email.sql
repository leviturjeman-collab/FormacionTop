-- Production compatibility for legacy learner tables where email is NOT NULL.
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
