# PPT Generator

**Status:** Pending · **Score:** 3/5 · **Owner:** Kedhareswer Naidu

**Idea:** 2026-01-10

## Description
Design a system like canva where users can make use of AI to make, generate and edit PPTs

## 🔬 Research & Enrichment

### Overview
PPT Generator is a proposed Canva-style web app where users describe a topic (or upload source material) and an AI agent generates, edits, and restyles complete slide decks that export to editable PowerPoint/PDF. This sits in the fast-growing "AI presentation maker" category dominated by Gamma (reportedly ~70M users and $100M ARR by late 2025), Canva AI, and Beautiful.ai. The core technical problem is turning unstructured intent into structured, visually coherent, *editable* slides — not flat images. A strong differentiator would be conversational editing of an existing deck, not just one-shot generation.

### Why it matters
Knowledge workers spend hours formatting decks; AI can collapse the first-draft step from hours to minutes. The market validated demand rapidly, but hands-on reviews note AI decks still need 15–30 minutes of manual cleanup, and PPTX export commonly breaks (shifted charts, substituted fonts, lost animations). Solving editability and clean export is the real value, not text generation alone.

### How it works / Recommended approach
A proven, pragmatic pipeline: (1) **Outline** — LLM expands the prompt into a structured outline (slide count, titles, key points). (2) **Per-slide content** — LLM emits JSON conforming to a fixed schema (`title`, `bullets[]`, `image_desc`, `layout_type`). (3) **Enrichment** — keyword-driven stock images (Pexels/Pixabay) or generated images (DALL·E/Gemini Flash); optional web grounding for citations. (4) **Render** — `python-pptx` (or HTML→PPTX) builds editable slides from JSON. Orchestrate with LangGraph nodes (`plan → fill → enrich → build`). For quality, adopt the **textual-to-visual self-verification** loop (arXiv 2502.15412): render slide to image, have a multimodal LLM detect overflow/overlap, then refine JSON coordinates. For editing, follow **PPTAgent's** edit-based actions over reference templates rather than generating from scratch.

### State of the art & comparable work
- [Presenton](https://github.com/presenton/presenton) — Apache-2.0, Next.js + FastAPI, multi-provider LLMs, editable PPTX/PDF (closest open-source blueprint).
- [SlideDeck AI](https://github.com/barun-saha/slide-deck-ai) — JSON-schema + `python-pptx` + LiteLLM, reference implementation of the pipeline.
- [PPTAgent](https://arxiv.org/abs/2501.03936) — edit-based two-stage generation + PPTEval (Content/Design/Coherence).
- [AutoPresent](https://github.com/para-lost/AutoPresent) (CVPR 2025) — 8B Llama generating slide *code*, with the SlidesBench benchmark.
- Production: [Gamma](https://gamma.app/), [Canva AI Presentations](https://www.canva.com/create/ai-presentations/), Beautiful.ai.

### Tech stack
Recommended: Next.js/React + FastAPI; LangGraph orchestration; LiteLLM for multi-provider LLMs (GPT-4o/Claude/Gemini, Ollama for local); `python-pptx` for export; Pexels/Pixabay + image-gen APIs; Postgres + a vector store (Qdrant) for deck/asset memory; Docker deployment.

### Key challenges & risks
- Reliable, lossless **PPTX export** (fonts, charts, layout fidelity) — the hardest, most differentiating part.
- Visual coherence / overflow detection without a human in the loop.
- Conversational *editing* of an existing deck (state + diffing) is much harder than one-shot generation.
- LLM API cost/latency per deck; hallucinated facts in grounded content.
- Crowded market — needs a clear wedge (niche templates, brand kits, or superior editing).

### Suggested next steps
- Fork/study [Presenton](https://github.com/presenton/presenton) and [SlideDeck AI](https://github.com/barun-saha/slide-deck-ai) to avoid rebuilding the JSON→`python-pptx` core.
- Ship a thin MVP: prompt → outline → JSON → `python-pptx` export, one template.
- Add the render-image self-verification refine loop (arXiv 2502.15412) for layout quality.
- Adopt PPTEval-style scoring to measure output objectively.
- Then build incremental editing (select slide → instruct → re-render) as the differentiator.
- Add brand kits / template library and optional web-grounded citations.

### References
- [Presenton (open-source generator)](https://github.com/presenton/presenton)
- [SlideDeck AI](https://github.com/barun-saha/slide-deck-ai)
- [PPTAgent + PPTEval (arXiv 2501.03936)](https://arxiv.org/abs/2501.03936)
- [AutoPresent / SlidesBench (CVPR 2025)](https://github.com/para-lost/AutoPresent)
- [Textual-to-Visual Iterative Self-Verification (arXiv 2502.15412)](https://arxiv.org/html/2502.15412)
- [Building an LLM slide generator with LangGraph](https://medium.com/@gaddam.rahul.kumar/building-an-llm-powered-slide-deck-generator-with-langgraph-973aeaac0a06)
- [Best AI presentation makers (Zapier)](https://zapier.com/blog/best-ai-presentation-maker/)

_Researched via web search · 9 sources · pending_

---
_Source: Pending Projects sheet · generated 2026-06-02 from project.xlsx_
