# ML DL educational website

**Status:** Done - Deployed · **Score:** 4/5

**Idea:** 2025-03-28   **Started:** 2025-03-28   **Completed:** 2025-03-13

## Skills & Tech
`HTML` · `CSS` · `Other` · `FastAPI`

## Links
- **GitHub:** <https://github.com/Kedhareswer/ML_Notebook>
- **Live:** <https://ml-notebook.vercel.app/>

## 🔬 Research & Enrichment

### Overview
ML Notebook is an interactive educational web platform for learning machine learning and deep learning, built by Kedhareswer and deployed at [ml-notebook.vercel.app](https://ml-notebook.vercel.app/). Each model is taught through a consistent three-part framework: a theoretical overview, an interactive demonstration with adjustable parameters and live visual feedback, and runnable code samples. Content is organized into tracks spanning Foundations, Regression, Classification, Unsupervised Learning (K-Means, hierarchical clustering, PCA), and Neural Networks (MLP, CNN, RNN, Transformers), plus a Resources section with glossaries, cheat sheets, and curated learning paths.

### Why it matters
ML concepts are notoriously abstract; intuition about hyperparameters, decision boundaries, and architecture is hard to build from equations alone. Interactive, browser-based explainers have repeatedly been shown to lower the entry barrier by letting learners tinker and see immediate effects — the approach popularized by TensorFlow Playground and Distill. A single, structured site that unifies theory, interaction, and code addresses the fragmentation of ML self-study resources.

### How it works / Recommended approach
Per the README and repo, the app is a Next.js (App Router) + React single codebase. Routes live under `app/` (`models/`, `resources/`, `about/`), with reusable React components in `components/`, custom hooks in `hooks/`, and utilities in `lib/`. Styling uses Tailwind CSS with the shadcn/ui component library; visualizations are rendered with React-based libraries. Each model page composes the three-component pattern. (Note: the portfolio entry lists "FastAPI/HTML/CSS", but the actual repo is ~99.6% TypeScript with no visible Python backend — interactivity appears client-side.)

### State of the art & comparable work
- [TensorFlow Playground](https://playground.tensorflow.org/) — in-browser neural-net sandbox (TypeScript + d3.js).
- [CNN Explainer](https://arxiv.org/abs/2004.15004) — interactive CNN visualization for non-experts.
- [Transformer Explainer](https://arxiv.org/html/2408.04619v1) — live GPT-2 running in-browser.
- [Distill](https://distill.pub/) and [Explained Visually](https://setosa.io/ev/) — explorable ML/stat explanations.
- [3Blue1Brown Neural Networks](https://www.3blue1brown.com/lessons/gpt/) — visuals-first video series.
- [Interactive ML list](https://github.com/stared/interactive-machine-learning-list) and [ML-Tokyo Interactive Tools](https://github.com/Machine-Learning-Tokyo/Interactive_Tools) — curated directories.

### Tech stack
TypeScript · Next.js (App Router) · React · Tailwind CSS · shadcn/ui · React visualization libraries · pnpm · deployed on Vercel · GPLv3 license.

### Key challenges & risks
- "Runnable code" in a JS frontend is limited; true Python execution needs Pyodide/WebAssembly or a backend.
- Maintaining accuracy across many algorithms is high-effort; risk of shallow or stale content.
- Bundle size and performance as interactive visualizations grow.
- Differentiation from established explainers (Playground, Distill).

### Suggested next steps
- Integrate [Pyodide](https://pyodide.org/) so scikit-learn/NumPy code actually runs in-browser, privacy-first.
- Add real datasets (UCI, scikit-learn toy sets, MNIST subsets) for hands-on training demos.
- Add quizzes/progress tracking and an embeddable "share my experiment" link per model.
- Reconcile the stated tech stack (remove FastAPI or add a real inference backend).
- Add automated content/link tests and accessibility (a11y) checks.
- Consider WebGPU-accelerated demos for deeper architectures.

### References
- [TensorFlow Playground](https://playground.tensorflow.org/)
- [CNN Explainer (arXiv 2004.15004)](https://arxiv.org/abs/2004.15004)
- [Transformer Explainer (arXiv 2408.04619)](https://arxiv.org/html/2408.04619v1)
- [Distill.pub](https://distill.pub/)
- [Pyodide](https://pyodide.org/)
- [stared/interactive-machine-learning-list](https://github.com/stared/interactive-machine-learning-list)
- [ML-Tokyo Interactive Tools](https://github.com/Machine-Learning-Tokyo/Interactive_Tools)

_Researched via web search · 7 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
