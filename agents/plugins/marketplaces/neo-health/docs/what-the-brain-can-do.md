# What the second brain can do for you

Reference catalog of every capability the Neo Health team-shared Claude brain ships today. Use this to figure out which skill / tool / agent fits the work in front of you.

## The mental model in one paragraph

The "brain" is three things working together: (1) **shared context** that loads automatically every time anyone opens Claude in the monorepo (root + per-app `CLAUDE.md`), (2) **skills** you invoke as `/neo-core:<name>` to run specific procedures, and (3) the **vault** — a knowledge base of ADRs, playbooks, PRDs, and module notes that Claude reads via the MCP server. Skills delegate heavy work to two **sub-agents** (each with its own context window) so your main session stays clean.

## At a glance — what to use when

| You want to... | Use this | Where |
|---|---|---|
| Review your branch before opening a PR | `/neo-core:full-review` | Claude Code |
| Just check generic code quality (no FHIR/HIPAA) | `/neo-core:code-review` | Claude Code |
| Audit FHIR/Medplum correctness only | `/neo-core:fhir-medplum-audit` | Claude Code |
| Audit HIPAA / PHI / audit-event coverage only | `/neo-core:hipaa-audit` | Claude Code |
| Check one specific concern (e.g., FHIR spec only, or Provenance only) | One of the 6 atomic skills | Claude Code |
| Convert a long PRD into structured vault notes | `/neo-core:prd-to-vault` | Claude Code (curator) |
| Audit the vault for stale/broken pages | `/neo-core:lint-vault` | Claude Code (curator) |
| Propagate a fact change across many vault pages | `/neo-core:update-vault` | Claude Code (curator) |
| Move something useful from your personal memory into the team brain | `/neo-core:promote-to-team` | Claude Code |
| Find which file/module does X without grepping | Just ask Claude | Claude Code (uses codebase-investigator agent) |
| Look up something in the vault from Claude.ai | Just ask | Claude.ai (uses MCP) |
| Write a PRD that knows our codebase | Open the "Neo Health PRD writer" Project | Claude.ai |
| See what FHIR resources we already model | Ask Claude or call `list_fhir_resources_used` | Anywhere |

## The 14 skills, grouped

### Code review skills (4)

These review your branch (`git diff dev...HEAD`) and produce focused Markdown reports with file:line citations.

| Skill | What it checks | Sub-agent | Body lines |
|---|---|---|---|
| `/neo-core:code-review` | Generic: bugs, security (OWASP), performance, naming, dead code, missing tests, doc drift. **Not FHIR/HIPAA-aware** — flags those at the end as "out of scope". | code-reviewer | ~40 |
| `/neo-core:fhir-medplum-audit` | **Composite**: runs the 3 FHIR atomics (`fhir-resource-check`, `backend-fhir-impl-check`, `medplum-usage-check`) in one fhir-auditor invocation; one report with three Focus sections + verdict. | fhir-auditor (one call, three focuses) | ~40 |
| `/neo-core:hipaa-audit` | **Composite**: runs the 3 HIPAA atomics (`phi-handling-check`, `audit-event-check`, `provenance-check`); same shape as fhir-medplum-audit. | fhir-auditor (one call, three focuses) | ~40 |
| `/neo-core:full-review` | **Top-level composite**: orchestrates code-review + fhir-medplum-audit + hipaa-audit. Single merged report with consolidated Critical-issues list at the top. The "is this branch ready to ship?" check. | code-reviewer + 2× fhir-auditor | ~70 |

### FHIR/Medplum atomic skills (3)

Each focuses on a single concern. Use these directly if you want narrower scope than `/neo-core:fhir-medplum-audit`.

| Skill | Single focus |
|---|---|
| `/neo-core:fhir-resource-check` | FHIR R4 spec compliance — resource types, fields, value sets, Reference shape, cardinality, code systems. |
| `/neo-core:backend-fhir-impl-check` | Our backend FHIR-layer conventions — DTO shape vs resource, validator presence, custom-endpoint naming, error translation, no FHIR types in frontend bundles. |
| `/neo-core:medplum-usage-check` | Medplum SDK as a data layer — appropriate client methods, no batch abuse, no Medplum types crossing module boundaries unnecessarily. |

### HIPAA atomic skills (3)

Each focuses on a single concern. Use these directly if you want narrower scope than `/neo-core:hipaa-audit`.

| Skill | Single focus |
|---|---|
| `/neo-core:phi-handling-check` | PHI flow — `PhiErrorFilter` coverage, no raw PHI in logs/errors, sanitization at boundaries, no real PHI in test fixtures. |
| `/neo-core:audit-event-check` | AuditEvent / `AuditInterceptor` coverage — protected reads/writes covered, dashboard batching protocol preserved (5-min dedup, `X-Audit-Context` header, access-denial filter), 4xx responses still emit events. |
| `/neo-core:provenance-check` | Provenance creation on writes that need provider-of-record traceability, with correct `agent`/`recorded`/`target` shape. |

### Vault management skills (3)

Curator-only. Use these to maintain the knowledge base.

| Skill | What it does |
|---|---|
| `/neo-core:prd-to-vault` | Takes a long PRD draft (e.g., from `vault/drafts/raw-prds/feature-x.md`) and produces structured `vault/prds/<slug>/{overview,requirements,dependencies,open-questions}.md` with `[[wikilinks]]` to existing modules/ADRs/playbooks. Updates `vault/index.md` + appends to `vault/log.md`. **Never auto-commits** — shows you the proposed files, you decide. |
| `/neo-core:lint-vault` | Read-only vault audit. Reports: page-format violations (missing/malformed frontmatter), orphan pages (no inbound wikilinks, not in any index), stale `last_updated` (> 6 months on `status: active`). Output is a numbered fix list. |
| `/neo-core:update-vault` | Propagate a coordinated fact change ("we no longer use X, we use Y") across pages that reference X. **Dry-run by default** — produces a preview file showing every proposed edit. Hard fan-out limit (10 files default, 30 absolute). Curator manually approves. |

### Bridge skill (1)

| Skill | What it does |
|---|---|
| `/neo-core:promote-to-team` | Lists recent entries from your personal `~/.claude/projects/<repo>/memory/` (auto-memory). You pick which ones the team should benefit from. Skill classifies the destination (root `CLAUDE.md` line, vault playbook, or new atomic skill), sanitizes for HIPAA, opens a PR. **Never auto-merges.** This is how per-developer learning compounds into team-shared knowledge. |

## The 2 sub-agents

Skills delegate to these. They run in their own context window so your main conversation stays clean.

| Agent | Used by | Tools | Behavior |
|---|---|---|---|
| `code-reviewer` | `/neo-core:code-review` and `/neo-core:full-review` | Glob, Grep, Read, Bash | Reads `git diff dev...HEAD`, surveys surrounding code, returns a Markdown report grouped by severity (Critical / Important / Minor / Nits / Verdict). Read-only. ~600-word budget. |
| `fhir-auditor` | All 6 FHIR/HIPAA atomic skills + the 2 FHIR/HIPAA composite skills + `/neo-core:full-review` | Glob, Grep, Read, Bash | Audits the diff for FHIR/Medplum/HIPAA correctness. Takes a `focus` parameter from the invoking skill so it knows which of 6 angles to apply. Read-only. ~700-word budget per focus. |

You can also reach the **codebase-investigator** sub-agent, which lives in the monorepo (not the plugin) — it auto-loads via the monorepo's `.claude/agents/`. Use it for "where is X" questions.

## The 5 MCP tools

When you (or the boss) ask Claude something the vault can answer, Claude calls these tools instead of grepping the codebase. They're served by the hosted MCP server (or a local stdio version, see [setup-from-zero.md](setup-from-zero.md)).

| Tool | Args | Returns | When Claude uses it |
|---|---|---|---|
| `vault_search` | `query`, `scope?` ("dev" or "all") | Up to 10 ranked path + title + snippet matches | Free-form "find something in the vault" queries. Devs default to `scope: "dev"`; boss's Claude.ai uses `scope: "all"` to also see drafts. |
| `vault_read` | `path` (e.g., `adrs/0001-medplum-as-data-layer.md`) | Full file contents + parsed frontmatter | After `vault_search` finds something interesting, to read the full text. |
| `module_summary` | `name` (e.g., `PatientModule`, `auth`, `fhir`) | The matching `vault/modules/<slug>.md` if it exists, else a hint to use `vault_search` | Quick lookup for "what's the deal with module X." |
| `find_related_prds` | `description`, `scope?` | Up to 10 ranked PRD overview snippets, fuzzy-matched | Boss's PRD-drafting flow uses this with `scope: "all"` to find his own raw drafts + structured PRDs in one query. |
| `list_fhir_resources_used` | (no args) | Sorted list of FHIR resource module names | "What FHIR resources do we already model?" — sources from the curator-maintained `vault/modules/fhir-resources.md`. |

## The PostToolUse typecheck hook

Fires automatically every time Claude edits a `.ts` or `.tsx` file. Runs `pnpm --filter ./apps/<app> typecheck` (or `./packages/<pkg>`) on the affected workspace. If typecheck fails, Claude sees the diagnostic and can fix or revert. If the workspace has no `typecheck` script (e.g., `packages/eslint-config`), the hook silently skips.

This means: **bad edits don't compound silently**. If Claude introduces a type error, the next operation surfaces it.

## The 2 GitHub Actions in claude-config

| Workflow | When it fires | What it does |
|---|---|---|
| `vault-validate.yml` | Every push + PR to `dev`/`main` | Runs the vault validator: index files have content, log files chronologically ordered, no unresolved git conflict markers anywhere under `vault/`. On failure: auto-opens an issue tagged `vault-conflict`. |
| `vault-guardrail.yml` | Every push to `dev`/`main` | Checks each commit's author email against the `BOSS_EMAILS` repo variable. If a boss commit touches anything outside `vault/drafts/**`, **whole-commit revert** + auto-open an issue tagged `boss-overreach`. Curator + dev commits are unaffected. Disable temporarily via Actions UI. |

## The 1 GitHub Action in the monorepo

| Workflow | When it fires | What it does |
|---|---|---|
| `claude-review.yml` | Every PR open / sync / reopen against `dev`/`main` | Installs the `neo-health` marketplace + `neo-core` plugin in the action's runner, then runs `/neo-core:full-review` on the PR diff. Posts the report as a PR review comment. Path filters skip docs-only and storybook-only PRs to control API spend. Job-level timeout 15 min. |

## The shared context (CLAUDE.md hierarchy)

These load automatically every session — you don't invoke them.

| File | Loads when | Contents |
|---|---|---|
| `CLAUDE.md` (monorepo root) | Every session in the monorepo | App/port table, monorepo commands, git workflow (base branch `dev`), HIPAA / PHI no-go list, conventions, pointers to per-app files |
| `apps/backend/CLAUDE.md` | When Claude reads any file under `apps/backend/` | NestJS module map, Medplum-as-data-layer rule, FHIR conventions, audit pipeline checklist, Prisma + BullMQ workflows, patient-side AuditEvent batching protocol |
| `apps/provider/CLAUDE.md` | When Claude reads any file under `apps/provider/` | Next.js + TanStack Query + Radix conventions, route map, Cypress workflow |
| `apps/admin/CLAUDE.md` | When Claude reads any file under `apps/admin/` | Admin dashboard conventions, route map, elevated-permissions warning |
| `apps/patient/CLAUDE.md` | When Claude reads any file under `apps/patient/` | Read-mostly app rules, AuditEvent batching protocol, "treat every screen as PHI" |

This is the cheap, always-on layer of the brain. Token cost is bounded because per-app files only load when relevant.

## The vault structure (knowledge base)

Two tiers. The MCP enforces the split via `scope` filters.

### Curated tier — `vault/{adrs,prds,playbooks,runbooks,modules}/`

What devs see by default. Curator-controlled. Edits go through PRs (or the curator's local Obsidian Git).

| Folder | What lives here | Currently |
|---|---|---|
| `adrs/` | Architecture decisions, dated, one per file | 1 seed ADR (Medplum-as-data-layer) |
| `prds/` | Structured product requirements (output of `/neo-core:prd-to-vault`) | empty — populated as PRDs land |
| `playbooks/` | Common workflows | 2 seed playbooks (add-fhir-resource-module, testing-the-second-brain-rollout) |
| `runbooks/` | Incident playbooks | empty |
| `modules/` | Per-module summary notes (one per NestJS module / Next.js feature) | empty |

### Drafts tier — `vault/drafts/{raw-prds,ideas,research}/`

Boss-writable. **Append-only** — once a draft becomes input to a structured PRD, edits go to the curated PRD, not back to the draft. Excluded from devs' default MCP queries; included in boss's `scope: "all"`.

| Folder | What lives here |
|---|---|
| `drafts/raw-prds/` | Boss's long-form PRD drafts |
| `drafts/ideas/` | Brainstorms, future-feature notes |
| `drafts/research/` | Competitor research, market notes |

## Where everything is

| Thing | Path |
|---|---|
| Plugin source | `claude-config/plugins/neo-core/` |
| Skills | `claude-config/plugins/neo-core/skills/<name>/SKILL.md` |
| Sub-agents | `claude-config/plugins/neo-core/agents/<name>.md` |
| PostToolUse hook | `claude-config/plugins/neo-core/hooks/{hooks.json, scripts/typecheck-touched-ts.mjs}` |
| Vault | `claude-config/vault/` |
| MCP server | `claude-config/mcp-server/` (Node.js + TypeScript) |
| `vault-validate` workflow | `claude-config/.github/workflows/vault-validate.yml` |
| `vault-guardrail` workflow | `claude-config/.github/workflows/vault-guardrail.yml` |
| Monorepo shared context | `neo-monorepo/CLAUDE.md` + `neo-monorepo/apps/<app>/CLAUDE.md` |
| Monorepo plugin wiring | `neo-monorepo/.claude/settings.json` (`extraKnownMarketplaces`, `enabledPlugins`) |
| Monorepo MCP wiring | `neo-monorepo/.mcp.json` |
| Monorepo CI review | `neo-monorepo/.github/workflows/claude-review.yml` |
| codebase-investigator agent | `neo-monorepo/.claude/agents/codebase-investigator.md` |

## How the team brain compounds over time

Three loops, in order of friction (lowest to highest):

1. **Per-developer auto-memory**. Already on by default. Every Claude Code session writes to `~/.claude/projects/<repo>/memory/` — discoveries stick to your local machine. Personal knowledge grows passively.

2. **Promote-to-team**. When a personal lesson is broadly useful, run `/neo-core:promote-to-team`. Skill drafts a sanitized version + opens a PR. Manual review approves. The team brain grows by deliberate, reviewed contribution.

3. **Vault edits via Obsidian or PR**. For larger contributions (new ADRs, new playbooks, new module notes), edit directly in Obsidian (auto-commits to the repo) or open a PR. Curator runs `/neo-core:lint-vault` periodically to catch drift.

The vault is the team's long-term memory; auto-memory is each dev's short-term memory; `/neo-core:promote-to-team` is how short-term becomes long-term.

## Things the brain does NOT do

For honesty:

- **It doesn't write code for you.** Skills produce reviews, audits, and structured documents. Implementation is still on the human.
- **It doesn't catch every bug.** The skills are good at structural and convention issues. Subtle logic bugs need human review or tests.
- **It doesn't replace `pnpm typecheck` or `pnpm lint`.** Those run faster and catch their categories. Skills cover what those can't.
- **It doesn't compound automatically across the team.** `/neo-core:promote-to-team` is the bridge, but it requires you to invoke it. Personal `MEMORY.md` doesn't sync to teammates by itself.
- **It doesn't know the future.** New ADRs/playbooks/modules don't appear by themselves — someone has to write them.
- **It can't audit code it can't read.** If a private submodule isn't checked in, audit skills miss it.

## Want to extend it?

- **Add a new atomic skill**: drop `plugins/neo-core/skills/<name>/SKILL.md` following the existing atomic-skill pattern (`fhir-resource-check` is the simplest model). Bump `plugin.json` version. Push.
- **Add a new ADR**: `vault/adrs/<NNNN>-<slug>.md` following the page format in `vault/README.md`. Update `vault/index.md` + `vault/log.md`.
- **Add a module summary**: `vault/modules/<slug>.md`. Keep under ~500 tokens for retrieval-friendliness.
- **Tune a skill's prompt**: edit `plugins/neo-core/skills/<name>/SKILL.md` or `plugins/neo-core/agents/<name>.md`. Bump version. Push. Devs `/plugin update`.
- **Add a new MCP tool**: edit `mcp-server/src/tools/<new-tool>.ts`, register in `server.ts`. Bump `mcp-server/package.json` version. Redeploy via Railway (auto on push). 

## Related docs

- [setup-from-zero.md](setup-from-zero.md) — get a fresh laptop ready for either dev or non-dev use
- [deploy-mcp-on-railway.md](deploy-mcp-on-railway.md) — stand up the hosted MCP server
- [boss-onboarding.md](boss-onboarding.md) — the verbatim Claude.ai system prompt for the non-dev Project
- [`README.md`](../README.md) — repo overview, install path, version-pin policy
- `vault/playbooks/testing-the-second-brain-rollout.md` — comprehensive verification plan
