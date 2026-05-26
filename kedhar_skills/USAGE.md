# Using Skills

How skills work, how to invoke them, and how to combine them effectively.

---

## How Skills Work

Every skill is a directory with a `SKILL.md` file:

```
<skill-name>/
├── SKILL.md              ← required: frontmatter + body
├── references/           ← optional: heavy reference docs
└── scripts/              ← optional: executable helpers
```

The `SKILL.md` frontmatter is what the agent reads at session start:

```yaml
---
name: rag-engineer
description: Use when building production RAG systems with retrieval, chunking, reranking, and eval pipelines
---
```

When you describe a task, the agent matches your request against every skill's `description` field. Matching skills get loaded into the conversation; the body becomes part of the active context.

---

## Three Ways to Invoke a Skill

### 1. Natural language (best for most cases)

Just describe the task. The agent picks the right skill.

> *"Help me design a RAG pipeline for a 10M-document corpus."*

→ `rag-engineer`, `embedding-strategies`, `vector-index-tuning`, `hybrid-search-implementation` all activate.

### 2. Slash command

```
/find-skills
/brainstorming
/test-driven-development
```

Type `/` and the agent will autocomplete. Slash commands invoke the named skill explicitly.

### 3. Skill tool (programmatic)

When chaining or scripting agents:

```
Skill(skill: "rag-engineer")
```

The full content loads immediately.

---

## Discovery Workflow

When you don't know which skill applies:

```
/find-skills
```

The `find-skills` skill searches the registry by keyword:

```bash
npx skills find <query>
```

Common queries that work well:
- `react performance` → `react-doctor`, `nextjs-app-router-patterns`
- `pr review` → `code-reviewer`, `code-review-excellence`, `receiving-code-review`
- `rag` → 20+ matches across RAG / vector search
- `test` → `test-driven-development`, `python-testing`, `playwright`, `e2e-testing-patterns`

---

## Skill Hierarchy & Priority

When multiple skills apply, follow this order (from `using-superpowers`):

1. **Process skills first** — determine HOW to approach the task
   - `brainstorming` (before creative work)
   - `systematic-debugging` (before any bug fix)
   - `writing-plans` (before multi-step implementation)
   - `test-driven-development` (before writing code)

2. **Implementation skills second** — execute the work
   - `frontend-design`, `rag-engineer`, `mcp-builder`, etc.

**Example flow:**
> *"Let's build an MCP server for our database."*

1. `brainstorming` — clarify intent, requirements
2. `writing-plans` — concrete implementation plan
3. `mcp-builder` — actual MCP construction
4. `test-driven-development` — test-first execution
5. `verification-before-completion` — verify it works before claiming done

---

## Skill Types

| Type | What it is | How to follow it |
|---|---|---|
| **Rigid** | Discipline rules (TDD, debugging, verification) | Follow exactly — don't adapt the discipline away |
| **Flexible** | Patterns and mental models | Adapt principles to context |
| **Reference** | API docs, syntax guides | Look up what you need |

Each skill declares its type in its body.

---

## Combining Skills

Skills compose. A complex task uses many:

**"Ship a production RAG chatbot":**
- `brainstorming` → requirements
- `writing-plans` → roadmap
- `rag-engineer` → architecture
- `qdrant-vector-search` → vector DB
- `hybrid-search-implementation` → retrieval
- `prompt-engineering-patterns` → prompts
- `ai-observability` → monitoring
- `ai-safety-alignment` → guardrails
- `fastapi` → API layer
- `deployment-pipeline-design` → CI/CD
- `verification-before-completion` → ship gate

The agent loads each as the task progresses — you don't manually orchestrate.

---

## When Skills Disagree

If two skills give conflicting advice, **user instructions win**:

```
1. User's explicit instructions (CLAUDE.md, AGENTS.md, direct request)  ← highest
2. Skills
3. Default agent behavior                                                ← lowest
```

If `CLAUDE.md` says "no TDD" and a skill says "always TDD" — follow `CLAUDE.md`.

---

## Anti-patterns

### ❌ Loading every skill "just in case"
Skills cost context tokens. Trust auto-discovery — the agent loads what matches.

### ❌ Skipping process skills
Jumping straight to implementation without `brainstorming` or `writing-plans` produces shallow work. The discipline skills exist because skipping them produced bad results.

### ❌ Treating skills as optional
Discipline skills like `test-driven-development`, `systematic-debugging`, `verification-before-completion` are rigid. Don't rationalize past them.

### ❌ Reading SKILL.md files manually
Use the `Skill` tool — it loads the skill correctly. Reading the file with `Read` doesn't activate the skill in the agent's context.

---

## Contributing

To add a new skill to this catalog:

1. **Scaffold** with `skill-creator`:
   ```bash
   npx skills init my-new-skill
   ```

2. **Author** following `writing-skills`:
   - Write the description first (when to use, NOT what it does)
   - Test the baseline (RED): can subagents do the task without the skill?
   - Write the skill body (GREEN): minimal content addressing failures
   - Close loopholes (REFACTOR): rationalization table, red flags

3. **Add to catalog:**
   - Append to [SKILLS.md](SKILLS.md) under the right category
   - Update [skills.json](skills.json) with the entry
   - Add to the appropriate file in [categories/](categories/)

4. **PR** to this repo with:
   - Baseline test transcripts (RED)
   - With-skill test transcripts (GREEN)
   - Rationalization table from refactoring

---

## Token Budget

Skills cost context. Target word counts:

| Skill role | Target | Why |
|---|---:|---|
| `using-superpowers`, `find-skills` (loaded every session) | <200 words | Loaded into every conversation |
| Most skills (loaded on match) | <500 words | Many can load at once |
| Heavy-reference skills (e.g. `pptx`) | inline <200 + linked refs | Body stays small; refs load on demand |

Run `wc -w SKILL.md` to check.

---

## Help

- **Catalog:** [SKILLS.md](SKILLS.md)
- **Install:** [INSTALL.md](INSTALL.md)
- **Find a skill:** type `/find-skills` in any supported agent
- **Skill spec:** https://agentskills.io/specification
- **Browse online:** https://skills.sh/
