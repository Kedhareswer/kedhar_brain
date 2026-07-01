# Thesis Flow AI

**Status:** Done - Deployed · **Score:** 5/5

**Idea:** 2025-02-14   **Started:** 2025-02-14   **Completed:** 2025-06-17

## Description
A real-time collaborative workspace for research teams with AI assistance, document sharing, and team management capabilities. The platform enables seamless collaboration among researchers through real-time chat, document editing, and AI-powered research assistance.

## Skills & Tech
`Python` · `HTML` · `CSS` · `JavaScript` · `Other`

## Approach
Agile development with Next.js, Supabase, and serverless microservices.

## Methodology
Agile Development with Scrum, TDD, CI/CD and regular retrospectives.

## Challenges
1.Implementing real-time document synchronization
2. Managing concurrent edits and version control
3. Optimizing AI response times
4. Ensuring data security and access control

## Outcomes
1. Successfully implemented real-time collaboration features
2. Integrated AI-powered research assistance
3. Built a scalable architecture for future expansion
4. Achieved 92% test coverage

## Links
- **GitHub:** <https://github.com/Kedhareswer/ai-project-planner>
- **Live:** <https://thesisflow-ai.vercel.app/>

## 🔬 Research & Enrichment

### Overview
ThesisFlow-AI (formerly "ai-project-planner") is an end-to-end research workspace that helps individuals and teams move from "research chaos to clarity." Per the live product, it combines four pillars: an AI Research Chat that returns grounded answers with inline citations (streaming, abort/resume, model fallbacks); a Literature Explorer that searches OpenAlex, arXiv and CrossRef with AI-assisted ranking and deduping; a Summarize & Extract engine for PDFs, DOCX, PPT and images (OCR) that exports structured JSON/CSV/Markdown; and a Planner with Calendar, Gantt and Kanban views plus team collaboration. It runs as a deployed SaaS with token-based pricing (Free 50 tokens/mo; Pro $29/mo, 500 tokens, up to 10 collaborators).

### Why it matters
Literature review and research coordination are bottlenecks for students and labs: discovery, reading dense papers, and keeping a team aligned each consume large amounts of time. By unifying paper discovery, summarization, planning, and real-time collaboration in one workspace—rather than stitching together Elicit, a reference manager, and a project board—ThesisFlow-AI reduces context-switching and accelerates the path from question to written output.

### How it works / Recommended approach
Grounded in the live app and its stated stack: a Next.js front end deployed on Vercel with Supabase (Postgres + Auth + Realtime) as the backend. The Explorer queries free scholarly APIs (OpenAlex 250M+ works, arXiv, CrossRef), then dedupes and reranks results. The Summarizer extracts text/tables/metadata (with OCR for images) and prompts an LLM to produce structured summaries. AI Chat streams answers with citations and uses model fallbacks, implying a multi-provider LLM layer. Collaboration (shared workspaces, task assignment, chat) is most plausibly built on Supabase Realtime channels.

### State of the art & comparable work
Direct comparables in AI research assistance: [Elicit](https://elicit.com/) (structured systematic-review extraction over a 138M-paper index), [Consensus](https://consensus.app/) (evidence Q&A with a Consensus Meter), [SciSpace](https://typeset.io/) (paper comprehension), [Semantic Scholar](https://www.semanticscholar.org/) (free discovery + TLDRs), [ResearchRabbit](https://www.researchrabbit.ai/) (citation-graph discovery), and [Scite](https://scite.ai/) (citation verification). Most rivals focus on one phase; ThesisFlow's differentiator is bundling discovery, summarization, planning, and team collaboration. For real-time editing, the field splits between OT (Google Docs) and CRDTs ([Yjs](https://github.com/yjs/yjs), used by Figma-style apps).

### Tech stack
Next.js · React · Supabase (Postgres, Auth, Realtime) · Vercel · TypeScript/JavaScript · Python (likely for extraction/AI services) · OpenAlex / arXiv / CrossRef APIs · multi-provider LLMs with fallback · OCR for image/PDF ingestion.

### Key challenges & risks
- Real-time concurrent editing: conflict resolution at scale (OT vs CRDT trade-offs; CRDT metadata bloat).
- AI cost and latency: token economics, streaming reliability, and provider fallback complexity.
- Hallucination / citation accuracy: grounding answers faithfully to retrieved sources.
- Data security & access control: multi-tenant RLS in Supabase, document privacy.
- Scholarly API rate limits and metadata inconsistency across OpenAlex/arXiv/CrossRef.

### Suggested next steps
- Adopt Yjs (CRDT) for the document editor to enable offline-first, conflict-free co-editing.
- Add RAG evaluation (RAGAS-style) and citation-faithfulness checks to harden Chat answers.
- Implement semantic caching and prompt caching to cut LLM cost/latency.
- Publish the GitHub repo (currently not publicly reachable) with a clear README and architecture diagram.
- Add a "systematic review" export mode (PRISMA-style) to compete with Elicit on structured extraction.
- Introduce reference-manager export (BibTeX/Zotero/RIS) to fit existing researcher workflows.

### References
- [ThesisFlow-AI live app](https://thesisflow-ai.vercel.app/)
- [Elicit vs Consensus comparison (Paperguide, 2026)](https://paperguide.ai/blog/elicit-vs-consensus/)
- [OpenAlex: A fully-open index of scholarly works (arXiv)](https://arxiv.org/pdf/2205.01833)
- [OpenAlex free API — 250M+ works (DEV)](https://dev.to/0012303/openalex-has-a-free-api-search-250m-academic-works-without-any-key-4915)
- [Yjs: shared data types for collaborative software (GitHub)](https://github.com/yjs/yjs)
- [Building real-time collaboration: OT vs CRDT (TinyMCE)](https://www.tiny.cloud/blog/real-time-collaboration-ot-vs-crdt/)
- [Best AI tools for academic research (Atlas, 2026)](https://www.atlasworkspace.ai/blog/ai-tools-for-academic-research)

_Researched via web search · 8 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
