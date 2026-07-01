# QuantamPDF

**Status:** Done - Deployed · **Score:** 4/5

**Idea:** 2025-02-28   **Started:** 2025-02-28   **Completed:** 2025-06-22

## Description
A browser-based chatbot that processes PDF documents, answers questions, and provides summaries/keywords.

## Skills & Tech
`Python` · `HTML` · `CSS` · `FastAPI` · `Other` · `HuggingFace` · `JavaScript`

## Tags
`ML` · `Web` · `Other`

## Links
- **GitHub:** <https://github.com/Kedhareswer/QuantumPDF_ChatApp_VectorDB>
- **Live:** <https://v0-rag-pdf-chatbot-eight.vercel.app>

## 🔬 Research & Enrichment

### Overview
QuantumPDF (repo: `QuantumPDF_ChatApp_VectorDB`) is a browser-based, Retrieval-Augmented Generation (RAG) chatbot for "chatting with" documents. While the portfolio entry tags it as a Python/FastAPI/HuggingFace app, the live codebase is a **Next.js 15 / React / TypeScript** web application that ingests PDFs (plus DOCX, XLSX, CSV) and answers questions with source-cited responses. It is unusually broad for a personal project: it abstracts **19+ LLM providers** and three vector-store backends (in-memory, Pinecone, Weaviate), and ships features like summaries, keyword extraction, hybrid semantic search, guardrails, and retrieval-quality metrics. It is deployed live on Netlify/Vercel.

### Why it matters
Static PDFs (research papers, contracts, reports, financial filings) lock knowledge in formats that are hard to query. "Chat-with-PDF" RAG turns them into interactive, citable knowledge sources, and grounding answers in retrieved chunks measurably reduces hallucination versus feeding whole documents to an LLM. The space is commercially active (NotebookLM, ChatPDF, Humata, PDF.ai), so a self-hostable, multi-provider, bring-your-own-key alternative is genuinely useful for privacy- and cost-conscious users.

### How it works
Per the README, documents are parsed client/server-side via **PDF.js, Mammoth.js, SheetJS, and PapaParse**, then run through a semantic chunking step and embedded into a vector DB. Retrieval uses **adaptive hybrid keyword + semantic weighting** chosen by query classification, with fair cross-document distribution for multi-doc queries. Generation is a **3-phase pipeline** (context analysis → self-critique of the draft answer → refined response), conceptually close to Self-RAG / corrective-RAG. A unified multi-provider AI client abstracts each vendor's API; **Transformers.js** runs on-device summarization. Guardrails (input validation, rate limiting, toxicity, PII masking) and evaluation metrics (groundedness, citation coverage, latency) wrap the loop; the UI shows source cards, clickable citations, and a chunk-transparency view.

### State of the art & comparable work
- **Anthropic Contextual Retrieval** — prepends chunk-level context before embedding + Contextual BM25; cuts retrieval failures up to 49% (67% with reranking). [anthropic.com](https://www.anthropic.com/news/contextual-retrieval)
- **Advanced chunking** — late chunking, structure-aware, and vision-guided chunking outperform fixed-size windows. [arXiv 2504.19754](https://arxiv.org/abs/2504.19754), [arXiv 2506.16035](https://arxiv.org/pdf/2506.16035)
- **RAGAS** — standard faithfulness / answer-relevancy / context-precision/recall metrics. [Meilisearch RAG eval](https://www.meilisearch.com/blog/rag-evaluation)
- **Comparable tools** — [AnythingLLM](https://docs.anythingllm.com/setup/vector-database-configuration/overview) (multi-provider + many vector DBs), [pdfGPT](https://github.com/bhaskatripathi/pdfGPT), and hosted [ChatPDF](https://www.chatpdf.com/) / Denser / NotebookLM. [ChatPDF alternatives](https://denser.ai/blog/chatpdf-alternative/)

### Tech stack
Next.js 15 · React · TypeScript · Tailwind CSS + shadcn/ui · Zustand · PDF.js / Mammoth.js / SheetJS / PapaParse · Transformers.js · Pinecone / Weaviate / in-memory vectors · 19+ LLM providers (OpenAI, Anthropic, Google, Mistral, DeepSeek, Groq, HuggingFace, OpenRouter…) · Vitest + Playwright · PWA.

### Key challenges & risks
- **Provider/API churn** — 19+ providers means constant breakage as model names and schemas change; high maintenance surface.
- **Chunking quality ceiling** — fixed/simple chunking fragments tables, equations, and multi-page context, capping retrieval accuracy.
- **No reranker / contextual embeddings** — hybrid search alone leaves measurable accuracy on the table.
- **Client-side keys & cost control** — BYO-key in the browser raises key-handling and abuse concerns despite rate limiting.
- **Eval rigor** — self-reported groundedness needs a fixed benchmark to be trustworthy.

### Suggested next steps
- Add **reranking** (Cohere Rerank / bge-reranker) and **contextual embeddings** to lift retrieval accuracy with minimal architecture change.
- Adopt **layout/structure-aware parsing** (e.g. Docling/unstructured) so tables and equations survive chunking.
- Wire a reproducible **RAGAS eval harness** into CI to track faithfulness/context-recall across changes.
- Add a **persistent vector DB option** (Qdrant/Chroma) so embeddings survive sessions; document a one-click self-host (Docker).
- **Reconcile portfolio metadata** — the entry lists Python/FastAPI but the repo is TypeScript/Next.js; update skills/tags.
- Harden **server-side proxying** of provider keys to avoid exposing them client-side.

### References
- [QuantumPDF repository](https://github.com/Kedhareswer/QuantumPDF_ChatApp_VectorDB)
- [Live app (Netlify)](https://quantumn-pdf-chatapp.netlify.app/)
- [Anthropic — Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Reconstructing Context: Advanced Chunking for RAG (arXiv 2504.19754)](https://arxiv.org/abs/2504.19754)
- [Vision-Guided Chunking for RAG (arXiv 2506.16035)](https://arxiv.org/pdf/2506.16035)
- [RAG evaluation: metrics & best practices (Meilisearch)](https://www.meilisearch.com/blog/rag-evaluation)
- [AnythingLLM — vector DB configuration](https://docs.anythingllm.com/setup/vector-database-configuration/overview)
- [pdfGPT (open-source chat-with-PDF)](https://github.com/bhaskatripathi/pdfGPT)
- [8 Best ChatPDF Alternatives (Denser)](https://denser.ai/blog/chatpdf-alternative/)

_Researched via web search · 8 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
