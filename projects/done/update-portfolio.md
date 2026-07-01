# Update Portfolio

**Status:** Done - Deployed · **Score:** 4/5

**Idea:** 2024-12-31   **Started:** 2025-02-13   **Completed:** 2025-06-18

## Description
Update Portfolio

## Challenges
many

## Links
- **GitHub:** <https://github.com/Kedhareswer/blueprint_portfolio>
- **Live:** <https://kedhar.vercel.app/>

## 🔬 Research & Enrichment

### Overview
"Update Portfolio" is the ongoing maintenance and refresh of Kedhareswer Naidu's personal developer portfolio, deployed live at https://kedhar.vercel.app/ and hosted on Vercel. The live site presents him as an "AI Engineer and Full-Stack Developer" and is organized into About, Featured Projects, Skills, Experience, and Contact sections. Featured work includes ThesisFlow AI (an academic research platform with literature exploration, summarization, WebSocket collaboration, and Gantt planning), QuantumPDF ChatApp (a RAG document-Q&A system cited at ~82% semantic-search precision), and a Data Notebook analysis workspace. A related source repository, `Kedhareswer/blueprint_portfolio` (a Vite + Tailwind CSS fork of PaddyOakTree/portfolio), exists but the deployed site itself reads as a Next.js/React build.

### Why it matters
A portfolio is the single highest-leverage asset for a developer's job search, freelance pipeline, and personal brand — it is where recruiters, collaborators, and clients form a first impression and verify claimed skills against real artifacts. Keeping it current (new projects, accurate role, working links, fresh metrics) directly affects discoverability and credibility. For an AI/full-stack engineer, it doubles as a live demonstration of front-end craft, performance discipline, and the ability to communicate complex ML systems clearly.

### How it works / Recommended approach
The deployed portfolio is a statically/server-rendered single-page experience served from Vercel's edge. Content is component-driven (section components for hero, project cards, skills grid, experience timeline, contact). The `blueprint_portfolio` fork is built with Vite, Tailwind CSS, PostCSS, and ESLint (JS/CSS/HTML majority, minimal TypeScript) and scaffolded with Bolt (a `.bolt/` config dir is present). Project cards surface concrete metrics and link out to source repos and demos. Improvement-wise, the highest-value moves are consolidating to a single canonical repo, adding JSON-LD `Person` schema, and tightening Core Web Vitals.

### State of the art & comparable work
Modern portfolios favor Next.js App Router with React Server Components (large bundle reductions, better LCP/INP) and MDX-driven content. Comparable templates and references: [Vercel Next.js Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit), [Magic Portfolio for Next.js](https://vercel.com/templates/next.js/magic-portfolio-for-next-js), and [vercel/nextjs-portfolio-starter](https://github.com/vercel/nextjs-portfolio-starter). Engineering guidance on RSC, WCAG 2.2 AA, and Core Web Vitals targets is summarized in [Pagepro's web dev best practices](https://pagepro.co/blog/web-development-best-practices/).

### Tech stack
- Hosting/CI: Vercel
- Live build: Next.js / React (deployed site)
- Source fork: Vite, Tailwind CSS, PostCSS, ESLint, Bolt scaffold (`blueprint_portfolio`)
- Languages: JavaScript/TypeScript, HTML, CSS

### Key challenges & risks
- Repo/source ambiguity: deployed Next.js site vs. the Vite-based `blueprint_portfolio` fork — unclear which is canonical, risking drift.
- Content staleness: project metrics (e.g., "82% precision"), role, and links must stay accurate and live.
- SEO/discoverability: no visible JSON-LD `Person` schema or sitemap confirmed.
- Performance/accessibility regressions as interactive features and media are added.

### Suggested next steps
- Consolidate to one public, well-documented portfolio repo and link it from the GitHub profile homepage field.
- Add JSON-LD `Person` schema, Open Graph/Twitter meta, `sitemap.xml`, and `robots.txt`.
- Run Lighthouse; hit LCP < 2.5s, INP < 200ms, CLS < 0.1; optimize images to WebP with lazy loading + alt text.
- Audit WCAG 2.2 AA: semantic HTML, visible focus states, 44x44px tap targets.
- Write a proper README for the portfolio repo and verify all live demo + repo links resolve.

### References
- [Kedhar live portfolio (kedhar.vercel.app)](https://kedhar.vercel.app/)
- [Kedhareswer/blueprint_portfolio repo](https://github.com/Kedhareswer/blueprint_portfolio)
- [SEO checklist for developer portfolios (Shipixen)](https://shipixen.com/blog/seo-checklist-for-developer-portfolios-and-landing-pages)
- [Web development best practices 2026 (Pagepro)](https://pagepro.co/blog/web-development-best-practices/)
- [Vercel Next.js Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit)

_Researched via web search · 5 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
