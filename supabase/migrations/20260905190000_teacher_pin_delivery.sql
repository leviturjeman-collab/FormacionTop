-- PIN delivery is restricted to verified teachers. No browser role can read
-- the encrypted PINs or encryption key directly.
create table public.academy_pin_key (
  singleton boolean primary key default true check (singleton),
  secret text not null
);
insert into public.academy_pin_key(secret) values(encode(extensions.gen_random_bytes(32),'hex'));
create table public.academy_learner_pins (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  encrypted_pin bytea not null
);
alter table public.academy_pin_key enable row level security;
alter table public.academy_learner_pins enable row level security;
revoke all on public.academy_pin_key,public.academy_learner_pins from public,anon,authenticated;

create function public.academy_forget_old_pin() returns trigger
language plpgsql security definer set search_path=pg_catalog as $$
begin
  if new.secret_hash is distinct from old.secret_hash then
    delete from public.academy_learner_pins where learner_id=new.learner_id;
  end if;
  return new;
end $$;
revoke all on function public.academy_forget_old_pin() from public,anon,authenticated;
create trigger academy_forget_old_pin after update of secret_hash on public.academy_accounts
for each row execute function public.academy_forget_old_pin();

create function public.academy_admin_issue_pin(session_token text, learner_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; generated text; secret_key text;
begin
  actor:=public.academy_require_admin(session_token);
  if not exists(select 1 from public.academy_accounts a where a.learner_id=academy_admin_issue_pin.learner_id and a.role='learner') then raise exception 'not_found'; end if;
  -- Twelve decimal digits, generated server-side; avoid collisions with every account.
  loop
    generated:=lpad((('x'||encode(extensions.gen_random_bytes(6),'hex'))::bit(48)::bigint % 1000000000000)::text,12,'0');
    exit when not exists(select 1 from public.academy_accounts where code_digest=encode(extensions.digest(generated,'sha256'),'hex'));
  end loop;
  perform public.academy_admin_reset_secret(session_token,learner_id,generated);
  select secret into secret_key from public.academy_pin_key where singleton;
  insert into public.academy_learner_pins values(learner_id,extensions.pgp_sym_encrypt(generated,secret_key,'cipher-algo=aes256'))
  on conflict on constraint academy_learner_pins_pkey do update set encrypted_pin=excluded.encrypted_pin;
  return jsonb_build_object('pin',generated);
end $$;

create function public.academy_admin_issue_learner(session_token text, learner jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; created jsonb; issued jsonb;
begin
  actor:=public.academy_require_admin(session_token);
  if nullif(trim(learner->>'name'),'') is null or length(learner->>'name')>120 then raise exception 'invalid_name'; end if;
  created:=public.academy_admin_create(session_token,learner || jsonb_build_object('login','student-'||extensions.gen_random_uuid()),encode(extensions.gen_random_bytes(24),'hex'));
  issued:=public.academy_admin_issue_pin(session_token,(created->>'id')::uuid);
  return created || issued;
end $$;

create function public.academy_admin_reveal_pin(session_token text, learner_id uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; revealed text;
begin
  actor:=public.academy_require_admin(session_token);
  select extensions.pgp_sym_decrypt(p.encrypted_pin,k.secret) into revealed
  from public.academy_learner_pins p cross join public.academy_pin_key k
  where p.learner_id=academy_admin_reveal_pin.learner_id and k.singleton;
  insert into public.academy_audit(actor_id,subject_id,action) values(actor.id,learner_id,'learner.pin_viewed');
  return jsonb_build_object('pin',revealed);
end $$;
revoke all on function public.academy_admin_issue_pin(text,uuid),public.academy_admin_issue_learner(text,jsonb),public.academy_admin_reveal_pin(text,uuid) from public;
grant execute on function public.academy_admin_issue_pin(text,uuid),public.academy_admin_issue_learner(text,jsonb),public.academy_admin_reveal_pin(text,uuid) to anon,authenticated;
