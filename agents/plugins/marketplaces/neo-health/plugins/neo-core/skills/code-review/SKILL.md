---
name: code-review
description: Review the current branch's changes (git diff dev...HEAD) for generic code-quality issues — bugs, security, performance, naming, dead code, missing tests. Use this BEFORE opening a PR or as a self-check after a coding session. NOT FHIR/HIPAA-aware (those are separate atomics — use /neo-core:fhir-medplum-audit, /neo-core:hipaa-audit, or /neo-core:full-review for a combined report). Delegates to the code-reviewer sub-agent so the parent context stays clean.
---

# /neo-core:code-review

Run a generic code review of the current branch against `dev`.

## When to use

- **Before opening a PR**, as the author's self-check.
- **During a coding session**, to spot-check work in progress on a feature branch.
- **When asked to "review the latest changes"** without a specific FHIR/HIPAA framing.

If the user asks for a comprehensive review covering FHIR + HIPAA + generic concerns, use `/neo-core:full-review` instead — it orchestrates this skill alongside the FHIR and HIPAA atomics.

## Procedure

1. **Confirm there are changes to review.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If the current branch is `dev` (or there's no diff vs `dev`), tell the user "no changes to review — you're on dev or the branch hasn't diverged" and stop.

2. **Show the user what will be reviewed** (one line, not the full diff):
   - "Reviewing N files changed on branch `<name>` vs dev (+X / -Y lines)."

3. **Delegate to the `code-reviewer` sub-agent.** Pass it the task: "Review `git diff dev...HEAD` per your scope. Return a focused Markdown report grouped by severity."
   - The sub-agent runs in its own context window — it reads the diff, surrounding code, and any auto-loaded `CLAUDE.md` files itself. Don't pre-load any of that for it.
   - The sub-agent's report comes back as the agent's tool result.

4. **Surface the report to the user verbatim** — don't paraphrase or summarize the sub-agent's output. The sub-agent is the reviewer; you're the messenger.

5. **If the report includes "Outside my scope — flag for /neo-core:full-review" items**, append a one-line note to the user: "Sub-agent flagged N items that need FHIR/HIPAA review — run `/neo-core:full-review` for a complete picture." Don't run `/neo-core:full-review` automatically; let the user decide.

## Arguments

This skill takes no arguments today. The diff scope is always `dev...HEAD`. If you want to review a different range (e.g., the last commit only, or a specific file), tell the user to use a Read on the diff and discuss inline rather than invoking this skill.

## What this skill is NOT

- Not a replacement for `pnpm lint` or `pnpm typecheck`. Those run faster and catch the mechanical issues. This skill catches what they can't.
- Not FHIR/HIPAA-aware. Use the FHIR/HIPAA atomic skills or `/neo-core:full-review` for that.
- Not a CI workflow. There's a separate GitHub Action (Phase 4) that runs `/neo-core:full-review` on every PR.
- Not a fix-it skill. It produces a report; the human decides what to act on.
