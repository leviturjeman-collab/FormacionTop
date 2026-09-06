-- Run inside a transaction and roll back. No real accounts are changed.
do $$
declare aid uuid; t1 jsonb; t2 jsonb; pupil jsonb; c1 jsonb; c2 jsonb; result jsonb; token1 text; token2 text; pupil_token text; denied boolean;
begin
  insert into public.academy_accounts(login,display_name,role,secret_hash) values('qa-classes-'||gen_random_uuid(),'QA classes admin','admin','unused') returning id into aid;
  insert into public.academy_sessions(token_hash,account_id) values(encode(extensions.digest(repeat('a',64),'sha256'),'hex'),aid);
  t1:=public.academy_admin_issue_learner(repeat('a',64),'{"name":"QA class teacher one"}');
  t2:=public.academy_admin_issue_learner(repeat('a',64),'{"name":"QA class teacher two"}');
  pupil:=public.academy_admin_issue_learner(repeat('a',64),'{"name":"QA class pupil"}');
  perform public.academy_classes_manage(repeat('a',64),'teacher_enable',jsonb_build_object('accountId',t1->>'id'));
  perform public.academy_classes_manage(repeat('a',64),'teacher_enable',jsonb_build_object('accountId',t2->>'id'));
  token1:=public.academy_sign_in_code(t1->>'pin')->>'token';
  token2:=public.academy_sign_in_code(t2->>'pin')->>'token';
  pupil_token:=public.academy_sign_in_code(pupil->>'pin')->>'token';
  if public.academy_session(token1)->'profile'->>'isTeacher'<>'true' then raise exception 'teacher not in verified profile'; end if;
  c1:=public.academy_classes_manage(repeat('a',64),'create',jsonb_build_object('name','QA first','teacherId',t1->>'id'));
  c2:=public.academy_classes_manage(repeat('a',64),'create',jsonb_build_object('name','QA second','teacherId',t2->>'id'));
  perform public.academy_classes_manage(repeat('a',64),'enroll',jsonb_build_object('classId',c1->>'id','learnerId',pupil->>'id'));
  perform public.academy_classes_manage(repeat('a',64),'enroll',jsonb_build_object('classId',c1->>'id','learnerId',pupil->>'id'));
  result:=public.academy_classes_list(token1);
  if jsonb_array_length(result->'classes')<>1 or result->'classes'->0->>'id'<>c1->>'id' or jsonb_array_length(result->'classes'->0->'students')<>1 then raise exception 'class scope or duplicate enrollment failed'; end if;
  if result::text like '%pin%' or result::text like '%secret%' or result::text like '%notes%' then raise exception 'private fields exposed'; end if;
  if public.academy_classes_list(token2)->'classes'->0->>'id'<>c2->>'id' then raise exception 'second teacher scope failed'; end if;
  denied:=false;
  begin perform public.academy_classes_list(pupil_token); exception when others then if sqlerrm='not_allowed' then denied:=true; else raise; end if; end;
  if not denied then raise exception 'learner could list classes'; end if;
  denied:=false;
  begin perform public.academy_classes_manage(token1,'enroll',jsonb_build_object('classId',c2->>'id','learnerId',pupil->>'id')); exception when others then if sqlerrm='not_allowed' then denied:=true; else raise; end if; end;
  if not denied then raise exception 'teacher could manage classes'; end if;
  denied:=false;
  begin perform public.academy_admin_reveal_pin(token1,(pupil->>'id')::uuid); exception when others then if sqlerrm='not_allowed' then denied:=true; else raise; end if; end;
  if not denied then raise exception 'teacher could reveal PIN'; end if;
  perform public.academy_classes_manage(repeat('a',64),'teacher_disable',jsonb_build_object('accountId',t1->>'id'));
  denied:=false;
  begin perform public.academy_classes_list(token1); exception when others then if sqlerrm='not_allowed' then denied:=true; else raise; end if; end;
  if not denied then raise exception 'revoked teacher retained access'; end if;
end $$;
select 'PASS: isolated classes, duplicate enrollment, verified teacher flag, learner denial, teacher management/PIN denial, revocation' as result;
