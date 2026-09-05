create table if not exists public.academy_support_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.academy_accounts(id) on delete cascade,
  subject text not null check (length(trim(subject)) between 1 and 200),
  context text not null default '' check (length(context)<=4000),
  expected text not null default '' check (length(expected)<=4000),
  observed text not null default '' check (length(observed)<=4000),
  question_key text not null default '' check (length(question_key)<=200),
  project_id text not null default '' check (length(project_id)<=120),
  status text not null default 'open' check (status in ('open','answered','closed')),
  reply text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists academy_support_owner on public.academy_support_requests(owner_id,created_at desc);
create table if not exists public.academy_support_replies (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.academy_support_requests(id) on delete cascade,
  author_id uuid not null references public.academy_accounts(id),
  reply text not null check (length(trim(reply)) between 1 and 4000),
  created_at timestamptz not null default now()
);
alter table public.academy_support_requests enable row level security;
alter table public.academy_support_replies enable row level security;
revoke all on public.academy_support_requests,public.academy_support_replies from public,anon,authenticated;

create or replace function public.academy_support_create(session_token text, request jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; ticket_id uuid;
begin
  actor:=public.academy_account_for_token(session_token);
  if actor.id is null then raise exception 'session_expired'; end if;
  if jsonb_typeof(request) is distinct from 'object' then raise exception 'invalid_request'; end if;
  perform 1 from public.academy_accounts where id=actor.id for update;
  if (select count(*) from public.academy_support_requests where owner_id=actor.id and status<>'closed')>=100 then raise exception 'too_many_open_requests'; end if;
  insert into public.academy_support_requests(owner_id,subject,context,expected,observed,question_key,project_id)
  values(actor.id,trim(request->>'subject'),coalesce(request->>'context',''),coalesce(request->>'expected',''),coalesce(request->>'observed',''),coalesce(request->>'questionKey',''),coalesce(request->>'projectId','')) returning id into ticket_id;
  insert into public.academy_audit(actor_id,subject_id,action,details) values(actor.id,actor.id,'support.created',jsonb_build_object('requestId',ticket_id));
  return jsonb_build_object('id',ticket_id,'status','open');
end $$;

create or replace function public.academy_support_list(session_token text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; result jsonb;
begin
  actor:=public.academy_account_for_token(session_token);
  if actor.id is null then raise exception 'session_expired'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'ownerId',r.owner_id,'ownerName',a.display_name,'subject',r.subject,
    'context',r.context,'expected',r.expected,'observed',r.observed,'questionKey',r.question_key,'projectId',r.project_id,
    'status',r.status,'reply',r.reply,'createdAt',r.created_at,'updatedAt',r.updated_at,
    'replies',(select coalesce(jsonb_agg(jsonb_build_object('reply',m.reply,'author',author.display_name,'createdAt',m.created_at) order by m.created_at),'[]'::jsonb) from public.academy_support_replies m join public.academy_accounts author on author.id=m.author_id where m.request_id=r.id)
    ) order by r.updated_at desc),'[]'::jsonb)
  into result from public.academy_support_requests r join public.academy_accounts a on a.id=r.owner_id
  where actor.role='admin' or r.owner_id=actor.id;
  return result;
end $$;

create or replace function public.academy_support_reply(session_token text, request_id uuid, reply text, status text default 'answered')
returns void language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; owner uuid;
begin
  actor:=public.academy_require_admin(session_token);
  if reply is null or length(trim(reply)) not between 1 and 4000 or status not in ('open','answered','closed') then raise exception 'invalid_reply'; end if;
  select owner_id into owner from public.academy_support_requests where id=request_id for update;
  if owner is null then raise exception 'not_found'; end if;
  insert into public.academy_support_replies(request_id,author_id,reply) values(request_id,actor.id,reply);
  update public.academy_support_requests set reply=academy_support_reply.reply,status=academy_support_reply.status,updated_at=now() where id=request_id;
  insert into public.academy_audit(actor_id,subject_id,action,details) values(actor.id,owner,'support.replied',jsonb_build_object('requestId',request_id,'status',status));
end $$;
revoke all on function public.academy_support_create(text,jsonb),public.academy_support_list(text),public.academy_support_reply(text,uuid,text,text) from public;
grant execute on function public.academy_support_create(text,jsonb),public.academy_support_list(text),public.academy_support_reply(text,uuid,text,text) to anon,authenticated;
