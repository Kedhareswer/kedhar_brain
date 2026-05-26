# Vault index — curated tier

Hand-curated table of contents for everything under `vault/{adrs,prds,playbooks,runbooks,modules}/`. Updated by every skill that writes to the curated tier (`prd-to-vault`, `promote-to-team`, `update-vault`).

This is what Claude reads first when scoped to `scope: "dev"` (the developer default). The drafts-tier index is at `vault/drafts/index.md` (boss reads both).

## Architecture decisions (`adrs/`)

- **[[0001-medplum-as-data-layer]]** — Backend wraps Medplum FHIR server; frontends never call Medplum directly. The foundational architectural rule. (active, 2026-05-08)

## Playbooks (`playbooks/`)

- **[[add-fhir-resource-module]]** — Step-by-step for adding a new FHIR resource module to the backend, conforming to the per-resource pattern. (active, 2026-05-08)
- **[[testing-the-second-brain-rollout]]** — Single comprehensive verification plan covering Phases 0-4 of the team-shared Claude knowledge rollout. Run after a fresh install or major change. (active, 2026-05-08)

## Runbooks (`runbooks/`)

(none yet)

## FHIR/Module notes (`modules/`)

(none yet — populated as backend/frontend modules are documented)

## Structured PRDs (`prds/`)

(none yet — output of `/neo-core:prd-to-vault` lands here as `prds/<slug>/{overview,requirements,dependencies,open-questions}.md`)

---

## Maintenance

This file is meant to be **scannable in under a minute**. Keep entries to one line each: `[[wikilink]] — short description (status, date)`.

When adding a new page:
1. Add a one-line entry under the right category, alphabetical within category.
2. Append a one-line entry to `vault/log.md` recording the op.
3. The skills (`prd-to-vault` etc.) do this automatically; only edit by hand if you're seeding content directly.
