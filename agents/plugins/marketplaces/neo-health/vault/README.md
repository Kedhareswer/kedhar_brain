# Neo Health vault

The team-shared knowledge base — Obsidian-compatible markdown, Karpathy-style discipline, queryable by Claude (today via plain Read/Grep through Obsidian Git, in Phase 3 also through the hosted MCP server).

## Two tiers — read this first

| Tier | Path | Who reads | Who writes | Default in MCP `vault_search` scope |
|---|---|---|---|---|
| **Curated** | `vault/{adrs,prds,playbooks,runbooks,modules}/` | devs + boss + curator | curator (you), via skills like `/neo-core:prd-to-vault` | `scope: "dev"` (always) |
| **Drafts** | `vault/drafts/{raw-prds,ideas,research}/` | boss (default) + curator + opt-in devs | boss (Obsidian) + curator (skills) — **append-only** once published | `scope: "all"` (boss-side) |

The drafts tier is **append-only**: once a draft becomes input to a structured PRD (via `/neo-core:prd-to-vault`), edits go to the curated `vault/prds/<slug>/` files, NOT back to the draft. Treat drafts as immutable provenance.

The curated tier is in default dev context. The drafts tier is gated behind `scope: "all"` so devs don't accidentally pull raw PRD prose into a coding session. Boss's Claude.ai system prompt (Phase 3) explicitly opts into `scope: "all"` so he sees both tiers.

## Per-tier infrastructure

Each tier has its own catalog and log so the MCP can serve them with simple scope filtering:

- **`vault/index.md`** — curated-tier table of contents, organized by category, one-line per entry. Updated by every skill that writes to the curated tier (`prd-to-vault`, `promote-to-team`, `update-vault`).
- **`vault/log.md`** — curated-tier append-only log. One entry per write op: `## [YYYY-MM-DD HH:MM TZ] <op> | <page or summary>`.
- **`vault/drafts/index.md`** — drafts-tier TOC. Updated when boss adds a draft (via Obsidian) or when curator publishes through `/neo-core:promote-to-team`.
- **`vault/drafts/log.md`** — drafts-tier append-only log.

## Page format (enforced by `/neo-core:lint-vault`)

Every curated-tier page should follow this shape. Drafts can be looser (boss's exploratory prose), but adopting the format helps `/neo-core:prd-to-vault` extract structure cleanly.

```markdown
---
title: <page title>
type: adr | playbook | runbook | module | prd
status: draft | active | superseded
last_updated: YYYY-MM-DD
sources:
  - drafts/raw-prds/feature-x.md
  - external://https://example.com/spec
related:
  - "[[other-page]]"
---

# {{title}}

**Summary**: One to two sentences.

## Body

Content with `[[wikilinks]]` to related pages.
Factual claims include `(source: drafts/raw-prds/feature-x.md)` for traceability.

## Related

- [[related-1]]
- [[related-2]]
```

## Wikilink conventions

- Use `[[page-slug]]` (not `[[page-slug.md]]`). The `.md` is implied.
- Slugs are lowercase-hyphen-separated (`patient-onboarding-flow`, not `patientOnboardingFlow`).
- Link by **concept**, not file path. The vault is a graph; let the structure be discoverable from links, not directory layout.
- Avoid duplicate concepts under different slugs. Use `/neo-core:lint-vault` to detect duplicates.

## Citation format

Factual claims that derive from a source should cite it inline:

> Backend wraps Medplum and never exposes raw resources to the frontend (source: `apps/backend/CLAUDE.md`, source: `vault/adrs/0001-medplum-as-data-layer.md`).

Sources can be:
- Vault paths: `(source: vault/adrs/0001-medplum-as-data-layer.md)`
- Drafts: `(source: vault/drafts/raw-prds/feature-x.md)`
- Repo paths: `(source: apps/backend/src/fhir/medplum/medplum.module.ts:42)`
- External URLs: `(source: https://hl7.org/fhir/R4/patient.html)`

`/neo-core:lint-vault` flags claims without citations in pages where citations are expected (ADRs, playbooks).

## Conflict-resolution fallback

Obsidian Git plugin auto-syncs vault changes. ~99% of edits are non-overlapping (different files, different paragraphs) so Git auto-merges silently. The rare true conflict surfaces in Obsidian Git's plugin UI as a red badge, with conflict markers `<<<<<<<` / `=======` / `>>>>>>>` in the file.

To resolve:
1. Open the offending file in any editor (VS Code, plain text, Obsidian itself in source mode).
2. Pick a side or hand-merge.
3. Save. Obsidian Git plugin will commit the resolution on its next pass.

If you can't resolve, ping the curator (and shadow curator below) — vault conflicts are rare enough that we don't need a heavier process.

## Shadow curator

The **primary curator** runs `/neo-core:prd-to-vault`, `/neo-core:promote-to-team`, `/neo-core:lint-vault`, `/neo-core:update-vault`. When the primary is on PTO, a designated **shadow curator** (one senior dev) can run them too. The shadow's PRs to `claude-config` get reviewed by the primary on their return. This keeps the vault flowing without blocking on one person.

Today's roles (update as the team evolves):
- Primary curator: Dmitrii Semenov
- Shadow curator: TBD
