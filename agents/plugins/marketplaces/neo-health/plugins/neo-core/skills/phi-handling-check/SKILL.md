---
name: phi-handling-check
description: Audit the current branch's changes for PHI handling — routes touching patient data flow errors through PhiErrorFilter, no raw PHI in logs/errors/exceptions, sanitization at boundaries (controllers, error filters, audit logs), no real PHI in test fixtures or seeds. Atomic skill (single focus). Use /neo-core:hipaa-audit for the combined HIPAA audit.
---

# /neo-core:phi-handling-check

Audit the current branch for **PHI handling discipline** — does any change that touches patient data avoid leaking it into logs, errors, or unprotected surfaces?

## When to use

- After modifying a controller, service, or middleware that touches patient data.
- After adding logging or error-handling to any backend path.
- After adding/modifying test fixtures or seed data.
- As one piece of `/neo-core:hipaa-audit`.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Auditing PHI handling on branch `<name>` vs dev."

3. **Delegate to the `fhir-auditor` sub-agent** with focus `phi-handling`. Pass it: "Audit `git diff dev...HEAD` per your scope, focus: `phi-handling`. Check PHI flow: PhiErrorFilter coverage, no raw PHI in logs/errors/exceptions/stack traces, sanitization at boundaries, no real PHI in test fixtures or seed files."

4. **Surface the report verbatim.**

5. **If out-of-focus items show up**, append a one-line pointer to the relevant atomic or composite.

## What this skill is NOT

- Not auditing FHIR spec, backend impl, or Medplum usage (those are FHIR atomics).
- Not auditing AuditEvent coverage or Provenance shape (those are separate HIPAA atomics).
- Not a fix-it skill.
