-- Apply once before importing workflows 21 and 23. No existing rows are deleted
-- by this migration; replacing a document occurs only through an explicit ingest.
CREATE TABLE IF NOT EXISTS documentos_rag (
  id bigserial PRIMARY KEY, titulo text, origen text, idioma text, indice integer,
  trozo text, embedding text, embedding_estado text DEFAULT 'pendiente',
  creado_en timestamptz DEFAULT now()
);
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS source_hash text;
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS embedding_model text;
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS embedding_dimensions integer;
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS embedded_at timestamptz;
CREATE TABLE IF NOT EXISTS documentos_rag_version (
  origen text PRIMARY KEY, source_hash text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION academy_ingest_document(
  p_origen text, p_titulo text, p_idioma text, p_contenido text, p_chunks jsonb
) RETURNS TABLE(titulo text, origen text, trozos_guardados bigint, changed boolean)
LANGUAGE plpgsql AS $$
DECLARE v_hash text := md5(p_contenido); v_previous text; v_count bigint;
BEGIN
  IF p_origen IS NULL OR length(trim(p_origen)) = 0 OR jsonb_typeof(p_chunks) <> 'array' OR jsonb_array_length(p_chunks) = 0 THEN
    RAISE EXCEPTION 'Non-empty source and chunks are required';
  END IF;
  -- Serialize updates for the same source; retrying an unchanged document is a no-op.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_origen, 0));
  SELECT v.source_hash INTO v_previous FROM documentos_rag_version v WHERE v.origen=p_origen;
  IF v_previous = v_hash THEN
    SELECT count(*) INTO v_count FROM documentos_rag d WHERE d.origen=p_origen;
    RETURN QUERY SELECT p_titulo,p_origen,v_count,false;
    RETURN;
  END IF;
  DELETE FROM documentos_rag d WHERE d.origen=p_origen;
  INSERT INTO documentos_rag(titulo,origen,idioma,indice,trozo,source_hash,embedding_estado)
    SELECT p_titulo,p_origen,p_idioma,(c.value->>'indice')::integer,c.value->>'trozo',v_hash,'pendiente'
    FROM jsonb_array_elements(p_chunks) c;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  INSERT INTO documentos_rag_version VALUES(p_origen,v_hash,now())
    ON CONFLICT ON CONSTRAINT documentos_rag_version_pkey
    DO UPDATE SET source_hash=excluded.source_hash,updated_at=excluded.updated_at;
  RETURN QUERY SELECT p_titulo,p_origen,v_count,true;
END $$;
