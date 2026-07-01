---
name: fhir-medplum-audit
description: Composite audit covering FHIR R4 spec compliance + backend FHIR-impl conventions + Medplum SDK usage. Orchestrates fhir-resource-check, backend-fhir-impl-check, and medplum-usage-check in a single fhir-auditor invocation. Use when a change touches FHIR/Medplum and you want all three angles in one report.
---

# /neo-core:fhir-medplum-audit

Run all three FHIR/Medplum atomic audits in one shot and produce a combined report.

## When to use

- Before opening a PR that touches FHIR resources or the Medplum wrapper.
- When you'd otherwise run all three of `fhir-resource-check`, `backend-fhir-impl-check`, `medplum-usage-check` separately.
- As one piece of `/neo-core:full-review` (which adds HIPAA + generic code review on top).

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Running combined FHIR + Medplum audit on branch `<name>` vs dev — three focuses in one pass."

3. **Delegate to the `fhir-auditor` sub-agent** with multi-focus. Pass it: "Audit `git diff dev...HEAD` per your scope. Cover three focuses in one report: `fhir-resource`, `backend-fhir-impl`, `medplum-usage`. Output a separate section per focus, then a single Verdict paragraph."

4. **Surface the report verbatim** to the user. Don't condense the per-focus sections — the user needs to see findings grouped that way so they can trace each to its atomic counterpart.

5. **If the Verdict is "needs significant rework"** or there are Critical findings, append a one-liner: "For HIPAA + generic code-review concerns on the same diff, run `/neo-core:full-review`." Don't run it automatically.

## What this skill is NOT

- Not HIPAA auditing (use `/neo-core:hipaa-audit`).
- Not generic code review (use `/neo-core:code-review`).
- Not all three at once (use `/neo-core:full-review` for the full picture).
- Not a fix-it skill.
