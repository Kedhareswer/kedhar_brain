---
name: kedhar-project-conventions
description: Kedhar's house style for any project an agent builds for him — default tech stack, repo structure, README format, naming, and deployment targets. Use FIRST when starting, scaffolding, or documenting ANY new project for Kedhar, or when choosing stack/deploy defaults. Keywords "new project, scaffold, project setup, conventions, house style, README, deploy, Vercel, repo structure".
---

# Kedhar Project Conventions

House style for projects built **for Kedhar** by an agent. Read this before scaffolding anything — it sets the defaults so output matches how Kedhar actually ships.

> ⚠️ These are **agent-facing build conventions**. They are NOT Kedhar's personal/professional skills (those live in `myself/`).

## Default stack
- **Frontend / web:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui → deploy to **Vercel**.
- **Python backend / APIs:** FastAPI (async) + Pydantic v2 → deploy to Render / Railway / Fly.io. See `kedhar-fastapi-backend`.
- **ML / DL:** PyTorch or TensorFlow/Keras (scikit-learn for classical) → serve via FastAPI. See `kedhar-ml-model-to-webapp`.
- **RAG / LLM apps:** multi-provider LLM client + vector store (FAISS local → Pinecone/Weaviate prod). See `kedhar-rag-webapp`.
- **Quick demos / static:** plain HTML/CSS/JS or v0-generated, hosted on Vercel or GitHub Pages.

## Repo structure (web app)
```
app/            # Next.js routes (App Router)
components/ui/  # shadcn components
lib/            # helpers, API clients
public/         # assets
README.md  .env.local(.example)  package.json
```

## README format (always)
Title + one-line tagline → badges → **live link + GitHub link near the top** → screenshot/GIF → Features → Tech stack → Local setup → Deploy → License. (Match the style in `github/`.)

## Non-negotiables
- Always ship a **live URL** and a **repo URL** — never leave a "label-only" link.
- kebab-case repo names; clear over clever.
- Secrets in env vars only (`.env.local`, Vercel/Render env) — never commit keys.
- Concise, imperative commit messages.

## Build flow
1. Confirm the stack against this doc; deviate only with a stated reason.
2. Scaffold structure → wire deployment early → ship a live link fast.
3. Write the README in the format above before calling it done.
