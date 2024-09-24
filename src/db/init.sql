CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Upravíme tabulku healthcareprovidors
CREATE TABLE IF NOT EXISTS healthcareprovidors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  nazevzarizeni TEXT,
  druhzarizeni TEXT,
  obec TEXT,
  psc BIGINT,
  ulice TEXT,
  cislodomovniorientacni TEXT,
  kraj TEXT,
  okres TEXT,
  poskytovateltelefon TEXT,
  poskytovateljfax TEXT,
  poskytovateljmail TEXT,
  poskytovatelweb TEXT,
  ico BIGINT,
  oborpece TEXT,
  formapece TEXT,
  druhpece TEXT,
  odbornyzastupce TEXT,
  embedding vector(768)
);

-- Vytvoříme index pro vektorové vyhledávání
CREATE INDEX IF NOT EXISTS healthcareprovidors_embedding_idx ON healthcareprovidors USING hnsw (embedding vector_l2_ops);

-- Upravíme funkci match_embeddings
CREATE OR REPLACE FUNCTION match_embeddings (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  nazevzarizeni TEXT,
  druhzarizeni TEXT,
  obec TEXT,
  psc BIGINT,
  ulice TEXT,
  cislodomovniorientacni TEXT,
  kraj TEXT,
  okres TEXT,
  poskytovateltelefon TEXT,
  poskytovateljmail TEXT,
  poskytovatelweb TEXT,
  ico BIGINT,
  oborpece TEXT,
  formapece TEXT,
  druhpece TEXT,
  odbornyzastupce TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    healthcareprovidors.id,
    healthcareprovidors.nazevzarizeni,
    healthcareprovidors.druhzarizeni,
    healthcareprovidors.obec,
    healthcareprovidors.psc,
    healthcareprovidors.ulice,
    healthcareprovidors.cislodomovniorientacni,
    healthcareprovidors.kraj,
    healthcareprovidors.okres,
    healthcareprovidors.poskytovateltelefon,
    healthcareprovidors.poskytovateljmail,
    healthcareprovidors.poskytovatelweb,
    healthcareprovidors.ico,
    healthcareprovidors.oborpece,
    healthcareprovidors.formapece,
    healthcareprovidors.druhpece,
    healthcareprovidors.odbornyzastupce,
    1 - (healthcareprovidors.embedding <=> query_embedding) AS similarity
  FROM healthcareprovidors
  WHERE 1 - (healthcareprovidors.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

