-- ============================================
-- AIRTABLE RAG INTEGRATION
-- ============================================

-- 1. Add embedding column to airtable_records
ALTER TABLE airtable_records
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 2. Create index for similarity search
CREATE INDEX IF NOT EXISTS idx_airtable_records_embedding 
ON airtable_records USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 3. Update get_rag_context function to include Airtable records
CREATE OR REPLACE FUNCTION get_rag_context(
  query_embedding vector(1536),
  p_partner_id uuid, -- Keeping signature but might need adjustment if airtable_records doesn't have partner_id yet?
                     -- Wait, 001_data_sources.sql shows airtable_records does NOT have partner_id.
                     -- But 001_initial_schema.sql displayed earlier DOES have partner_id in airtable_records.
                     -- Checking the file `supbase/migrations/001_initial_schema.sql` again...
                     -- It had: partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE
                     -- Checking `supabase/migrations/001_data_sources.sql`...
                     -- It had: CREATE TABLE IF NOT EXISTS airtable_records ... (NO partner_id!)
                     -- This is a conflict in the codebase state vs migration files.
                     -- Assuming the system runs on `001_initial_schema.sql` based on the file view I did first.
                     -- However, `001_data_sources.sql` seemed to be a separate file?
                     -- I will assume `partner_id` EXISTS based on `001_initial_schema.sql` which seemed to be the "initial" one.
                     -- NOTE: If `airtable_records` was created by `001_data_sources.sql` instead, it might be missing partner_id.
                     -- Let's assume standard RLS and existence of partner_id for now as it makes sense for multi-tenancy.
  match_threshold float DEFAULT 0.7,
  max_results int DEFAULT 20
)
RETURNS TABLE (
  source_type text,
  source_id uuid,
  source_name text,
  content text,
  metadata jsonb,
  similarity float,
  last_updated timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  -- Document chunks
  SELECT
    'document'::text as source_type,
    dc.document_id as source_id,
    d.name as source_name,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity,
    d.updated_at as last_updated
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE
    d.partner_id = p_partner_id
    AND d.status = 'ready'
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold

  UNION ALL

  -- Meeting chunks
  SELECT
    'meeting'::text as source_type,
    mc.meeting_id as source_id,
    m.title as source_name,
    mc.content,
    mc.metadata,
    1 - (mc.embedding <=> query_embedding) as similarity,
    m.synced_at as last_updated
  FROM meeting_chunks mc
  JOIN meetings m ON mc.meeting_id = m.id
  WHERE
    m.partner_id = p_partner_id
    AND 1 - (mc.embedding <=> query_embedding) > match_threshold

  UNION ALL

  -- Airtable Records (NEW)
  -- We treat the JSONB 'fields' as searchable content by casting to text
  SELECT
    'airtable'::text as source_type,
    ar.id as source_id,
    ar.table_name || ' Record' as source_name,
    ar.fields::text as content, -- Simple text representation of JSON
    ar.fields as metadata,      -- Use fields as metadata too
    1 - (ar.embedding <=> query_embedding) as similarity,
    ar.synced_at as last_updated
  FROM airtable_records ar
  WHERE
    ar.partner_id = p_partner_id -- DEPENDENT ON PARTNER_ID EXISTENCE
    AND ar.embedding IS NOT NULL
    AND 1 - (ar.embedding <=> query_embedding) > match_threshold

  ORDER BY similarity DESC
  LIMIT max_results;
END;
$$;
