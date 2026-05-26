---
name: audit-event-check
description: Audit the current branch's changes for AuditEvent / AuditInterceptor coverage — protected reads/writes are covered, patient-side dashboard pattern preserved (5-min dedup, X-Audit-Context header, access-denial filter), 4xx responses still emit AuditEvents with outcome minor-failure. Atomic skill (single focus). Use /neo-core:hipaa-audit for the combined HIPAA audit.
---

# /neo-core:audit-event-check

Audit the current branch for **AuditEvent coverage and shape** — does every protected read/write emit a correctly-shaped AuditEvent?

## When to use

- After adding/modifying a controller (especially one touching patient data).
- After modifying `AuditInterceptor`, `AuditService`, or anything in `apps/backend/src/storage/`.
- After modifying patient-side endpoints (the dashboard batching protocol matters here).
- After adding any `@SkipAudit()`-style escape hatch (verify it's justified).
- As one piece of `/neo-core:hipaa-audit`.

## Procedure

1. **Confirm there are changes.** Run `git status --short` and `git rev-parse --abbrev-ref HEAD`. If on `dev` or no diff, tell the user and stop.

2. **Show the scope** (one line):
   - "Auditing AuditEvent coverage on branch `<name>` vs dev."

3. **Delegate to the `fhir-auditor` sub-agent** with focus `audit-event`. Pass it: "Audit `git diff dev...HEAD` per your scope, focus: `audit-event`. Check AuditInterceptor coverage on protected reads/writes, action-name mapping, patient-side dashboard pattern (5-min dedup, X-Audit-Context header, access-denial filter on 4xx responses), and any new escape hatches."

4. **Surface the report verbatim.**

5. **If out-of-focus items show up**, append a one-line pointer to the relevant atomic or composite.

## What this skill is NOT

- Not auditing PHI in logs (that's `/neo-core:phi-handling-check`).
- Not auditing Provenance (that's `/neo-core:provenance-check`).
- Not auditing FHIR spec or backend conventions (those are FHIR atomics).
- Not a fix-it skill.
