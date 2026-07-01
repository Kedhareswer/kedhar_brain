---
title: Medplum is a data layer, not the API surface
type: adr
status: active
last_updated: 2026-05-08
sources:
  - apps/backend/CLAUDE.md
  - apps/backend/src/fhir/medplum/medplum.module.ts
related: []
---

# Medplum is a data layer, not the API surface

**Summary**: The Neo Health backend wraps Medplum and exposes a typed, validated, audit-aware FHIR API to the frontends. Frontends (`apps/provider`, `apps/admin`, `apps/patient`) never import `@medplum/*` and never call Medplum directly. This ADR captures the rule and its rationale; every FHIR/HIPAA audit skill checks adherence.

## Body

### Decision

All FHIR access from the Neo Health frontends flows through `apps/backend`. The backend uses `@medplum/core` and `@medplum/fhirtypes` internally to talk to the Medplum FHIR server (running locally via Docker on port 8103, or hosted in production), but exposes its own typed REST API on top.

Medplum is treated as the **storage + FHIR-spec engine**. Our value-add is the layer in front of it:

- **DTOs** + **request validators** (`class-validator`/`zod`) so requests are checked before they touch FHIR (source: `apps/backend/src/fhir/common/validation/validation.module.ts`).
- **Custom endpoints** for read/write paths Medplum alone doesn't model (aggregations, filtered lists, multi-resource workflows).
- **PHI-safe error handling** via `PhiErrorFilter` (source: `apps/backend/src/common/phi-error.filter.ts`), registered as a global APP_FILTER in `app.module.ts`.
- **Audit events** via `AuditInterceptor` (source: `apps/backend/src/storage/audit.interceptor.ts`), registered as a global APP_INTERCEPTOR. Every protected read/write emits a FHIR `AuditEvent`.
- **Provenance** records on writes that need provider-of-record traceability (source: `apps/backend/src/fhir/resources/provenance/`).

### Rationale

1. **HIPAA compliance**. PHI must never be exposed to a client without an audit trail and proper authorization. Centralizing FHIR access in the backend is the only way to enforce this consistently.
2. **Frontend bundle size + privacy**. `@medplum/fhirtypes` is large; `@medplum/core` includes auth and network logic. Neither belongs in a browser bundle.
3. **API stability**. Medplum updates can change response shapes. Our DTO layer insulates clients from Medplum upgrades.
4. **Validation**. Medplum's server-side validation is FHIR-spec validation. We layer our own business rules (e.g., consent prerequisites, role-based field access) on top via DTOs.
5. **Observability**. With Medplum traffic concentrated in one app, a single audit-event pipeline + error-filter pipeline + tracing layer cover all PHI access.

### Consequences

- All FHIR-resource modules live under `apps/backend/src/fhir/resources/<resource>/` (source: `apps/backend/src/fhir/resources/`). Adding a new resource means adding a NestJS module here, not adding a `@medplum/*` import to a frontend.
- Frontends only see typed responses our backend defines. No Medplum-specific types cross the network.
- A `@medplum/*` import showing up under `apps/{provider,admin,patient}/` is a Critical finding in `/neo-core:backend-fhir-impl-check` and `/neo-core:full-review`.
- The `fhir-auditor` sub-agent (source: `plugins/neo-core/agents/fhir-auditor.md`) checks this rule under focus `backend-fhir-impl`.

### When this would be revisited

This decision stays active unless one of:
- We move to a FHIR provider that requires direct client SDKs (very unlikely).
- A specific perf-critical read becomes provably impossible to serve through the backend (would need its own ADR + careful audit story).

If you think you need to import `@medplum/*` in a frontend, **stop and write a new ADR** explaining why this rule should change. Don't bypass quietly.

## Related

(no related ADRs yet — this is the first)
