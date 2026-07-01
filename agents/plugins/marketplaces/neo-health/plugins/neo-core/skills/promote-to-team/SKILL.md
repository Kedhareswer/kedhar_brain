---
name: promote-to-team
description: Pull a high-value entry from your personal ~/.claude/projects/<this-repo>/memory/ (auto-memory) and propose it as a team-shared addition — a CLAUDE.md line, a vault note, a new playbook, or a new atomic skill. Sanitizes for HIPAA, rephrases first-person to team-voice, opens a PR against claude-config (or the monorepo for CLAUDE.md edits). Manual review is the gate; this skill makes the work ergonomic. Curator + opt-in devs only.
---

# /neo-core:promote-to-team

Move a useful entry from your personal auto-memory into the team's shared brain. The bridge between per-developer learning and team-shared compounding knowledge.

## When to use

- After a session where Claude learned something genuinely useful — a discovered convention, a hidden gotcha, a corrected misunderstanding — and you want the rest of the team (and Claude on their machines) to benefit.
- Periodically as cleanup: review your own `~/.claude/projects/<this-repo>/memory/` and decide which entries are personal-only vs team-worth.
- Don't use it for personal preferences (commit attribution rules, editor style, etc.) — those stay personal.

## Procedure

1. **Confirm the user has auto-memory entries to review.** Check `~/.claude/projects/C--Neo-dev-neo-monorepo/memory/MEMORY.md` (Windows path; adjust for OS). If the file is empty or doesn't exist, tell the user "no auto-memory yet — nothing to promote" and stop.

2. **List recent entries with one-line summaries.** Read the MEMORY.md index plus the most recent ~5-10 individual entry files. Show the user a numbered list:
   ```
   Recent auto-memory entries:
   1. feedback_no_claude_commit_attribution.md — never add Co-Authored-By Claude trailers
   2. project_patient_audit_events.md — patient FHIR AuditEvent batching protocol
   3. ...
   ```
   Ask: "Which entry/entries should we consider promoting?" Wait for the user's selection — do NOT guess.

3. **For each selected entry, read it in full and classify the destination**:

   | Looks like... | Destination | Why |
   |---|---|---|
   | Personal preference (commit format, language style) | **Stay personal** — don't promote. Tell the user, suggest leaving it. |
   | General team convention (e.g., "always run `pnpm setup:claude` after onboarding") | **Root `CLAUDE.md`** in the monorepo, one line under an appropriate section. |
   | Domain-specific procedure (e.g., the FHIR audit batching) | **Vault playbook** at `vault/playbooks/<slug>.md`, full-page format. |
   | Discovered codebase pattern (e.g., "Prisma migrations with NOT NULL need a backfill") | **Vault playbook** OR a new section in `apps/backend/CLAUDE.md`. Prefer the playbook for anything > 5 lines. |
   | Recurring procedural workflow (e.g., "before adding a NestJS module, do X, Y, Z") | **New atomic skill** — propose adding it to `plugins/neo-core/skills/<slug>/SKILL.md`. |

   Be honest in classification. If you're unsure, ask the user.

4. **Sanitize**:
   - Scrub anything that looks like a real patient identifier, real provider name, real email, real Medplum project ID, real auth token. Replace with `<placeholder>` or generic descriptions.
   - Rephrase from first-person ("I learned that...") to team-voice ("The team uses..."), or imperative ("When adding a new module, do...").
   - Remove machine-local details (file paths under `~/`, tool versions you happen to have, your git config).

5. **Generate the proposed change**. Format depends on destination:

   - **Root `CLAUDE.md` line**: a one-line edit, presented as a unified diff for the user to review. Show exactly which existing section it would land under.
   - **Vault playbook**: a full new page following the page format in `vault/README.md` (frontmatter + Summary + Body + Related + Citations). Use the auto-memory entry as a `(source: ...)` citation if it makes sense; otherwise cite the underlying code/PR.
   - **New atomic skill**: full SKILL.md following the same shape as existing atomics (e.g., `vault/playbooks/add-fhir-resource-module.md`'s style). Plus a 1-line addition to the README's phase status.

6. **Show the user the proposed change** as a single Markdown block. Then ask: "Open a PR with this against `<repo>`/`<branch>`? [yes/edit/no]".
   - **yes**: branch off `dev` in the relevant repo with name `chore/promote-<slug>`, write the change, commit with a `chore(claude): promote <slug>` message, push, ask the user if they want to open a GitHub PR (you don't have `gh` CLI — surface the URL `https://github.com/<repo>/compare/dev...<branch>` so they can click).
   - **edit**: take the user's edits inline, then re-prompt yes/edit/no.
   - **no**: drop without changes. Tell the user the entry stays in their personal memory.

7. **For changes against `claude-config`** (vault note, new skill): bump the plugin patch version (`0.7.0 → 0.7.1`) and update the README phase-status if a new skill was added. Include in the same commit.

8. **For changes against the monorepo** (root `CLAUDE.md` edit, new section): also tag the issue/PR description with `claude-config promotion` so it's findable later when reviewing what's been promoted.

9. **Append to `vault/log.md` only if the change lands in the vault.** For monorepo `CLAUDE.md` changes, no vault log entry is needed.

10. **Report back to the user**: branch name, commit SHA, PR URL (or compare URL), which destination, what was sanitized.

## Critical safety rails

- **Never auto-merge.** Always opens as a PR for human review.
- **Never include real PHI**, even via auto-memory entries — the sanitization step is non-negotiable. If the entry contains anything that *might* be PHI and you can't be 100% sure it's synthetic, **flag it and stop** rather than promoting.
- **Don't promote without user picking.** Step 2's "ask the user" is mandatory — promoting auto-memory automatically is not the goal; ergonomic manual promotion is.
- **Don't mass-promote.** One entry per invocation by default. If the user picks 3 entries, do 3 separate PRs (or one PR with 3 commits, your call — ask the user) so each can be reviewed independently.

## What this skill is NOT

- Not a personal-memory editor — leave the user's auto-memory file alone (the entries stay there as personal record after promotion).
- Not invoked by the boss — auto-memory is a Claude Code (CLI) thing; the boss uses Claude.ai which doesn't have it.
- Not the ONLY way knowledge enters the team brain — direct PRs to vault/playbooks/, new ADRs, etc. are equally valid. This skill exists to make promotion of incidental learnings ergonomic.
- Not a fix-it skill — proposes a change; human review approves and merges.
