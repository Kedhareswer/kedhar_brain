---
name: update-vault
description: Propagate a fact change ("we no longer use X, we use Y") across all vault pages that reference X. Dry-run by default — produces a preview markdown showing every proposed edit; the curator manually approves before committing. Hard fan-out limit (10 files default, 30 absolute) prevents runaway mass-edits. Run by the curator only.
---

# /neo-core:update-vault

Propagate a coordinated fact change across the vault. **Dry-run by default**. Curator-only.

## When to use

- A foundational decision changes (e.g., "we move from MinIO to S3", "Medplum updated its `Reference` shape", "the AuditEvent dedup window is now 10 minutes, not 5"). The vault has many pages mentioning the old fact; you want them updated coherently.
- An ADR is superseded; you want to update every page that links to it to reflect the new ADR's guidance.
- A module is renamed; every page mentioning the old name needs updating.

If only ONE page needs editing, just edit it directly — don't invoke this skill.

## Critical safety rails

This skill can mass-edit the vault. The rails:

1. **Dry-run by default.** The skill produces a single preview markdown file (`/tmp/update-vault-preview.md` or similar) showing every proposed edit with diff context. **It does NOT write any vault files.** The curator reviews the preview and explicitly approves before any actual edit.

2. **Fan-out limit.** Default cap: edit at most **10 files** in one run. To override, the user must explicitly say "with `--max-files=N`" — and the absolute cap is **30 files**. If the change touches more than 30 files, refuse and ask the curator to split the change into smaller propagations.

3. **Curator-only.** Don't run this for the boss or other devs. The skill checks `git config user.email` against a curator allowlist (read from `vault/README.md`'s shadow-curator section) and warns if the user isn't listed.

4. **No embeddings.** Use `index.md` + `Grep` to find pages. Vector search is overkill and harder to audit.

5. **Backup the vault state in the preview.** The preview file includes the git commit SHA at preview time, so the curator knows which state the proposed edits were generated against. If the vault changed after preview, the skill will refuse to apply (curator must regenerate preview).

## Inputs

The skill takes two arguments:

```
/neo-core:update-vault before="old fact text" after="new fact text"
```

Optionally:

```
/neo-core:update-vault before="..." after="..." --max-files=15
```

If arguments aren't provided, ask the curator. Do NOT proceed without an explicit before/after pair.

## Procedure

1. **Verify curator status.** Run `git config user.email`. Compare against the curator/shadow-curator emails in `vault/README.md`. If the user isn't listed, warn loudly and ask "are you sure? [yes/no]" before proceeding.

2. **Verify you're in the claude-config repo.** Same check as `lint-vault`.

3. **Find candidate pages.** Use `Grep -l "<before-text>" vault/` (case-insensitive optional). Collect file list. If empty, tell the user "no occurrences of '<before>' in the vault — nothing to update" and stop.

4. **Apply the fan-out limit.** If the candidate list exceeds the configured max (default 10), refuse and report the count: "found <N> matching files; --max-files default is 10. Re-invoke with --max-files=<N> to proceed (capped at 30)."

5. **Generate the preview.** For each candidate file:
   - Read the file.
   - Find every line containing `<before-text>`.
   - Generate the proposed line with `<before-text>` replaced by `<after-text>`.
   - Add a 3-line context window around each change.
   - Render as a unified-diff style block in the preview.

6. **Write the preview** to `/tmp/update-vault-preview-<timestamp>.md` (or platform-equivalent — use `Bash mktemp` if available). Include at the top:
   - The before/after pair.
   - The git commit SHA at preview time.
   - The number of files + total line changes.
   - A one-line "to apply: re-invoke with --apply preview=<path>" instruction.

7. **Show the curator a summary** (not the full preview — they'll open the file):
   - "Preview at: `<path>`"
   - "Proposed: edit N files (M lines)."
   - "Review the preview, then re-invoke with `--apply preview=<path>` to apply, OR edit the preview file directly to remove changes you don't want before applying."

8. **If invoked with `--apply preview=<path>`**:
   - Read the preview file.
   - Verify the git commit SHA at the top matches the current `git rev-parse HEAD`. If not, refuse: "vault changed since preview was generated; regenerate the preview."
   - Apply each edit in the preview as a `Edit` op (the curator may have hand-edited the preview to drop or modify proposed changes — apply only what's still in the preview).
   - Update `vault/index.md` and append to `vault/log.md` with one entry recording the bulk update:
     ```
     ## [YYYY-MM-DD HH:MM TZ] update-vault | "<before>" -> "<after>"
     - vault/<file1> (updated)
     - vault/<file2> (updated)
     ...
     ```
   - Tell the curator what changed and remind them to commit.

## What this skill is NOT

- Not a renamer for files (would require `git mv` + redirect handling — separate concern).
- Not a wikilink-rewriter for entire concept renames (use a follow-up `/neo-core:lint-vault` to find broken links, then a second `/neo-core:update-vault` pass).
- Not invoked by the boss or non-curator devs.
- Not auto-committing — the curator commits + pushes after applying.
