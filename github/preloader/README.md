> 📦 [Kedhareswer/preloader](https://github.com/Kedhareswer/preloader) · ⭐ 0 · TypeScript · updated 2026-02-19  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# Preloader Animation (React + Vite + TypeScript)

A GSAP-powered preloader layout component with staged image transitions, text motion, grid reveal, and restart control.

## Tech Stack

- React 19
- TypeScript
- Vite 6
- GSAP 3
- Vitest

## Project Structure

```text
.
├── package.json
├── src
│   ├── app.tsx
│   ├── index.css
│   ├── components
│   │   └── ui
│   │       └── layout-preloader.tsx
│   ├── demos
│   │   └── default.tsx
│   ├── lib
│   │   └── utils.ts
│   └── types
│       └── gsap-all.d.ts
└── pnpm-lock.yaml
```

## How It Is Wired

- `src/components/ui/layout-preloader.tsx` contains the main preloader component and animation timeline.
- `src/demos/default.tsx` renders the preloader demo.
- `src/app.tsx` is the app entry that imports `src/index.css` and re-exports the demo.
- `src/types/gsap-all.d.ts` provides a local type shim for `gsap/all` in this workspace.

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- pnpm 8+ (pnpm 9+ recommended)

## Install

```bash
pnpm install
```

## Run In Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## Available Scripts

- `pnpm dev`: start Vite dev server
- `pnpm install-and-dev`: install dependencies and start dev server
- `pnpm build`: production build
- `pnpm test`: run Vitest
- `pnpm generate:registry`: run local registry generation script plus shadcn build

## Notes

- The restart button includes an accessible name via `aria-label` and `title`.
- If your editor keeps stale TypeScript diagnostics, run "TypeScript: Restart TS Server".
- If Vite build complains about a missing `index.html`, add your app entry files (`index.html` and client bootstrap) or integrate this `src` module into an existing host app.
