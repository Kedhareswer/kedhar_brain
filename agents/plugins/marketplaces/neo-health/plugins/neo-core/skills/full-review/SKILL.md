---
name: full-review
description: Top-level ship-readiness review. Runs /neo-core:code-review (generic), /neo-core:fhir-medplum-audit (FHIR + Medplum), and /neo-core:hipaa-audit (PHI + AuditEvent + Provenance) on the current branch and merges the reports into one verdict. Use this before opening a PR that touches FHIR/PHI code paths. Also invoked by the Phase 4 GitHub Action on every PR.
---

# /neo-core:full-review

The "is this branch ready to ship?" review. Combines all three composite audits — generic code review, FHIR+Medplum, HIPAA — into a single report.

## When to use

- Before opening any PR that touches FHIR resources, the Medplum wrapper, patient-data flow, or audit/provenance logic. (Most non-trivial backend PRs qualify.)
- When you want the most comprehensive automated review available before merging.
- As the orchestrator behind the Phase 4 GitHub Action (`.github/workflows/claude-review.yml` in the monorepo).

For pure-frontend PRs that don't touch FHIR/PHI code paths, `/neo-core:code-review` alone is usually enough.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Running full-review on branch `<name>` vs dev — generic code review + FHIR/Medplum + HIPAA. Three sub-agent invocations."

3. **Run the three composites in sequence**, each as a sub-agent invocation:
   - First: invoke the `code-reviewer` sub-agent with the same task as `/neo-core:code-review`.
   - Second: invoke the `fhir-auditor` sub-agent with the multi-focus task from `/neo-core:fhir-medplum-audit`.
   - Third: invoke the `fhir-auditor` sub-agent with the multi-focus task from `/neo-core:hipaa-audit`.

   Run them sequentially (not in parallel) so each can pick up context from the previous if needed (e.g., the HIPAA audit can skip flagging audit-event coverage if the FHIR-impl audit already noted the missing AuditInterceptor wiring).

4. **Merge into one report** with this top-level structure:

   ```markdown
   # Full review: <branch-name> (vs dev)

   **Files changed**: N | **Lines**: +X / -Y | **Top-level summary**: one sentence.

   ## Overall verdict
   One paragraph: ship-ready / ship after critical fixes / needs significant rework. Be honest, not flattering. Calibrate against the worst of the three sub-verdicts.

   ## Critical issues (consolidated, across all three)
   List every Critical finding from any of the three reports, deduplicated, with file:line and a one-line summary. The user reads this first.

   ## Detailed reports

   ### Generic code review
   <code-reviewer report verbatim, sans its own verdict line>

   ### FHIR + Medplum
   <fhir-auditor (fhir-medplum) report verbatim, sans its own verdict line>

   ### HIPAA
   <fhir-auditor (hipaa) report verbatim, sans its own verdict line>
   ```

5. **Don't add your own opinions** to the merged report — the sub-agents are the authorities. Your job is consolidation. Drop their per-report verdicts (since you have one consolidated verdict at top), but keep everything else.

6. **If all three reports come back clean** (no Critical or Important), just write:
   ```
   # Full review: <branch-name> (vs dev) — clean
   No issues across code-review, FHIR/Medplum, or HIPAA. Ship it.
   ```
   Don't pad.

## What this skill is NOT

- Not a single-focus audit. Use the atomic or specific composite skills if you want narrower scope.
- Not a fix-it skill.
- Not a CI replacement on its own — the Phase 4 GitHub Action wraps this skill so it runs on every PR automatically.
