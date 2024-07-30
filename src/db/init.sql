CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- content table
CREATE TABLE aitools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  content TEXT,
  screenshot_url TEXT,
  full_content TEXT,
  detail TEXT,
  cat TEXT,
  ext_info JSONB,
  total_visits_last_three_months INT,
  visits_last_month INT,
  bounce_rate DECIMAL,
  page_per_visit DECIMAL,
  time_on_site DECIMAL,
  traffic_detail JSON;
);
-- chunk table
CREATE TABLE aitools_chunk (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chunk_text TEXT,
  metadata JSONB,
  tool_id UUID NOT NULL,
  embedding vector(768),
  FOREIGN KEY (tool_id) REFERENCES aitools(id)
);

--  hnsw index for query performance
create index on aitools_chunk using hnsw (embedding vector_l2_ops);

-- rpc function for supabase client
create or replace function match_embeddings (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id UUID,
  metadata JSONB,
  tool_id text,
  chunk_text text,
  similarity float,
  screenshot_url text
)
language sql stable
as $$
  select
    aitools_chunk.id,
    aitools_chunk.metadata,
    aitools_chunk.tool_id,
    aitools_chunk.chunk_text,
    1 - (aitools_chunk.embedding <=> query_embedding) as similarity,
    aitools.screenshot_url
  from aitools_chunk
  join aitools on aitools_chunk.tool_id = aitools.id
  where 1 - (aitools_chunk.embedding <=> query_embedding) > match_threshold
  order by (aitools_chunk.embedding <=> query_embedding) asc
  limit match_count;
$$;

