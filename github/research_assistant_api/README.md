> 📦 [Kedhareswer/research_assistant_api](https://github.com/Kedhareswer/research_assistant_api) · ⭐ 0 · TypeScript · updated 2025-08-21  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Research Literature Search Platform (Next.js + FastAPI)

Monorepo using pnpm workspaces. One command runs both the Next.js web app and the FastAPI API.

## Structure

- `pnpm-workspace.yaml` — declares `apps/*`
- `apps/web/` — Next.js 14 App Router UI (Tailwind-ready)
- `apps/api/` — FastAPI service with API key auth (optional) and streaming SSE stubs

## Quickstart

1) Prereqs
- Node 18+ and pnpm 9+
- Python 3.10+

2) Install deps
```sh
pnpm i
pnpm -w add -D concurrently
pnpm -F web add next@14 react react-dom
pnpm -F web add -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer
```

3) Python deps (venv recommended)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -r apps\api\requirements.txt
```

4) Env
- Edit `.env.local` (at repo root):
```
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
API_KEYS= # optional, comma-separated. Leave empty to disable auth in dev
```

5) Run
```sh
pnpm dev
```
- Web: http://localhost:3000
- API: http://127.0.0.1:8000 (proxied via `/api/search` and `/api/search/stream`)

## Notes
- Route Handlers: `apps/web/app/api/search/*` proxy to FastAPI.
- Streaming: `/search/stream` uses SSE. The homepage demonstrates progressive results (metadata, then summary).
- CORS is enabled for `localhost:3000`.

## Next Steps
- Integrate real sources (arXiv, OpenAlex, DuckDuckGo/Serper) and Redis cache.
- Add auth & rate limiting (e.g., `fastapi-limiter` via Redis).
- Add LLM pipelines (Groq/OpenAI/Cohere) via LangChain for summaries and clustering.
- UI: Tailwind + shadcn/ui components for filters, facets, exports.
