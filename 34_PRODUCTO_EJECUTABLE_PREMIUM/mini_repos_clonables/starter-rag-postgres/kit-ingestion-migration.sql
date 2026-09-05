ALTER TABLE fragmentos ADD COLUMN IF NOT EXISTS embedding_json jsonb;
ALTER TABLE fragmentos ADD COLUMN IF NOT EXISTS modelo_vector text;

-- Run after the kit schema. Atomic replacement preserves the document FK.
create or replace function academy_replace_fragments(p_doc jsonb)
returns table(id_documento text,titulo text,coleccion text,dueno text,version text,apartado text,posicion int,texto text)
language plpgsql as $$
declare v_id text := p_doc->>'id_documento';
begin
 if coalesce(v_id,'')='' or jsonb_typeof(p_doc->'fragmentos') <> 'array' then
  raise exception 'invalid_document';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(v_id,0));
 insert into documentos(id,titulo,coleccion,dueno,version,vigente)
 values(v_id,p_doc->>'titulo',p_doc->>'coleccion',p_doc->>'dueno',p_doc->>'version',true)
 on conflict(id) do update set titulo=excluded.titulo,coleccion=excluded.coleccion,
 dueno=excluded.dueno,version=excluded.version,vigente=true;
 delete from fragmentos f where f.id_documento=v_id;
 insert into fragmentos(id_documento,apartado,posicion,texto,embedding_json,modelo_vector)
 select v_id,c->>'apartado',(c->>'posicion')::int,c->>'texto',c->'embedding_json',c->>'modelo_vector'
 from jsonb_array_elements(p_doc->'fragmentos') c;
 return query select d.id,d.titulo,d.coleccion,d.dueno,d.version,f.apartado,f.posicion,f.texto
 from documentos d join fragmentos f on f.id_documento=d.id
 where d.id=v_id order by f.posicion;
end; $$;
revoke all on function academy_replace_fragments(jsonb) from public;
-- Grant EXECUTE only to your private n8n ingestion role, if different from owner.

create or replace function academy_search_fragments(p_query jsonb,p_collection text,p_owner text,p_model text)
returns table(id_documento text,titulo text,apartado text,texto text,similarity double precision)
language sql stable as $$
 select d.id,d.titulo,f.apartado,f.texto,s.score
 from fragmentos f join documentos d on d.id=f.id_documento
 cross join lateral (
  select sum((a.v::text)::double precision*(b.v::text)::double precision) /
   nullif(sqrt(sum(power((a.v::text)::double precision,2))*sum(power((b.v::text)::double precision,2))),0) score
  from jsonb_array_elements(f.embedding_json) with ordinality a(v,i)
  join jsonb_array_elements(p_query) with ordinality b(v,i) on a.i=b.i
 ) s
 where d.vigente and d.coleccion=p_collection and d.dueno=p_owner
 and f.modelo_vector=p_model and jsonb_array_length(f.embedding_json)=jsonb_array_length(p_query)
 and s.score>=0.70
 order by s.score desc,f.id limit 6;
$$;
revoke all on function academy_search_fragments(jsonb,text,text,text) from public;
