# DiscovAI

An AI-powered search engine for AI tools, or your own data.

https://qdrctcpzdjkxzhkrespm.supabase.co/storage/v1/object/public/f/video/discovai-demo.mp4

Please feel free to contact me on [Twitter](https://x.com/ruiyanghim) or [create an issue](https://github.com/DiscovAI/DiscovAI-search/issues/new) if you have any questions.

## 💻 Live Demo

[DiscovAI.io](https://discovai.io/) (use it for free without signin or credit card)

## 🗂️ Overview

- 🛠 [Features](#-features)
- 🧱 [Tech-Stack](#-stack)
- 🚀 [Quickstart](#-quickstart)
- 🌐 [Deploy](#-deploy)

## 🛠 Features

- **Vector-based Search**: Converts user queries into vectors for precise similarity matching in our AI product database.

- **Redis-powered Caching**: Utilizes Redis to cache search results and outputs, significantly improving response times for repeated queries.

- **Comprehensive AI Database**: Maintains an up-to-date collection of AI products across various categories and industries.

- **LLM-powered Responses**: Leverages large language models to provide detailed, context-aware answers based on search results.

- **User-friendly Interface**: Offers an intuitive design for effortless navigation and efficient AI product discovery.

## 🧱 Stack

- App framework: [Next.js](https://nextjs.org/)
- Text streaming: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- LLM Model: [gpt-4o-mini](https://openai.com/)
- Database: [Supabase](https://supabase.com/)
- Vector: [Pgvector](https://github.com/pgvector/pgvector)
- Embedding Model: [Jina AI](https://jina.ai/embeddings)
- Redis Cache: [Upstash](https://upstash.com/)
- Component library: [shadcn/ui](https://ui.shadcn.com/)
- Headless component primitives: [Radix UI](https://www.radix-ui.com/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Quickstart

### 1. Clone repo

run the following command to clone the repo:

```
git clone https://github.com/DiscovAI/DiscovAI-search
```

### 2. Install dependencies

```
cd discovai-search
pnpm i
```

### 3. Setting up Supabase

create a supabase [project](https://supabase.com/dashboard/projects), then run the src/db/init.sql in [SQL Editor](https://supabase.com/docs/guides/database/overview) to setup database

### 4. Setting up Upstash

Follow the guide below to set up Upstash Redis. Create a database and obtain `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Refer to the [Upstash guide](https://upstash.com/blog/rag-chatbot-upstash#setting-up-upstash-redis) for instructions on how to proceed.

### 4. Fill out secrets

```
cp .env.local.example .env.local
```

Your .env.local file should look like this:

```
# Required

# for match documents
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# for embedding query, retrieved here: https://jina.ai/embeddings/
JINA_API_KEY=

# for llm output, retrieved here: https://platform.openai.com/api-keys
OPENAI_API_KEY=
OPENAI_API_URL=

# for llm cache and serach cache
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 5. Run app locally

```
pnpm dev
```

You can now visit http://localhost:3000.

## 🌐 Deploy

You can deploy on any saas platform like vercel, zeabur, cloudflare pages.
