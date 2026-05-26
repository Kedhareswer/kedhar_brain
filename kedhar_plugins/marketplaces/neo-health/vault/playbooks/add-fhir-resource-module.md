---
title: Add a new FHIR resource module to the backend
type: playbook
status: active
last_updated: 2026-05-08
sources:
  - apps/backend/CLAUDE.md
  - apps/backend/src/fhir/resources/patient/
related:
  - "[[0001-medplum-as-data-layer]]"
---

# Add a new FHIR resource module to the backend

**Summary**: Step-by-step procedure for adding a new FHIR R4 resource (e.g., `Goal`, `CarePlan`) to `apps/backend/src/fhir/resources/`, conforming to the existing per-resource module pattern.

## Body

The backend has ~30 FHIR resource modules already, all following the same shape. Match the existing pattern; do not invent a new structure.

### 1. Verify the resource is needed and check the FHIR R4 spec

- Confirm the resource we need isn't already covered by an existing module (`Glob apps/backend/src/fhir/resources/*`).
- Read the FHIR R4 spec for the resource (source: `https://hl7.org/fhir/R4/<resource>.html`). Note required fields, cardinality, value sets, and `Reference` shapes.
- If it's a custom workflow that doesn't map to a standard resource, this playbook is the wrong fit — use a custom controller under `apps/backend/src/<feature>/` instead.

### 2. Create the module directory

Pattern: `apps/backend/src/fhir/resources/<kebab-case-resource>/`. Required files:

```
<resource>/
├ <resource>.module.ts        # NestJS module declaration
├ <resource>.controller.ts    # HTTP endpoints
├ <resource>.service.ts       # business logic + Medplum calls
├ dto/
│  ├ create-<resource>.dto.ts
│  ├ update-<resource>.dto.ts
│  └ <resource>-response.dto.ts (if shape differs from input)
└ <resource>.controller.spec.ts (or .service.spec.ts)
```

Use an existing simple resource as the template. `Goal` and `Observation` are good references.

### 3. Wire the module into `app.module.ts`

Add the import and include the module in the `imports: []` array. Keep the imports list alphabetized by domain.

### 4. Register the routes under the FHIR namespace

Controller decorator: `@Controller('fhir/<resource>')` (lowercase, kebab-case if multi-word). Custom verbs use `POST /fhir/<resource>/<verb>`.

### 5. Write the DTOs

- **Mirror the FHIR resource shape exactly.** Don't add fields Medplum doesn't recognize.
- **Validate every field.** Use `class-validator` decorators (or `zod` schemas) on every property. No raw `any` should reach the service layer.
- **Reference fields** are objects: `{ reference: "ResourceType/id" }`. Validate the inner string format too.
- **Code system fields** (`Coding[]`) need value-set validation. The simplest version is `@IsIn([...])` against the spec's allowed codes.

### 6. Write the service

- Inject the Medplum client (from `MedplumModule`).
- Use `readResource`, `searchResources`, `updateResource`, `executeBatch` — match Medplum's SDK conventions.
- **Never expose raw Medplum response objects** through the controller — always map to a DTO. (`/neo-core:medplum-usage-check` enforces this.)
- For writes that materially change the FHIR record, also create a `Provenance` resource (see `apps/backend/src/fhir/resources/provenance/`).

### 7. Verify cross-cutting concerns

- The global `AuditInterceptor` handles AuditEvent emission automatically — no per-controller wiring needed. But verify the action-name mapping makes sense for your routes (`/neo-core:audit-event-check` will catch obvious misses).
- The global `PhiErrorFilter` handles error sanitization. Don't catch and re-throw raw Medplum error messages in the service.
- For PHI-touching reads, propagate the `X-Audit-Context` header from controller into the audit pipeline (the dashboard batching protocol depends on it).

### 8. Tests

- Unit tests in the same directory as the source.
- Cover happy path + at least one validation-failure path + one not-found case.
- Run `pnpm test --filter=backend` from monorepo root, or `pnpm test` from `apps/backend/`.

### 9. Audit before opening PR

Run on the feature branch:

- `/neo-core:fhir-medplum-audit` — covers FHIR spec, backend impl, Medplum usage in one pass.
- `/neo-core:hipaa-audit` — covers PHI flow, audit-event coverage, provenance shape.
- Or both at once via `/neo-core:full-review` (also includes generic code review).

Address Critical findings before opening the PR. Important findings should be addressed or explicitly justified in the PR description.

### 10. PR + review

Conventional commit: `feat(fhir): add <Resource> module`. PR body should reference the FHIR spec link for the resource and call out anything non-obvious about the DTO mapping.

## Related

- [[0001-medplum-as-data-layer]] — the architectural rule this playbook implements
