---
name: kedhar-rag-webapp
description: Build a Retrieval-Augmented Generation (chat-with-documents) web app the way Kedhar does — ingest/parse docs, chunk, embed, vector store, multi-provider LLM, citations, guardrails, and evaluation. Use when building a RAG app, PDF/document QA, chatbot over documents, knowledge base, or semantic search app for Kedhar. Keywords "RAG, retrieval augmented generation, chat with PDF, document QA, vector search, embeddings, knowledge base, citations, semantic search".
---

# Kedhar RAG Web App

The pattern behind QuantumPDF, PDFChatBot, and DeepOne. Build document-grounded chat apps with citations and honest evaluation.

## Architecture
```
Next.js UI ──► route handler / FastAPI ──► RAG pipeline ──► multi-provider LLM
                                   │
                 ingest → chunk → embed → vector store → retrieve(+rerank)
```

## Pipeline
1. **Ingest / parse:** PDF.js, Mammoth (DOCX), SheetJS (XLSX), PapaParse (CSV).
2. **Chunk:** semantic / structure-aware chunking (avoid naive fixed windows that split tables & equations).
3. **Embed:** `all-MiniLM-L6-v2` (local) or OpenAI/Cohere embeddings (prod).
4. **Store:** FAISS for local/dev; **Pinecone or Weaviate** for production/persistence.
5. **Retrieve:** hybrid (BM25 + semantic); add a **reranker** (Cohere Rerank / bge-reranker) for accuracy.
6. **Generate:** unified multi-provider client (OpenAI/Anthropic/Google/Groq/HF); return **source-cited** answers.

## Must-haves
- **Citations** with clickable source chunks in the UI.
- **Guardrails:** input validation, rate limiting, PII masking; keep API keys server-side.
- **Eval:** wire a **RAGAS** harness (faithfulness, context precision/recall) into CI — don't self-report unverified accuracy.

## Upgrades worth doing
Contextual Retrieval (context-prefixed chunks + contextual BM25), layout-aware parsing (Docling/unstructured), persistent vector DB (Qdrant/Chroma), one-click Docker self-host.

## Definition of done
Live app, document upload → cited answers, server-side keys, a runnable eval script, README per `kedhar-project-conventions`.
