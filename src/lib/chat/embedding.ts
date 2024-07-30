import { JinaEmbeddings } from "@langchain/community/embeddings/jina";
import { env } from "@/env.mjs";

const embeddings = new JinaEmbeddings({
  model: "jina-embeddings-v2-base-en",
  apiKey: env.JINA_API_KEY,
});

export async function generateDocEmbedding(contents: string[]) {
  const documentEmbeddings = await embeddings.embedDocuments(contents);
  return documentEmbeddings;
}
export async function generateQueyEmbedding(query: string) {
  const embedding = await embeddings.embedQuery(query);
  return embedding;
}
