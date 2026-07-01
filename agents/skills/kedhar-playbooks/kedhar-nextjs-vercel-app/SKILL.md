---
name: kedhar-nextjs-vercel-app
description: Scaffold and ship a Next.js + TypeScript + Tailwind + shadcn/ui web app deployed to Vercel — Kedhar's default web stack. Use when building a web app, frontend, dashboard, landing page, or interactive site for Kedhar, or deploying a Next.js app to Vercel. Keywords "next.js, nextjs, react, frontend, web app, tailwind, shadcn, vercel, dashboard, landing page".
---

# Kedhar Next.js + Vercel App

Kedhar's default web stack (used across QuantumPDF, Data_Science_Platform, ML_Notebook, llm-chess-agentic, interactive-periodic-table). Build new web apps this way unless told otherwise.

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Vercel hosting. State with Zustand or React Context; data viz with Recharts.

## Scaffold
```bash
npx create-next-app@latest my-app --ts --tailwind --eslint --app --src-dir --use-npm
cd my-app && npx shadcn@latest init
```

## Structure
```
src/app/            # routes, layouts, route handlers (app/api/*/route.ts)
src/components/ui/   # shadcn primitives
src/components/      # feature components
src/lib/             # api clients, utils, types
```

## Conventions
- **Server Components by default**; add `"use client"` only where you need interactivity.
- API/proxy logic in **route handlers** (`app/api/.../route.ts`) — keep provider keys server-side, never in the browser.
- Env: `NEXT_PUBLIC_*` only for safe client values; secrets stay server-only.
- Use `next/image`, metadata API for SEO, and a loading/error boundary per route.

## Deploy to Vercel
1. Push to GitHub (`main`).
2. Import repo in Vercel → framework auto-detected.
3. Add env vars in the Vercel dashboard.
4. Auto-deploys on push; preview deploys per PR.

## Definition of done
Live Vercel URL + repo URL, responsive, no exposed secrets, README per `kedhar-project-conventions`.
