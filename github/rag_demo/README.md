> 📦 [Kedhareswer/rag_demo](https://github.com/Kedhareswer/rag_demo) · ⭐ 0 · TypeScript · updated 2025-11-30  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Gemini RAG Demo

> A Next.js chatbot demonstrating semantic search and retrieval-augmented generation (RAG) using Google Gemini and the Vercel AI SDK

## Overview

This application showcases how to build a knowledge-based chatbot using modern AI technologies. Simply paste facts or documentation into the chat, and the system will intelligently chunk, embed, and store them in a vector database. When you ask questions, the app performs semantic search to retrieve relevant information and generates accurate, context-aware responses.

### Key Features

- **Semantic Search** - Cosine similarity-based retrieval of relevant information
- **Vector Embeddings** - Automatic chunking and embedding via Google Gemini embedding models
- **RAG Architecture** - Answers grounded in your stored knowledge base
- **PostgreSQL Vector Storage** - Powered by Neon with pgvector extension
- **Real-time Streaming** - Instant AI responses with streaming support

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **AI SDK**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google`)
- **LLM**: Google Gemini (`models/gemini-2.5-flash-lite`)
- **Embeddings**: Google Gemini (`models/gemini-embedding-001`)
- **Database**: Neon PostgreSQL with pgvector
- **ORM**: Drizzle ORM
- **UI**: Tailwind CSS + Radix UI components

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Vercel CLI (`pnpm i -g vercel`)
- A Vercel account

### Installation

**1. Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-gateway-embeddings-demo&project-name=ai-gateway-embeddings&repository-name=ai-gateway-embeddings&demo-title=AI%20Gateway%20Embeddings%20Demo&demo-description=A%20simple%20Next.js%20chatbot%20app%20to%20demonstrate%20the%20use%20of%20embedding%20models%20for%20RAG%20through%20the%20Vercel%20AI%20Gateway&demo-url=https%3A%2F%2Fai-gateway-embeddings-demo.labs.vercel.dev&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%5D)

**2. Clone and Setup**

```bash
# Clone your deployed repository
git clone <your-repo-url>
cd <your-repo-name>

# Link to Vercel project
vercel link

# Pull environment variables
vercel env pull

# Install dependencies
pnpm install
```

**3. Database Setup**

```bash
# Run migrations
pnpm db:migrate
pnpm db:push
```

**4. Start Development Server**

```bash
# Using Vercel CLI (recommended - auto-refreshes OIDC token)
vercel dev

# Or use standard Next.js dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### 1. Adding Knowledge

When you paste content into the chat:
- Text is chunked into sentences
- Each chunk is embedded using Google Gemini's `models/gemini-embedding-001` via the Vercel AI SDK
- Embeddings are stored as vectors in Neon PostgreSQL

### 2. Asking Questions

When you ask a question:
- Your query is embedded using the same Gemini embedding model
- A cosine similarity search finds the most relevant chunks (threshold: 0.5)
- Top 4 results are retrieved and passed to the Gemini chat model (`models/gemini-2.5-flash-lite`)
- The model answers using only the retrieved context

### Example Usage

```
User: "Our return window is 30 days and shipping to the US is free."
Bot: "Resource successfully created and embedded."

User: "Do you offer month-long refunds?"
Bot: "Yes, our return window is 30 days."

User: "Is shipping to San Francisco free?"
Bot: "Yes, shipping to the US is free."
```

## Configuration

### Environment Variables

Core variables used by this demo:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API key used by the AI SDK Google provider

### Database Commands

```bash
pnpm db:generate    # Generate migrations
pnpm db:migrate     # Run migrations
pnpm db:push        # Push schema changes
pnpm db:studio      # Open Drizzle Studio
pnpm db:drop        # Drop migrations
```

## FAQ

**Q: Which models does this demo use?**
A: Chat uses `models/gemini-2.5-flash-lite` and embeddings use `models/gemini-embedding-001`, both via the `@ai-sdk/google` provider.

**Q: Where do I put my Gemini API key?**
A: Set `GOOGLE_GENERATIVE_AI_API_KEY` in your `.env` file (or in your deployment environment variables).

**Q: Can I use a different Gemini model?**
A: Yes! Update the model used in `app/api/chat/route.ts` and/or `embeddingModel` in `lib/ai/embedding.ts`, and adjust vector dimensions in `lib/db/schema/embeddings.ts` if needed.

## Project Structure

```
├── app/
│   ├── api/chat/route.ts    # Chat API endpoint with RAG logic
│   ├── page.tsx              # Main chat UI
│   └── layout.tsx            # Root layout
├── lib/
│   ├── ai/embedding.ts       # Embedding generation & search
│   ├── actions/resources.ts  # Server actions for resources
│   └── db/
│       ├── schema/           # Drizzle schema definitions
│       └── migrate.ts        # Migration runner
└── components/ui/            # Reusable UI components
```

## Contributing

Contributions are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Share feedback and suggestions

## Authors

Maintained by [Vercel](https://vercel.com) and the open-source community.

## License

See [LICENSE.txt](LICENSE.txt) for details.
