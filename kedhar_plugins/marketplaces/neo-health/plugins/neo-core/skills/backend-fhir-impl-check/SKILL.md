---
name: backend-fhir-impl-check
description: Audit the current branch's changes for our backend FHIR-layer conventions — DTOs match resource shapes, request validators present, custom endpoints follow our naming, errors translated through PhiErrorFilter, no FHIR types leaked to frontend bundles. Atomic skill (single focus). Use /neo-core:fhir-medplum-audit for the combined FHIR+Medplum audit.
---

# /neo-core:backend-fhir-impl-check

Audit the current branch for **our backend's FHIR-layer conventions** — does the implementation follow how we wrap Medplum?

## When to use

- After adding/modifying a controller, service, or DTO under `apps/backend/src/fhir/`.
- When introducing a new custom endpoint that doesn't have a direct Medplum equivalent.
- When you're not sure whether a frontend change accidentally pulled in `@medplum/*` types.
- As one piece of `/neo-core:fhir-medplum-audit`.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Auditing backend FHIR-impl conventions on branch `<name>` vs dev."

3. **Delegate to the `fhir-auditor` sub-agent** with focus `backend-fhir-impl`. Pass it: "Audit `git diff dev...HEAD` per your scope, focus: `backend-fhir-impl`. Check backend FHIR-layer conventions: DTO shape vs resource, validator presence, custom-endpoint naming, error translation through PhiErrorFilter, no FHIR types in frontend bundles."

4. **Surface the report verbatim.**

5. **If out-of-focus items show up**, append a one-line pointer to the relevant atomic or composite.

## What this skill is NOT

- Not raw FHIR-spec auditing (that's `/neo-core:fhir-resource-check`).
- Not Medplum-SDK-usage auditing (that's `/neo-core:medplum-usage-check`).
- Not a HIPAA atomic.
- Not a fix-it skill.
