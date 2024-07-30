import { CHAT_PROMPT, RELATED_QUESTION_PROMPT, TRANSLATE } from "./prompts";
// import { OpenAI } from "@langchain/openai";
// import type { AIMessageChunk } from "@langchain/core/messages";
// import { concat } from "@langchain/core/utils/stream";
import { streamText, generateText, generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import z from "zod";
import { containsChinese } from "../utils";
import { env } from "@/env.mjs";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_API_URL,
});

function documentToStr(doc) {
  const { metadata, chunk_text, screenshot_url } = doc;
  return `Title: ${metadata.title}\nURL: ${metadata.url}\nScreenshotUrl: ${screenshot_url}\nSummary: ${chunk_text}`;
}

function formatContext(searchResults) {
  return searchResults
    .map((result, index) => `Citation ${index + 1}. ${documentToStr(result)}`)
    .join("\n\n");
}

export const formatePrompt = (contexts, query) =>
  CHAT_PROMPT(formatContext(contexts), query);

export async function genLLMTextChunk({ query, contexts }) {
  const prompt = formatePrompt(contexts, query);
  const model = openai("gpt-4o-mini");
  const result = await streamText({
    model: model,
    prompt: prompt,
  });
  return result;
}

export async function genRelatedQuery({ query, contexts }) {
  const prompt = RELATED_QUESTION_PROMPT(
    JSON.stringify(contexts).slice(0, 4000),
    query
  );
  const model = openai("gpt-4o-mini");
  const result = await generateObject({
    model,
    prompt,
    schema: z.object({
      items: z.array(z.string()).length(3),
    }),
  });
  return result.object.items;
}

export async function translate({ query }) {
  if (!containsChinese(query)) {
    return query;
  }
  const prompt = TRANSLATE(query);
  const model = openai("gpt-4o-mini");
  const { text } = await generateText({
    model,
    prompt,
  });
  return text;
}
