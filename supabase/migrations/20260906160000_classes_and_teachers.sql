-- Optional teaching scope is independent of the superadministrator role.
-- Existing accounts and work remain unchanged; no teachers/classes are created automatically.
create table public.academy_teachers (
  account_id uuid primary key references public.academy_accounts(id) on delete cascade
);
create table public.academy_classes (
  id uuid primary key default gen_random_uuid(),
  name text not null check(length(trim(name)) between 1 and 120),
  teacher_id uuid references public.academy_teachers(account_id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.academy_enrollments (
  class_id uuid references public.academy_classes(id) on delete cascade,
  learner_id uuid references public.learners(id) on delete cascade,
  primary key(class_id,learner_id)
);
alter table public.academy_teachers enable row level security;
alter table public.academy_classes enable row level security;
alter table public.academy_enrollments enable row level security;
revoke all on public.academy_teachers,public.academy_classes,public.academy_enrollments from public,anon,authenticated;
create index academy_enrollments_learner on public.academy_enrollments(learner_id);
create index academy_classes_teacher on public.academy_classes(teacher_id);

create function public.academy_classes_list(session_token text)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; result jsonb;
begin
  actor:=public.academy_account_for_token(session_token);
  if actor.id is null or (actor.role<>'admin' and not exists(select 1 from public.academy_teachers where account_id=actor.id)) then raise exception 'not_allowed'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'teacherId',c.teacher_id,'teacherName',a.display_name,
    'students',coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'name',l.name,'status',l.status,'completedLessons',
      (select count(*) from jsonb_each(coalesce(p.state->'lessons','{}'::jsonb)) x where jsonb_typeof(x.value->'done')='array' and x.value->'done'<>'[]'::jsonb)))
      from public.academy_enrollments e join public.learners l on l.id=e.learner_id left join public.academy_progress p on p.account_id=l.id where e.class_id=c.id),'[]'::jsonb)) order by c.created_at),'[]'::jsonb)
  into result from public.academy_classes c left join public.academy_accounts a on a.id=c.teacher_id
  where actor.role='admin' or c.teacher_id=actor.id;
  return jsonb_build_object('classes',result,'teachers',case when actor.role='admin' then
    (select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'name',a.display_name)),'[]'::jsonb) from public.academy_teachers t join public.academy_accounts a on a.id=t.account_id)
    else '[]'::jsonb end);
end $$;

create function public.academy_classes_manage(session_token text, operation text, payload jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog as $$
declare actor public.academy_accounts; target uuid; person uuid;
begin
  actor:=public.academy_require_admin(session_token);
  target:=nullif(payload->>'classId','')::uuid;
  person:=nullif(payload->>'accountId','')::uuid;
  if operation='teacher_enable' then
    if not exists(select 1 from public.academy_accounts where id=person and role='learner' and enabled) then raise exception 'invalid_teacher'; end if;
    insert into public.academy_teachers values(person) on conflict do nothing;
  elsif operation='teacher_disable' then
    delete from public.academy_teachers where account_id=person;
  elsif operation='create' then
    insert into public.academy_classes(name,teacher_id) values(trim(payload->>'name'),nullif(payload->>'teacherId','')::uuid) returning id into target;
  elsif operation='update' then
    update public.academy_classes set name=coalesce(nullif(trim(payload->>'name'),''),name),
      teacher_id=case when payload ? 'teacherId' then nullif(payload->>'teacherId','')::uuid else teacher_id end where id=target;
    if not found then raise exception 'not_found'; end if;
  elsif operation='enroll' then
    insert into public.academy_enrollments values(target,(payload->>'learnerId')::uuid) on conflict do nothing;
  elsif operation='unenroll' then
    delete from public.academy_enrollments where class_id=target and learner_id=(payload->>'learnerId')::uuid;
  else raise exception 'invalid_operation'; end if;
  insert into public.academy_audit(actor_id,subject_id,action,details) values(actor.id,coalesce(target,person),'class.'||operation,payload);
  return jsonb_build_object('ok',true,'id',target);
end $$;
revoke all on function public.academy_classes_list(text),public.academy_classes_manage(text,text,jsonb) from public;
grant execute on function public.academy_classes_list(text),public.academy_classes_manage(text,text,jsonb) to anon,authenticated;

-- Enrich the verified session; the account role itself remains unchanged.
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
    'id',a.id,'name',a.display_name,'role',a.role,'isTeacher',exists(select 1 from public.academy_teachers where account_id=a.id),'level',coalesce(l.level,'intermedio'),
    'locale',coalesce(l.locale,'es'),'goal',coalesce(l.goal,''),'tools',coalesce(l.tools,'')),
    'progress',coalesce(p.state,'{"name":"","teacher":false,"preferredLevel":"basico","lessons":{},"projects":[]}'::jsonb),'version',coalesce(p.version,0));
end $$;
