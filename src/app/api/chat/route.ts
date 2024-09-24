// app/api/stream/route.ts

import { embeddingVectorCacheKey, llmResultCacheKey, redis } from "@/db/redis";
import { createClient } from '@supabase/supabase-js'
import { generateQueyEmbedding } from "@/lib/chat/embedding";
import { genLLMTextChunk, translate } from "@/lib/chat/llm";
import { addRefToUrl, genStream, sleep } from "@/lib/utils";
import { StreamEvent } from "@/schema/chat";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Přidejte tuto funkci pro testování připojení
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('healthcareprovidors').select('*').limit(1)
    if (error) throw error
    console.log('Úspěšné připojení k Supabase:', data)
  } catch (error) {
    console.error('Chyba při připojení k Supabase:', error)
  }
}

export async function POST(req: NextRequest) {
  await testSupabaseConnection()
  const body = await req.json();
  const { query } = body;

  const customReadable = new ReadableStream({
    async start(controller) {
      try {
        const beginData = {
          event: StreamEvent.BEGIN_STREAM,
          data: { event_type: StreamEvent.BEGIN_STREAM, query: query },
        };
        controller.enqueue(genStream(beginData));
        const cacheResult: null | any = await redis.get(
          embeddingVectorCacheKey(query)
        );

        let documents: any[], queryEmbeddingError: PostgrestError;

        if (cacheResult) {
          documents = cacheResult;
          console.log("search result", "cached");
        } else {
          // match documents
          const embedding = await generateQueyEmbedding(
            await translate({ query })
          );

          let result;
          try {
            console.log("Volání match_embeddings s parametry:", {
              query_embedding: embedding,
              match_threshold: 0.78,
              match_count: 15,
            });
            result = await supabase.rpc("match_embeddings", {
              query_embedding: embedding,
              match_threshold: 0.78,
              match_count: 15,
            });
            console.log("Výsledek volání match_embeddings:", JSON.stringify(result, null, 2));
            if (result.error) throw result.error;
            documents = result.data;
          } catch (error) {
            console.error("Chyba při volání match_embeddings:", JSON.stringify(error, null, 2));
            controller.enqueue(
              genStream({
                event: StreamEvent.ERROR,
                data: {
                  event_type: StreamEvent.ERROR,
                  detail: "Chyba při vyhledávání relevantních dokumentů. Prosím, zkuste to znovu později.",
                },
              })
            );
            return; // Ukončete funkci zde, aby se nepokračovalo s prázdnými dokumenty
          }
        }

        if (queryEmbeddingError) {
          console.error(queryEmbeddingError);
          controller.enqueue(
            genStream({
              event: StreamEvent.ERROR,
              data: {
                event_type: StreamEvent.ERROR,
                detail: "error on query embeddings",
              },
            })
          );
          return; // Místo controller.close() použijte return
        }
        redis.setex(
          embeddingVectorCacheKey(query),
          60 * 60 * 24, // 1 day
          JSON.stringify(documents)
        );
        // filter for unique docs
        const uniqueDocuments = documents && documents.length > 0
          ? [...new Set(documents.map((tool) => tool.metadata.url))]
            .map((url) => documents.find((tool) => tool.metadata.url === url))
          : [];

        for (let doc of uniqueDocuments) {
          doc.metadata.url = addRefToUrl(doc.metadata.url);
        }

        documents = uniqueDocuments.slice(0, 5);

        const searchResult = documents.map((d) => {
          return {
            title: d.nazevzarizeni,
            url: d.poskytovatelweb,
            description: `${d.druhzarizeni} - ${d.oborpece}`,
            address: `${d.ulice} ${d.cislodomovniorientacni}, ${d.obec}, ${d.psc}`,
            contact: {
              phone: d.poskytovateltelefon,
              email: d.poskytovateljmail,
            },
            specialization: {
              formapece: d.formapece,
              druhpece: d.druhpece,
              odbornyzastupce: d.odbornyzastupce,
            },
            region: {
              kraj: d.kraj,
              okres: d.okres,
            },
            ico: d.ico,
          };
        });

        controller.enqueue(
          genStream({
            event: StreamEvent.SEARCH_RESULTS,
            data: {
              event_type: StreamEvent.SEARCH_RESULTS,
              results: searchResult.map((result) => ({
                ...result,
                content: result.description, // Přidání chybějící vlastnosti content
              })),
              images: uniqueDocuments.map((r) => r.screenshot_url),
            },
          })
        );
        // stream llm text chunk
        const llmKey = llmResultCacheKey(query);
        const llmCache: string | null = await redis.get(llmKey);
        let gathered = "";
        if (llmCache) {
          console.log("llm result cache", "cached");
          gathered = llmCache;
          // simulate stream
          let cacheArray = llmCache.split(" ");
          for await (const c of cacheArray) {
            await sleep(10);
            controller.enqueue(
              genStream({
                event: StreamEvent.TEXT_CHUNK,
                data: {
                  event_type: StreamEvent.TEXT_CHUNK,
                  text: c + " ",
                },
              })
            );
          }
        } else {
          const stream = await genLLMTextChunk({
            query,
            contexts: documents,
          });
          for await (const chunk of stream.textStream) {
            controller.enqueue(
              genStream({
                event: StreamEvent.TEXT_CHUNK,
                data: {
                  event_type: StreamEvent.TEXT_CHUNK,
                  text: chunk,
                },
              })
            );
            gathered += chunk;
          }
        }
        redis.setex(llmKey, 60 * 60 * 12, gathered);
        // more results or related query
        const moreTools = uniqueDocuments.slice(5);
        controller.enqueue(
          genStream({
            event: StreamEvent.MORE_RESULTS,
            data: {
              event_type: StreamEvent.MORE_RESULTS,
              more_results: moreTools.map((d) => ({
                title: d.metadata.title,
                url: d.metadata.url,
                screenshot_url: d.screenshot_url,
              })),
            },
          })
        );

        controller.enqueue(
          genStream({
            event: StreamEvent.FINAL_RESPONSE,
            data: {
              event_type: StreamEvent.FINAL_RESPONSE,
              message: gathered,
            },
          })
        );

        controller.enqueue(
          genStream({
            event: StreamEvent.STREAM_END,
            data: { event_type: StreamEvent.STREAM_END, thread_id: null },
          })
        );

        controller.close();
      } catch (error) {
        console.error(error);
        controller.enqueue(
          genStream({
            event: StreamEvent.ERROR,
            data: {
              event_type: StreamEvent.ERROR,
              detail: "Oops~",
            },
          })
        );
        controller.close();
      }
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}