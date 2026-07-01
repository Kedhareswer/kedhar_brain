# AI Data Sciene Platform

**Status:** Done - Deployed · **Score:** 4/5

**Idea:** 2024-12-20   **Started:** 2024-12-20   **Completed:** 2025-06-17

## Skills & Tech
`TensorFlow` · `HTML` · `CSS` · `JavaScript` · `Other`

## Links
- **GitHub:** <https://github.com/Kedhareswer/Data_Science_Platform>
- **Live:** <https://data-science-platform.vercel.app/>

## 🔬 Research & Enrichment

### Overview
The AI Data Science Platform ("DataNotebook") is a browser-based, notebook-style data analysis and visualization app deployed at data-science-platform.vercel.app. It lets users drag-and-drop CSV, Excel (.xlsx/.xls) and JSON files (up to ~50MB), preview and clean the data, run exploratory analysis, build charts, and export processed datasets — all client-side with a distinctive "handwritten" UI theme. It is built with Next.js 14, React 18 and TypeScript (the repo is 99.1% TypeScript). Notably, despite the "TensorFlow" / "deep-learning" tags, no ML library is actually shipped yet: the README explicitly marks model training, prediction, AutoML and interpretability as "Coming Soon."

### Why it matters
Most analysts still bounce between spreadsheets, BI tools and Python notebooks for even simple EDA. A zero-install, in-browser notebook that handles upload → clean → visualize → export in one place lowers the barrier for quick insights and keeps data on the user's machine (a privacy and cost win, since nothing is sent to a server). This is the same niche that cloud notebooks and no-code chart tools target, but with no account or backend required.

### How it works / Recommended approach
The app is a client-side Next.js application using the React Context API for state. File ingestion uses PapaParse (CSV) and SheetJS/xlsx (Excel); visualization is rendered with Recharts. UI is composed from Radix UI primitives + Tailwind CSS 3.4 with Lucide icons and custom handwritten fonts. Structure: `/app` (pages: landing, notebook, docs, legal), `/components` (UI, charts, forms), `/lib` (hooks, types, contexts). Deployment and analytics run on Vercel. There is no server-side compute or database — all processing happens in the browser.

### State of the art & comparable work
- [Deepnote](https://deepnote.com/) — collaborative cloud notebook with no-code dataframe charts.
- [Observable](https://observablehq.com/) — reactive browser-based notebooks for data exploration.
- [JetBrains DataSpell](https://www.jetbrains.com/dataspell/) — desktop IDE for data scientists.
- [DuckDB-Wasm](https://duckdb.org/2021/10/29/duckdb-wasm) — sub-second SQL on millions of rows entirely in-browser.
- [TensorFlow.js](https://www.tensorflow.org/js) — WebGL/WebGPU/WASM-accelerated in-browser ML and transfer learning.

### Tech stack
Next.js 14, React 18, TypeScript 5, Tailwind CSS, Radix UI, Lucide, PapaParse, SheetJS (xlsx), Recharts, Vercel (hosting + analytics).

### Key challenges & risks
- "AI/ML/deep-learning" branding outpaces the shipped feature set (ML still a roadmap item).
- Pure client-side memory limits: large files and heavy joins are constrained by browser RAM (~4GB/tab in Chrome).
- Recharts (SVG) struggles at high row counts; no aggregation engine yet.
- Very low project visibility (3 stars / 3 forks) and a stale "Q2–Q3 2024" roadmap.

### Suggested next steps
- Ship a first real ML feature with [TensorFlow.js](https://github.com/tensorflow/tfjs) (e.g., in-browser linear/logistic regression or transfer-learning), or recalibrate the messaging to "data analysis."
- Add [DuckDB-Wasm](https://motherduck.com/blog/duckdb-wasm-in-browser/) as a query engine to scale past current row limits and enable SQL cells.
- Offload parsing/queries to Web Workers + Apache Arrow to keep the UI responsive.
- Add summary-stat profiling and missing-value handling as one-click notebook cells.
- Update the README roadmap and add a short demo GIF to lift discoverability.

### References
- [Project README (GitHub)](https://github.com/Kedhareswer/Data_Science_Platform)
- [Live app — data-science-platform.vercel.app](https://data-science-platform.vercel.app/)
- [Deepnote](https://deepnote.com/)
- [Observable](https://observablehq.com/)
- [DuckDB-Wasm: Analytical SQL in the Browser](https://duckdb.org/2021/10/29/duckdb-wasm)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Client-Side AI in 2025 (Medium)](https://medium.com/@sauravgupta2800/client-side-ai-in-2025-what-i-learned-running-ml-models-entirely-in-the-browser-aa12683f457f)

_Researched via web search · 7 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
