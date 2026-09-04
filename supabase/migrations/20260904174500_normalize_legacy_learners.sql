do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'learners' and column_name = 'pin'
  ) then
    execute 'update public.learners set pin_hash = extensions.crypt(pin::text, extensions.gen_salt(''bf'')) where pin is not null and pin::text <> ''''';
  end if;
end $$;

alter table public.learners drop constraint if exists learners_status_check;

update public.learners
set status = case status
  when 'activo' then 'active'
  when 'pausado' then 'paused'
  when 'archivado' then 'archived'
  else status
end;

alter table public.learners drop constraint if exists learners_level_check;
alter table public.learners add constraint learners_level_check check (level in ('basico', 'intermedio', 'avanzado'));

alter table public.learners drop constraint if exists learners_locale_check;
alter table public.learners add constraint learners_locale_check check (locale in ('es', 'en'));

alter table public.learners add constraint learners_status_check check (status in ('active', 'paused', 'archived'));
