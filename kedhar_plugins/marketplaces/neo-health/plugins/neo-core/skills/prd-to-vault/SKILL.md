---
name: prd-to-vault
description: Convert a long PRD (typically a boss-authored markdown draft in vault/drafts/raw-prds/) into a structured set of cross-linked vault pages under vault/prds/<slug>/ — overview.md, requirements.md, dependencies.md (with [[wikilinks]] to existing modules/ADRs/playbooks), open-questions.md. Updates vault/index.md and appends to vault/log.md. Run by the curator (you), not the boss.
---

# /neo-core:prd-to-vault

Convert a long-form PRD (often pasted into `vault/drafts/raw-prds/`) into a structured, cross-linked set of pages under `vault/prds/<slug>/`. The drafts source stays untouched — drafts are append-only provenance.

## When to use

- After the boss (or anyone) lands a long PRD draft in `vault/drafts/raw-prds/<slug>.md` and you (curator) want to make it dev-context-visible.
- When you have a PRD pasted from elsewhere (Notion, Google Doc) and want to land it in the vault in a queryable shape.
- To rework an existing structured PRD when the underlying draft changed materially (creates a new version under `vault/prds/<slug>-v2/` rather than overwriting — the old version stays as audit trail).

This skill is for **the curator**. The boss writes drafts in his Obsidian; he doesn't run skills.

## Inputs

The skill takes a path to the draft:

```
/neo-core:prd-to-vault drafts/raw-prds/patient-consent-management.md
```

If no path is given, ask the user "which draft? (relative to vault/)". Do NOT guess.

## Procedure

1. **Locate the draft and confirm it exists.** Read it in full. If it's not in `vault/drafts/`, ask the user whether to copy it there first (drafts must live there for traceability).

2. **Derive a slug** from the draft filename — drop the `.md`, lowercase, kebab-case. Example: `patient-consent-management.md` → slug `patient-consent-management`. Confirm with the user before creating files.

3. **Check for collisions.** If `vault/prds/<slug>/` already exists, ask the user: append `-v2`, overwrite, or pick a different slug? Default suggestion: `-v2` (preserves history).

4. **Read related context** so you can produce real cross-links, not invented ones:
   - `vault/index.md` — see what ADRs, playbooks, modules already exist.
   - `vault/drafts/index.md` — see prior drafts.
   - For any module names mentioned in the draft, `Glob vault/modules/*.md` to confirm whether a module page exists for it.
   - Read the draft itself one more time with this context in mind.

5. **Generate four files** under `vault/prds/<slug>/`. Each follows the page format in `vault/README.md` — frontmatter (title/type/status/last_updated/sources/related), `**Summary**`, body, `## Related`, `## Citations` if applicable. Files:

   - **`overview.md`** — 1 short paragraph: problem, goal, success metric. Keep it ≤ 150 tokens. This is the canonical snippet `find_related_prds` returns.
   - **`requirements.md`** — bulleted list of must / should / could. Each requirement is one line. Cite the draft for non-obvious requirements: `(source: drafts/raw-prds/<slug>.md)`.
   - **`dependencies.md`** — explicit `[[wikilinks]]` to ADRs, playbooks, and modules the PRD touches. If the draft references something that doesn't yet have a vault page, list it under "Concepts mentioned but not yet documented" so `/neo-core:lint-vault` will flag it.
   - **`open-questions.md`** — anything ambiguous in the draft, or decisions the team needs to make. One question per bullet.

   `frontmatter.related` on each of the four should cross-link the others (`[[<slug>/overview]]`, etc.) plus the draft itself (`[[drafts/raw-prds/<slug>]]`).

6. **Update `vault/index.md`** — under `## Structured PRDs (prds/)`, add a one-line entry:
   ```
   - **[[prds/<slug>/overview]]** — short summary lifted from overview.md (status, date)
   ```
   Keep alphabetical within section.

7. **Append to `vault/log.md`** — at the top of the entries:
   ```markdown
   ## [YYYY-MM-DD HH:MM TZ] prd-to-vault | <slug>
   - vault/prds/<slug>/overview.md (created)
   - vault/prds/<slug>/requirements.md (created)
   - vault/prds/<slug>/dependencies.md (created)
   - vault/prds/<slug>/open-questions.md (created)
   - vault/index.md (updated — added [[prds/<slug>/overview]])
   ```
   Use the actual current local time. (If you don't know it, ask `Bash date "+%Y-%m-%d %H:%M %Z"`.)

8. **Tell the user what you did** — concisely list the four new files, the index update, and the log entry. Mention any "concepts mentioned but not yet documented" you flagged for follow-up.

9. **Don't auto-commit.** Show the user the file changes; they decide when to commit and push (Obsidian Git plugin will auto-commit if configured, or they `git add . && git commit`).

## Style guidelines for the generated pages

- **Terse, dense, machine-friendly.** Bullet > paragraph when possible. Aim for half the length of the source draft.
- **Linked, not restated.** If a concept has a vault page already, `[[link]]` it instead of re-explaining.
- **Cite the draft.** Every non-obvious requirement gets `(source: drafts/raw-prds/<slug>.md)`. The draft is the source of truth for "what did the boss actually say."
- **No invented details.** If the draft is vague, leave the gap visible (in `open-questions.md`) rather than filling it with plausible-sounding text.

## What this skill is NOT

- Not a fix-it skill — produces vault pages, doesn't change anything else.
- Not a draft editor — drafts are append-only.
- Not for converting PRDs that aren't in the vault. Land them in `vault/drafts/raw-prds/` first.
- Not version control. The git history is the source of truth for "who edited what when"; the page format's `last_updated` is just human-readable.
