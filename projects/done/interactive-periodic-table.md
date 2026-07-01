# Interactive Periodic Table

**Status:** Done - Deployed · **Score:** 2/5

**Idea:** 2025-05-10   **Started:** 2025-05-11   **Completed:** 2025-03-14

## Skills & Tech
`Python`

## Links
- **GitHub:** <https://github.com/Kedhareswer/interactive-periodic-table>
- **Live:** <https://v0-interactive-periodic-table-rose.vercel.app/>

## 🔬 Research & Enrichment

### Overview
"तत्त्व चक्र (Tattva Chakra)" is a deployed, single-page web application that renders an interactive periodic table of all 118 elements with an Indian historical/cultural theme. Each element is a clickable card surfacing detailed properties, isotope and radioactivity data, side-by-side dual-element comparison, category filtering, and color-coded periodic-trend visualizations. Despite the portfolio sheet listing "Python," the actual stack is TypeScript/Next.js scaffolded with Vercel's v0 and deployed on Vercel. It includes responsive design and a dark mode for accessibility.

### Why it matters
The periodic table is the single most-referenced artifact in chemistry education, and interactive versions materially improve concept retention by letting learners explore trends (electronegativity, atomic radius, ionization energy) visually rather than memorizing tables. A culturally themed, polished implementation is both a strong learning aid and a clear demonstration of modern front-end skill (component design, state modeling, data visualization).

### How it works / Recommended approach
The README describes a clean component architecture: a top-level `PeriodicTable` orchestrator coordinating `ElementCard` (grid display), `ElementDetails` (full property panel), `ElementComparison` (two-element analysis), and `PeriodicTrends` (color-coded overlays). UI state is modeled explicitly as Normal, ElementView, ComparisonMode, and FilteredView. Element/isotope data and helpers live in dedicated `data/`, `lib/`, `hooks/`, and `types/` directories. Framer Motion drives animations, Tailwind CSS handles styling, and Vercel CI/CD auto-deploys from the repo. Data is bundled statically (no backend), keeping it fast and serverless.

### State of the art & comparable work
The reference implementations are [Ptable](https://ptable.com/?lang=en) (trends, 3D orbitals, isotopes, compound mixing) and the authoritative [PubChem Periodic Table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/), which sources data from curated databases. The [Royal Society of Chemistry table](https://www.rsc.org/periodic-table) emphasizes screen-reader accessibility and rich media. [PTEU](https://periodic-table-of-elements.top/) is a multilingual open alternative. For data, [Bowserinator/Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) (CC BY-SA) is the de-facto open dataset.

### Tech stack
Next.js (React), TypeScript, Framer Motion, Tailwind CSS, v0 by Vercel; deployed via Vercel CI/CD. MIT licensed.

### Key challenges & risks
- Data accuracy: hard-coded element/isotope values can drift from authoritative sources without a sync process.
- Accessibility: color-coded trends can fail color-blind users unless paired with text/patterns and WCAG-contrast palettes.
- Maintainability: v0-generated code can carry unused dependencies and inconsistent structure.
- Discoverability: a static SPA needs SEO/meta work to rank against established tools.

### Suggested next steps
- Replace bundled data with (or validate against) the [PubChem PUG-REST](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) endpoint or Bowserinator JSON for verifiable accuracy.
- Run a WCAG audit; add colorblind-safe palettes plus text/pattern encodings for trends.
- Add 3D electron-orbital visualization (Three.js/WebGL) to match Ptable-class features.
- Layer in search, keyboard navigation, and ARIA labels for full screen-reader support.
- Add unit/visual tests and prune unused v0 scaffolding.
- Internationalize labels (the cultural theme is a natural fit for multilingual support).

### References
- [Ptable - Interactive Periodic Table](https://ptable.com/?lang=en)
- [PubChem Periodic Table of Elements (NIH)](https://pubchem.ncbi.nlm.nih.gov/periodic-table/)
- [PubChem PUG-REST API docs](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest)
- [Bowserinator/Periodic-Table-JSON dataset](https://github.com/Bowserinator/Periodic-Table-JSON)
- [PTEU - Free Interactive Periodic Table (46 languages)](https://periodic-table-of-elements.top/)
- [Making chemistry accessible for learners with vision impairment (NCBI)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10611797/)
- [Accessible Chemistry Resources - IMAGE Center of Maryland](https://imagemd.org/2024/05/27/accessible-chemistry-resources/)

_Researched via web search · 6 sources · done_

---
_Source: Working Projects sheet · generated 2026-06-02 from project.xlsx_
