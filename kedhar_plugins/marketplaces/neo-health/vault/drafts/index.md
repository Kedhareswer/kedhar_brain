# Vault index — drafts tier

Hand-curated TOC for everything under `vault/drafts/{raw-prds,ideas,research}/`. Updated when the boss adds a draft (via Obsidian, manually) or when the curator runs `/neo-core:promote-to-team`.

This index is **NOT** in the default dev MCP scope. Devs only see it when they explicitly pass `scope: "all"` to `vault_search`. Boss's Claude.ai always reads both this and `vault/index.md` (his system prompt opts in).

## Raw PRDs (`raw-prds/`)

(none yet — boss adds these via Obsidian)

## Ideas (`ideas/`)

(none yet)

## Research (`research/`)

(none yet)

---

## Maintenance

Same shape as the curated `vault/index.md`: one-line entries `[[wikilink]] — short description (date)`.

Drafts are **append-only**. Once a draft becomes input to a structured PRD (via `/neo-core:prd-to-vault` → `vault/prds/<slug>/`), edits go to the curated PRD, NOT back to the draft. The draft stays as immutable provenance.
