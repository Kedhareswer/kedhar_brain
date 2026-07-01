# Vault log — curated tier

Append-only chronological log of all writes to `vault/{adrs,prds,playbooks,runbooks,modules}/`. One entry per op:

```
## [YYYY-MM-DD HH:MM TZ] <op> | <summary>
- path/to/page1.md (created|updated|superseded)
- path/to/page2.md (created|updated)
```

Read top-to-bottom for full history. Recent entries at the top.

The drafts-tier log is at `vault/drafts/log.md`.

---

## [2026-05-08 16:30 EDT] seed | testing playbook (Phase 4 final)
- vault/playbooks/testing-the-second-brain-rollout.md (created) — comprehensive verification plan for Phases 0-4
- vault/index.md (updated — added [[testing-the-second-brain-rollout]])

## [2026-05-08 14:00 EDT] seed | initial vault content (Phase 2)
- vault/README.md (created) — schema doc, two-tier rule, page format, wikilink conventions, citation format, conflict fallback, shadow-curator role
- vault/index.md (created) — curated-tier TOC scaffold
- vault/log.md (created) — this file
- vault/adrs/0001-medplum-as-data-layer.md (created) — captures the FHIR-backend-wraps-Medplum rule
- vault/playbooks/add-fhir-resource-module.md (created) — step-by-step for adding a new FHIR resource module
