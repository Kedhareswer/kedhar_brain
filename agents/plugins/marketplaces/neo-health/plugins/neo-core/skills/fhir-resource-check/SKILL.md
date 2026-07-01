---
name: fhir-resource-check
description: Audit the current branch's changes for FHIR R4 spec compliance — resource types valid, fields conform to spec, value sets respected, References shaped correctly, required fields present, cardinality respected. Atomic skill (single focus). Use /neo-core:fhir-medplum-audit for the combined FHIR+Medplum audit, or /neo-core:full-review for the full report including code review and HIPAA.
---

# /neo-core:fhir-resource-check

Audit the current branch for **FHIR R4 spec compliance only** — does our use of FHIR resources match the actual specification?

## When to use

- After adding/modifying a FHIR resource module under `apps/backend/src/fhir/resources/<resource>/`.
- When you're not sure if a field name, code system, or `Reference` shape matches the FHIR spec.
- As one piece of `/neo-core:fhir-medplum-audit` — that composite invokes this plus `backend-fhir-impl-check` and `medplum-usage-check`.

If the change touches FHIR but isn't really about resource shape (e.g., adding an audit interceptor), pick the more specific skill instead.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the user the scope** (one line):
   - "Auditing FHIR resource correctness on branch `<name>` vs dev (M FHIR-touching files of N total)."

3. **Delegate to the `fhir-auditor` sub-agent** with focus `fhir-resource`. Pass it: "Audit `git diff dev...HEAD` per your scope, focus: `fhir-resource`. Check FHIR R4 spec compliance only — resource types, fields, value sets, Reference shape, cardinality, code systems."

4. **Surface the report verbatim.** Don't paraphrase.

5. **If the report flags out-of-focus items** (e.g., "saw a Medplum usage smell, out of scope"), append a one-line note pointing the user at the relevant atomic or `/neo-core:fhir-medplum-audit`.

## What this skill is NOT

- Not Medplum-usage auditing (that's `/neo-core:medplum-usage-check`).
- Not backend-impl auditing (that's `/neo-core:backend-fhir-impl-check`).
- Not PHI/audit/provenance auditing (those are HIPAA atomics).
- Not a fix-it skill.
