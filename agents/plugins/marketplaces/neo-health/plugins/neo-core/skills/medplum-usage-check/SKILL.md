---
name: medplum-usage-check
description: Audit the current branch's changes for proper Medplum-SDK usage as a data layer — appropriate client methods, no batch abuse, no Medplum-specific types crossing module boundaries unnecessarily, no direct Medplum responses flowing through controllers without DTO mapping. Atomic skill (single focus). Use /neo-core:fhir-medplum-audit for the combined FHIR+Medplum audit.
---

# /neo-core:medplum-usage-check

Audit the current branch for **how we use the Medplum SDK** — Medplum is the data layer, this skill verifies we treat it as one.

## When to use

- After adding/modifying any code that calls `@medplum/core` methods (typically inside `apps/backend/src/fhir/`).
- When introducing a batch/transaction operation against Medplum.
- When refactoring how a service wraps Medplum responses.
- As one piece of `/neo-core:fhir-medplum-audit`.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Auditing Medplum-SDK usage on branch `<name>` vs dev."

3. **Delegate to the `fhir-auditor` sub-agent** with focus `medplum-usage`. Pass it: "Audit `git diff dev...HEAD` per your scope, focus: `medplum-usage`. Check Medplum-SDK usage as a data layer: appropriate client methods, batch operations not abused, no Medplum types crossing module boundaries unnecessarily, no direct Medplum responses bypassing DTOs."

4. **Surface the report verbatim.**

5. **If out-of-focus items show up**, append a one-line pointer to the relevant atomic or composite.

## What this skill is NOT

- Not raw FHIR-spec auditing (that's `/neo-core:fhir-resource-check`).
- Not backend-impl auditing (that's `/neo-core:backend-fhir-impl-check`).
- Not a HIPAA atomic.
- Not a fix-it skill.
