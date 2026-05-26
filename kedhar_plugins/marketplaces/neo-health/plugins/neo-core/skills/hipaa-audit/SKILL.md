---
name: hipaa-audit
description: Composite audit covering PHI handling + AuditEvent coverage + Provenance shape. Orchestrates phi-handling-check, audit-event-check, and provenance-check in a single fhir-auditor invocation. Use when a change touches patient-data flow, audit logging, or write-traceability and you want all three angles in one report.
---

# /neo-core:hipaa-audit

Run all three HIPAA atomic audits in one shot and produce a combined report.

## When to use

- Before opening a PR that touches patient-data flow, audit logging, or anything in `apps/backend/src/storage/` or `apps/backend/src/common/`.
- When you'd otherwise run all three of `phi-handling-check`, `audit-event-check`, `provenance-check` separately.
- As one piece of `/neo-core:full-review` (which adds FHIR + generic code review on top).

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Running combined HIPAA audit on branch `<name>` vs dev — three focuses in one pass."

3. **Delegate to the `fhir-auditor` sub-agent** with multi-focus. Pass it: "Audit `git diff dev...HEAD` per your scope. Cover three focuses in one report: `phi-handling`, `audit-event`, `provenance`. Output a separate section per focus, then a single Verdict paragraph."

4. **Surface the report verbatim.**

5. **If the Verdict is "needs significant rework"** or there are Critical findings, append a one-liner: "For FHIR/Medplum + generic code-review concerns on the same diff, run `/neo-core:full-review`." Don't run it automatically.

## What this skill is NOT

- Not FHIR/Medplum auditing (use `/neo-core:fhir-medplum-audit`).
- Not generic code review (use `/neo-core:code-review`).
- Not all three at once (use `/neo-core:full-review`).
- Not a fix-it skill.
