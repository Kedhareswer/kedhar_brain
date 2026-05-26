# Kedhar Skills

> A curated, categorized catalog of **252 agent skills** with one-command installers for **Claude Code**, **Codex CLI**, **GitHub Copilot CLI**, and **Gemini CLI**.

Skills are modular packages of specialized knowledge, workflows, and tools that extend AI coding agents. This repo gives you a single source of truth for what's installed, what each skill does, and how to install them on any agent platform.

---

## Quick Install

### One-liner — install **everything** to Claude Code

**Windows (PowerShell):**
```powershell
iwr -useb https://raw.githubusercontent.com/Kedhareswer/Kedhar_skills/main/install.ps1 | iex
```

**macOS / Linux (bash):**
```bash
curl -fsSL https://raw.githubusercontent.com/Kedhareswer/Kedhar_skills/main/install.sh | bash
```

### Install a **single skill** (works for any agent)

```bash
# Claude Code (user-level)
npx skills add Kedhareswer/Kedhar_skills@<skill-name> -g -y

# Codex CLI
codex skill add Kedhareswer/Kedhar_skills@<skill-name>

# GitHub Copilot CLI
gh copilot skill install Kedhareswer/Kedhar_skills@<skill-name>

# Gemini CLI
gemini skill install Kedhareswer/Kedhar_skills@<skill-name>
```

See [INSTALL.md](INSTALL.md) for full platform-specific instructions.

---

## How to Find a Skill

Three ways, fastest first:

1. **In-agent (Claude Code / Copilot / Gemini):** Just ask — e.g. *"find a skill for PDF extraction"*. The `find-skills` skill activates and searches automatically.
2. **CLI:** `npx skills find <query>` — interactive search across the open skill registry.
3. **This repo:** Browse [SKILLS.md](SKILLS.md) — every skill grouped by category with a one-line description.

---

## Hierarchy

```
Kedhar_skills/
├── README.md           ← you are here (overview + quick install)
├── SKILLS.md           ← full catalog: 252 skills grouped by category
├── INSTALL.md          ← per-platform install guides (Claude, Codex, Copilot, Gemini)
├── USAGE.md            ← how to invoke skills + best practices
├── skills.json         ← machine-readable index (for tooling)
├── install.ps1         ← Windows one-liner installer
└── install.sh          ← macOS / Linux one-liner installer
```

---

## Categories at a Glance

Click a category to jump to its section in [SKILLS.md](SKILLS.md).

| Category | Count | Highlights |
|---|---:|---|
| [AI & LLM Development](SKILLS.md#ai--llm-development-30) | 30 | `ai-agents-architect`, `langchain`, `mcp-builder`, `prompt-engineering-patterns` |
| [RAG & Vector Search](SKILLS.md#rag--vector-search-20) | 20 | `rag-engineer`, `chroma`, `qdrant-vector-search`, `weaviate`, `hybrid-search-implementation` |
| [ML Training & Infra](SKILLS.md#ml-training--infrastructure-9) | 9 | `pytorch-fsdp`, `deepspeed`, `training-llms-megatron`, `moe-training` |
| [Python](SKILLS.md#python-20) | 20 | `python-expert`, `fastapi`, `async-python-patterns`, `uv-package-manager` |
| [Frontend / Web](SKILLS.md#frontend--web-12) | 12 | `frontend-design`, `nextjs-app-router-patterns`, `react-state-management`, `3d-web-experience` |
| [Backend / API](SKILLS.md#backend--api-8) | 8 | `api-designer`, `backend-patterns`, `nodejs-backend-patterns`, `rate-limiting` |
| [Database & Data](SKILLS.md#database--data-10) | 10 | `sql-optimization-patterns`, `neo4j-cypher-skill`, `data-analyst`, `database-migration` |
| [Testing & Quality](SKILLS.md#testing--quality-15) | 15 | `test-driven-development`, `code-reviewer`, `playwright`, `systematic-debugging` |
| [DevOps & CI/CD](SKILLS.md#devops--cicd-9) | 9 | `github-actions-templates`, `deployment-pipeline-design`, `changelog-automation` |
| [Security](SKILLS.md#security-6) | 6 | `security-review`, `prompt-injection-defense`, `ai-code-security` |
| [Design / UI / UX](SKILLS.md#design--ui--ux-17) | 17 | `frontend-design`, `ui-design-system`, `Accessibility Auditor`, `brand-guidelines` |
| [Docs & Writing](SKILLS.md#docs--writing-5) | 5 | `writing-plans`, `architecture-decision-records`, `writing-skills` |
| [Workflow & Meta](SKILLS.md#workflow--meta-13) | 13 | `brainstorming`, `using-superpowers`, `subagent-driven-development`, `skill-creator` |
| [Research & Scraping](SKILLS.md#research--scraping-15) | 15 | `firecrawl`, `deep-research`, `arxiv-search`, `web-research` |
| [SEO & Marketing](SKILLS.md#seo--marketing-19) | 19 | `geo`, `seo`, `lead-intelligence`, `ai-workflow-automation` |
| [Document Processing](SKILLS.md#document-processing-10) | 10 | `pdf-processing`, `pptx`, `xlsx`, `docling`, `liteparse` |
| [Media & Content](SKILLS.md#media--content-5) | 5 | `imagegen`, `sora`, `speech`, `transcribe`, `screenshot` |
| [Specialized](SKILLS.md#specialized-4) | 4 | `3d-modeling`, `physics-simulation`, `pixel-art`, `employment-contract-templates` |
| [Animation & Motion Graphics](SKILLS.md#animation--motion-graphics-25) | 25 | `gsap`, `hyperframes`, `motion-design`, `lottie`, `three`, `tailwind` |

**Total: 252 skills.** See [SKILLS.md](SKILLS.md) for the full flat list.

---

## Skill Anatomy

Every skill is a directory with a `SKILL.md` file:

```
<skill-name>/
├── SKILL.md              ← required: YAML frontmatter + body
├── references/           ← optional: heavy docs (API refs, syntax guides)
└── scripts/              ← optional: executable helpers
```

`SKILL.md` frontmatter:
```yaml
---
name: skill-name-in-kebab-case
description: Use when [specific triggering conditions and symptoms]
---
```

The `description` is what the agent reads to decide whether to load the skill. See [USAGE.md](USAGE.md) for how skills are invoked.

---

## Updating

```bash
# Check for updates
npx skills check

# Update all installed skills
npx skills update
```

---

## Contributing

1. Use the `skill-creator` skill to scaffold: `npx skills init <name>`
2. Follow the `writing-skills` Test-Driven approach (pressure-test with subagents before publishing)
3. PR to this repo — see [USAGE.md](USAGE.md#contributing) for the checklist

---

## License

MIT. Individual skills retain their upstream licenses where applicable.
