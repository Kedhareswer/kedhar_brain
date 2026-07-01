> 📦 [Kedhareswer/NaaPeru](https://github.com/Kedhareswer/NaaPeru) · ⭐ 0 · TypeScript · updated 2026-03-24 · 🌐 [live](https://naa-peru.vercel.app)  
> _README.md mirrored from branch `main` on 2026-06-02._

---

# NaaPeru

Personal portfolio for an AI engineer: part showcase, part playground, part polished internet handshake.

## Stack

- Vite 5
- React 18
- TypeScript
- React Router
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Vitest + Testing Library

## What It Includes

- Work-focused landing page and project showcase
- About and resume pages
- Case study routes for selected projects
- Animated transitions and motion-led interactions
- Embedded portfolio chatbot
- Supporting design system docs and tokens

## Project Structure

```text
.
├─ src/
│  ├─ components/      # App-specific UI, layout, chatbot, shared sections
│  ├─ components/ui/   # shadcn/ui primitives
│  ├─ contexts/        # React context providers
│  ├─ hooks/           # Reusable hooks
│  ├─ lib/             # Utilities and chatbot logic
│  ├─ pages/           # Route-level pages
│  ├─ remotion/        # Motion/video demo components
│  └─ test/            # Test setup
├─ public/             # Static assets, OG images, exports, metadata
├─ design_system/      # Tokens, handoff docs, design references
├─ api/                # Serverless endpoint(s)
└─ scripts/            # Utility scripts
```

## Dev Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run optimize:images
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Work / main landing page |
| `/about` | Personal profile and background |
| `/resume` | Resume page |
| `/fun` | Experiments and lighter side projects |
| `/case-study/quantumpdf` | QuantumPDF case study |
| `/case-study/thesisflow` | ThesisFlow case study |
| `/case-study/data-notebook` | Data Notebook case study |
| `/remotion-demo` | Remotion-based motion demo |
| `*` | 404 fallback |

## Design System

The UI is built on Tailwind tokens plus shadcn/ui primitives, then customized with portfolio-specific branding, motion, and layout rules. The source of truth lives in `design_system/`, `src/index.css`, and `tailwind.config.ts`.
