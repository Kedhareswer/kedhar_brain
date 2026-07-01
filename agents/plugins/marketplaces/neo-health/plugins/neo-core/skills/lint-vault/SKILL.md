---
name: lint-vault
description: Audit the vault for structural/format issues — page-format violations (missing or malformed frontmatter), orphan pages (no inbound wikilinks), stale last_updated (> 6 months on status active), and (Phase 4) missing concept pages. Read-only; produces a numbered fix list. Run by the curator periodically or before a major release.
---

# /neo-core:lint-vault

Audit the vault for structural and format issues. Read-only — produces a fix list, doesn't make changes.

## When to use

- Periodically (monthly during the first quarter; quarterly after) as vault hygiene.
- After a `/neo-core:update-vault` run to verify the multi-file edit didn't break anything.
- Before bumping the `claude-config` major version.

## Procedure

1. **Verify you're in the claude-config repo.** Check that `vault/index.md` and `vault/README.md` exist. If not, tell the user "this skill runs against the claude-config vault — change directory there first" and stop.

2. **Run the four checks below in order.** Each check is a Glob + Read + analysis pass. Report findings in a single Markdown report at the end — don't interleave check output with intermediate logs.

### Check A — page format compliance (Phase 2 scope)

For every `.md` under `vault/{adrs,prds,playbooks,runbooks,modules}/` (curated tier) AND `vault/drafts/{raw-prds,ideas,research}/` (drafts tier), verify:

- File starts with a YAML frontmatter block (`---\n...\n---`).
- Frontmatter has `title`, `type`, `status`, `last_updated`. (`sources` and `related` are optional but recommended.)
- `type` is one of: `adr`, `playbook`, `runbook`, `module`, `prd`. (For drafts, `type` may be missing — that's OK; flag only for curated.)
- `status` is one of: `draft`, `active`, `superseded`.
- `last_updated` parses as `YYYY-MM-DD`.
- Body has a `**Summary**:` line within the first ~10 lines after the frontmatter.

Report each violation as: `path:line — <what's wrong>`.

### Check B — orphan pages (Phase 2 scope)

A page is an "orphan" if no other page in the vault has a `[[wikilink]]` pointing to it. The exceptions:
- `vault/index.md`, `vault/log.md`, `vault/README.md`, `vault/drafts/index.md`, `vault/drafts/log.md` — never orphans (they're entry points).
- Pages whose own filename matches an entry in `vault/index.md` or `vault/drafts/index.md` (the index counts as an inbound link).

For each orphan, report: `path — no inbound wikilinks; not listed in any index`.

Implementation hint: walk every `.md`, collect all `[[<slug>]]` patterns. Then for each page, check whether its slug is in that set OR in either index file.

### Check C — stale last_updated on active pages (Phase 2 scope)

For every curated page with `status: active` and `last_updated` more than **6 months** before the current date, report: `path — last_updated is YYYY-MM-DD (>6 months); review or supersede`.

Use `Bash date "+%Y-%m-%d"` for the current date. Don't hardcode.

### Check D — missing concept pages (Phase 4 scope, deferred)

This check is intentionally **not implemented in Phase 2**. When Phase 4 ships, it will:
- Walk every page, collect every `[[wikilink]]` reference.
- For each unique link target, check whether `vault/<wherever>/<slug>.md` exists.
- Report broken wikilinks AND mentions of named concepts (e.g., capitalized terms followed by "module") that don't have their own page.

For now, output: `Check D (missing concept pages) — deferred to Phase 4. Skipping.`

### Contradiction detection (intentionally NOT implemented)

The Karpathy pattern includes contradiction detection across pages. We deliberately skip it — it requires reasoning over the whole vault and gets expensive as the vault grows. Citations + good page format prevent most contradictions; we'll add this only if the lack proves painful.

## Report format

```markdown
# Vault lint: <ISO date>

**Files scanned**: N curated + M drafts | **Issues**: <total>

---

## Page format violations (N)

(numbered list with `path:line — issue` per item)

## Orphan pages (N)

(list with `path — issue` per item)

## Stale active pages (N)

(list with `path — last_updated YYYY-MM-DD; review or supersede`)

## Check D (deferred to Phase 4)

(one line — skipped)

## Suggested next steps

(one short paragraph: which fixes are most urgent, which can wait)
```

If a section has zero findings, write `(no findings)` under it. A clean lint report is informative.

## What this skill is NOT

- Not a fix-it skill. Produces a list; the curator decides what to act on. Multi-file fixes for renames/concept-extraction usually flow through `/neo-core:update-vault`.
- Not a contradiction detector (deliberately deferred).
- Not invoked automatically. The Phase 2 `vault-validate` GitHub Action does a narrower CI check (format + conflict markers); this skill is the deeper periodic audit.
