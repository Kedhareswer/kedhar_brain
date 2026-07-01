---
name: provenance-check
description: Audit the current branch's changes for Provenance resource coverage — writes that materially change the FHIR record create a Provenance with correct agent/recorded/target fields. Atomic skill (single focus). Use /neo-core:hipaa-audit for the combined HIPAA audit.
---

# /neo-core:provenance-check

Audit the current branch for **Provenance resource coverage** — does every write that needs provider-of-record traceability create a correctly-shaped Provenance?

## When to use

- After adding/modifying a write path (POST/PUT/PATCH/DELETE) on a FHIR resource controller or service.
- After modifying `apps/backend/src/fhir/resources/provenance/` itself.
- After adding a new write that bypasses the existing Provenance pattern.
- As one piece of `/neo-core:hipaa-audit`.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Auditing Provenance coverage on branch `<name>` vs dev."

3. **Delegate to the `fhir-auditor` sub-agent** with focus `provenance`. Pass it: "Audit `git diff dev...HEAD` per your scope, focus: `provenance`. Check Provenance creation on writes that materially change the FHIR record, with correct agent/recorded/target shape and references back to the changing resource."

4. **Surface the report verbatim.**

5. **If out-of-focus items show up**, append a one-line pointer to the relevant atomic or composite.

## What this skill is NOT

- Not auditing PHI in logs (that's `/neo-core:phi-handling-check`).
- Not auditing AuditEvent coverage (that's `/neo-core:audit-event-check`).
- Not auditing FHIR spec or backend conventions.
- Not a fix-it skill.
