# Deepresearch

**Status:** Pending · **Score:** 4/5 · **Owner:** Kedhareswer Naidu

**Idea:** 2026-01-15

## Description
Make use of LLM capabilities to Identify and Summarize all available public info of any person or company

## 🔬 Research & Enrichment

### Overview
Deepresearch is a planned LLM-powered application that, given a person or company name, autonomously gathers and synthesizes all available public information into a structured, cited profile. Functionally it is an "OSINT (open-source intelligence) agent": it combines web search, page scraping, entity extraction, and LLM summarization to turn scattered public data into a readable dossier. This sits at the intersection of the new "deep research agent" wave (OpenAI/Gemini/Perplexity Deep Research) and the established B2B data-enrichment market.

### Why it matters
Analysts, recruiters, sales teams, journalists, and due-diligence staff spend hours manually searching, reading, and reconciling fragmented public sources. An agent that compresses this into minutes—with citations—delivers real productivity gains. The same capability underpins lead enrichment, KYC/AML background checks, competitive intelligence, and investigative journalism. The flip side is significant: profiling real people raises serious privacy and legal obligations that must be designed in from day one.

### How it works / Recommended approach
Recommended architecture: an orchestrated multi-agent "plan → search → read → synthesize → verify" loop. (1) A planner decomposes the target into sub-questions (employment, news, social, filings). (2) Parallel worker agents run web search (Serper/SerpApi/Tavily/Exa) and scrape pages. (3) An "LLM map-reduce" step chunks HTML, extracts entities/facts per chunk, and aggregates—keeping token cost down. (4) A gap-analysis node decides whether to dig deeper. (5) A synthesizer writes the profile with inline citations; a fact/citation checker validates claims. LangGraph's plan-and-execute pattern with `Send`-based parallel dispatch (3–6 specialists) is a proven backbone; HuggingFace's smolagents Open Deep Research is a strong reference implementation.

### State of the art & comparable work
- [sshh12/llm_osint](https://github.com/sshh12/llm_osint) — direct PoC: knowledge-agent + web-agents, LangChain, ~$1/agent task.
- [HuggingFace Open Deep Research (smolagents)](https://github.com/huggingface/smolagents/tree/main/examples/open_deep_research) — open replication of OpenAI Deep Research, 55% on GAIA.
- [OpenAI vs Perplexity vs Gemini deep research comparison](https://www.helicone.ai/blog/openai-deep-research) — commercial SOTA landscape.
- [DeepResearch Bench (arXiv 2506.11763)](https://arxiv.org/abs/2506.11763) — 100 expert tasks, RACE + FACT evaluation.
- [People Data Labs Identify API](https://www.peopledatalabs.com/person-data/identify-api) — structured enrichment alternative (1.5B+ profiles).

### Tech stack
Recommended: Python; LangGraph or smolagents for orchestration; GPT-4o/Claude/Gemini as reasoning LLM; Serper/SerpApi/Tavily/Exa for search; ScrapingBee/Firecrawl/Playwright for scraping; a vector store (Qdrant/FAISS) for dedup and retrieval; FastAPI backend; structured output via Pydantic; observability via LangSmith/Langfuse.

### Key challenges & risks
- Privacy/legal: GDPR and CCPA apply to public personal data; need a lawful basis, data minimization, and deletion handling.
- LinkedIn and similar ToS forbid automated scraping; Proxycurl shut down in 2025 after a LinkedIn lawsuit—avoid auth-gated scraping.
- Hallucination and entity confusion (same name, wrong person); citation accuracy is hard.
- Cost and latency scale with agent fan-out; bot detection on scraping.

### Suggested next steps
- Scope an MVP to one target type (company) using only clearly public sources + an enrichment API.
- Fork smolagents Open Deep Research or build a minimal LangGraph plan-execute loop as the skeleton.
- Add map-reduce extraction with strict source-citation tracking for every claim.
- Implement entity disambiguation and a confidence score per fact.
- Evaluate against DeepResearch Bench's FACT metric for citation trustworthiness.
- Bake in a privacy/compliance layer (consent log, robots.txt respect, opt-out/deletion) before any person-profiling feature.

### References
- [sshh12/llm_osint](https://github.com/sshh12/llm_osint)
- [HuggingFace Open Deep Research (smolagents)](https://github.com/huggingface/smolagents/tree/main/examples/open_deep_research)
- [OpenAI Deep Research vs Perplexity vs Gemini](https://www.helicone.ai/blog/openai-deep-research)
- [DeepResearch Bench (arXiv 2506.11763)](https://arxiv.org/abs/2506.11763)
- [How to Build a Multi-Agent Deep Research System with LangGraph](https://medium.com/data-science-collective/building-a-multi-agent-deep-research-agent-with-langgraph-203547b5fb12)
- [People Data Labs Identify API](https://www.peopledatalabs.com/person-data/identify-api)
- [Is Web Scraping Legal? GDPR, CCPA & CFAA Frameworks](https://tendem.ai/blog/is-web-scraping-legal-compliance-overview)

_Researched via web search · 9 sources · pending_

---
_Source: Pending Projects sheet · generated 2026-06-02 from project.xlsx_
