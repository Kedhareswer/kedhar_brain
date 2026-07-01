> 📦 [Kedhareswer/quantum-pdf_research-agent](https://github.com/Kedhareswer/quantum-pdf_research-agent) · ⭐ 0 · Python · updated 2025-09-12  
> _README.md mirrored from branch `main` on 2026-06-02._

---

<div align="center">

# Quantum PDF Agent

Robust multi-PDF Q&A and research assistant with ArXiv search, Neon logging, Pinecone/FAISS retrieval, and runtime LLM switching.

[![python](https://img.shields.io/badge/python-3.11%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3+-43B3AE?logo=chainlink&logoColor=white)](https://python.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-typed_state-1E90FF)](https://langchain-ai.github.io/langgraph/)
[![Gradio](https://img.shields.io/badge/Gradio-UI-FF6F61?logo=gradio&logoColor=white)](https://www.gradio.app/)
[![Pinecone](https://img.shields.io/badge/Pinecone-serverless-0B86F1?logo=pinecone&logoColor=white)](https://www.pinecone.io/)
[![Neon](https://img.shields.io/badge/Neon-Postgres-27AE60?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Groq](https://img.shields.io/badge/Groq-llama--3.3--70B--versatile-111111)](https://console.groq.com/docs/models)
[![Gemini](https://img.shields.io/badge/Gemini-2.0--flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/gemini-api/docs/models)

</div>

## Highlights

- Runtime provider control (Auto / Groq / Gemini) and model overrides in the UI.
- Multi-PDF ingestion, semantic chunking, and metadata (doc_id, page, type).
- RAG with Pinecone (serverless) or FAISS fallback; auto-heals index dimension mismatches.
- Local embeddings fallback (Hugging Face) when remote quotas fail (e.g., 429).
- Agentic flow with LangGraph: route → (arxiv?) → retrieve → answer.
- ArXiv search, auto-download, ingest, summarize, and offer downloads.
- Neon DB logging of sessions and interactions (optional).

## Feature Matrix vs PRD

| Capability (from PRD) | Status | Notes |
| --- | --- | --- |
| Multi-PDF ingestion (text + tables) | ✅ | PyMuPDF + pdfplumber; per-session namespace |
| Semantic chunking + metadata | ✅ | RecursiveChunk + doc_id/page/type |
| Q&A across documents | ✅ | LangGraph retrieve → answer |
| Summarization, compare | ✅ | Router + prompts; UI suggestions added |
| ArXiv fetch → auto-ingest | ✅ | Search, download, summarize, downloads in UI |
| LLM routing (Groq/Gemini) | ✅ | Auto/Groq/Gemini with model inputs in UI |
| Neon logging (sessions, interactions) | ✅ | Optional; “History & Session” tab |
| Error recovery (fallbacks, rate limit) | ✅ | HF embeddings fallback + per-session rate limiter |
| Figures/equations extraction | ⚠️ Partial | Text + tables; figures/eq not explicitly parsed |
| Security & compliance hardening | ⚠️ Partial | Local dev defaults; see PRD for prod guidance |

## System Overview

```mermaid
flowchart LR
    subgraph UI[Gradio UI]
      U1[Settings\nProvider, Models, Keys]
      U2[Upload PDFs]
      U3[Ask\nChat with PDFs]
      U4[ArXiv Search]
      U5[History & Session]
    end

    U2 --> ING[PDF Ingestion]
    ING --> V[(Pinecone/FAISS)]
    ING --> M[(Neon DB)]

    U3 --> R{LangGraph Router}
    U4 --> ARXIV[ArXiv Fetch]
    ARXIV --> ING

    R -->|retrieve| RET[Retriever]
    RET --> V
    RET --> C[Context]
    C --> LLM[LLM (Groq/Gemini)]
    LLM --> U3
```

LangGraph DAG:

```mermaid
flowchart TD
  A[START] --> B[route]
  B -->|arxiv| C[arxiv]
  B -->|retrieve| D[retrieve]
  C --> D --> E[answer] --> F[END]
```

## Setup

1) Python
- Python 3.11+ recommended
- Windows: run terminal as Administrator if needed for some wheels

2) Create venv and install
```powershell
# from the project root
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -U pip
pip install -r requirements.txt
```

3) Configure environment
- Copy `.env.example` to `.env` and fill values
- Minimum to run:
  - One LLM provider: `GROQ_API_KEY` or `GOOGLE_API_KEY`
  - For Pinecone: `PINECONE_API_KEY` and `PINECONE_INDEX`
  - (Optional) Neon: `NEON_DATABASE_URL` to persist sessions and logs

Notes:
- Pinecone index auto-creates (serverless). Dimension inferred from current embedding model.
- If dimension mismatch occurs, the app auto-creates a new index suffixed with the dimension (e.g., `quantumpdf-384`) and retries.
- If remote embeddings fail (e.g., Gemini 429), the app falls back to local Hugging Face embeddings by default.
- Without Pinecone, FAISS is used in-memory (if available).

4) Run
```powershell
python app.py
```
Open the URL shown in the console (default http://127.0.0.1:7860).

## Usage

- Settings tab: pick provider (Auto/Groq/Gemini), optionally paste API keys and override model names. Click “Save Settings”.
- Upload tab: add one or more PDFs, click “Ingest”.
- Ask tab:
  - Chat with PDFs: chatbot UI with prompt suggestions (summarize, key findings, datasets & metrics, limitations, outline).
  - ArXiv Search: query, fetch PDFs, auto-ingest, summarize per paper, and download files.
- History & Session: view history from Neon; delete session to remove DB rows and Pinecone vectors; create a new session.

## Configuration Reference (.env)

```
# LLM providers
GOOGLE_API_KEY=
GROQ_API_KEY=
OPENAI_API_KEY=

# Vector DB (Pinecone)
PINECONE_API_KEY=
PINECONE_INDEX=
# PINECONE_ENV is legacy and not used in serverless mode
# Serverless settings (used to create index automatically)
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1

# Database (Neon / Postgres)
NEON_DATABASE_URL=postgres://user:password@host/db?sslmode=require

# App settings
RAG_TOP_K=5

# Model overrides (optional)
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_MODEL=gemini-2.0-flash
GEMINI_EMBEDDING_MODEL=models/embedding-001
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# Local embeddings fallback (recommended for robustness)
USE_LOCAL_EMBEDDINGS_IF_REMOTE_FAILS=true
HF_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

## Architecture

- `qpdf_agent/pdf_ingestion.py` — PDF parsing and semantic chunking
- `qpdf_agent/embeddings.py` — Embedding provider with robust local fallback
- `qpdf_agent/vectorstore.py` — Vector store manager (Pinecone/FAISS), auto-heals index dim
- `qpdf_agent/llm_router.py` — Provider routing + model selection
- `qpdf_agent/agents.py` — Ingestion, Retrieval, and Q&A agents
- `qpdf_agent/graph.py` — LangGraph flow: route → (arxiv?) → retrieve → answer
- `qpdf_agent/arxiv_client.py` — ArXiv search/download utility
- `qpdf_agent/db.py` — Neon DB logger (tables auto-created)
- `app.py` — Gradio UI (Settings, Upload, Ask, History & Session)

## Roadmap (from PRD)

- Retry policies and rate limiting per session ✅
- Prompt guardrails and input validation ⏳
- Analytics dashboard (latency/cost) ⏳
- FastAPI service + React UI ⏳
- Multi-modal figure/image OCR pipelines ⏳

## Troubleshooting

- If Pinecone shows dimension errors, the app will auto-create a new index suffixed with the correct dimension (e.g., `quantumpdf-384`).
- If you hit embedding quota (e.g., Gemini 429), local embeddings are used automatically (if enabled).
- `PINECONE_ENV` is legacy; for serverless use `PINECONE_CLOUD` + `PINECONE_REGION`.
- No CrewAI. Pure LangChain + LangGraph agent/tool stack.

