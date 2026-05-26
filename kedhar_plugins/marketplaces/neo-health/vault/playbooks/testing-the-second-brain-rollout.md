---
title: Testing the team-shared Claude knowledge rollout (Phases 0-4)
type: playbook
status: active
last_updated: 2026-05-08
sources:
  - C:\Users\Diferti\.claude\plans\let-s-plan-next-implementation-lovely-summit.md
related:
  - "[[0001-medplum-as-data-layer]]"
  - "[[add-fhir-resource-module]]"
---

# Testing the team-shared Claude knowledge rollout (Phases 0-4)

**Summary**: Step-by-step verification plan for the entire team-shared Claude brain that landed across the monorepo + claude-config repo over Phases 0-4. Run this to confirm everything actually works end-to-end before promoting to teammates.

## Body

This is the **single comprehensive test plan** for the Phase 0 → 4 rollout. It tests: shared CLAUDE.md context, the neo-core plugin's 10 skills + 2 sub-agents + hook, the vault structure + 3 vault skills + validate workflow, the MCP server (both transports), the vault-guardrail workflow, and the claude-review GitHub Action.

Time budget: 60-90 minutes for a full pass.

### Prerequisites (do once before testing)

- [ ] Phases 0-4 are committed and pushed (last commit on `claude-config@dev` is `fdeb716`; last on `neo-monorepo` is `40cec68` on `scribe-improvements`).
- [ ] `neo-core@neo-health v1.0.0` is installed (`claude plugin list` shows it enabled).
- [ ] You're on a branch with real changes vs `dev` (e.g., `scribe-improvements`) so review skills have something to chew on.
- [ ] You have `pnpm` available in your shell (any recent version).
- [ ] **Restart your CCD session** in the monorepo so the new plugin + nested CLAUDE.md files load fresh.

### Phase 0 — context loading

Open a fresh Claude session in `C:/Neo/dev/neo-monorepo` and paste each prompt. Don't refer back to this playbook between prompts — that's the point.

| Test | Prompt | Pass criteria |
|---|---|---|
| **0.1** Root CLAUDE.md loads | "What's the base branch in this repo, and what's the rule about Medplum and the frontend?" | Says base branch is `dev` (not `main`). Says frontends never import `@medplum/*`; all FHIR access flows through `apps/backend`. |
| **0.2** Backend CLAUDE.md auto-loads | "Read `apps/backend/src/app.module.ts` and tell me what the patient-side AuditEvent dedup window is." | After reading the file, answers **5 minutes** (specific to `apps/backend/CLAUDE.md`). If it says "not in my context," nested auto-load isn't firing. |
| **0.3** Provider CLAUDE.md auto-loads | "Read `apps/provider/app/page.tsx` (or any provider file). What's the form library convention here?" | Says Formik + Yup is the historical default; React Hook Form + Yup/Zod is acceptable for new screens. |
| **0.4** codebase-investigator sub-agent | "Use the codebase-investigator agent to find all NestJS modules that touch Provenance." | Spawns the sub-agent (visible in CCD UI). Returns a focused list with file:line citations, under ~200 words. Uses Grep/Glob, not Read on every file. |

If any of 0.1–0.4 fails: confirm `git log -1` shows commit `969acdd` on the monorepo, and that `git show HEAD:CLAUDE.md` returns the new shared TOC (88 lines, has the HIPAA no-go list). If the file looks right but Claude doesn't know its content, restart the session.

### Phase 1 — skills + sub-agents + hook

Type `/` in a fresh session and confirm the menu shows all 10 `/neo-core:*` skills. Then run each smoke test below. Each should produce a real output, not "skill not found."

| Test | Command | Pass criteria |
|---|---|---|
| **1.1** code-review (atomic) | `/neo-core:code-review` | Spawns code-reviewer sub-agent. Output is a Markdown report with severity sections (Critical/Important/Minor/Nits/Verdict). Cites real `file:line`. NO FHIR/HIPAA findings (those flag at the bottom under "Outside my scope"). |
| **1.2** fhir-resource-check (atomic) | `/neo-core:fhir-resource-check` | Spawns fhir-auditor with focus `fhir-resource`. Report has one Focus section. Either real findings (cited) or `(no findings — pattern correctly applied)`. |
| **1.3** backend-fhir-impl-check (atomic) | `/neo-core:backend-fhir-impl-check` | Same shape, focus `backend-fhir-impl`. |
| **1.4** medplum-usage-check (atomic) | `/neo-core:medplum-usage-check` | Same shape, focus `medplum-usage`. |
| **1.5** phi-handling-check (atomic) | `/neo-core:phi-handling-check` | Same shape, focus `phi-handling`. |
| **1.6** audit-event-check (atomic) | `/neo-core:audit-event-check` | Same shape, focus `audit-event`. |
| **1.7** provenance-check (atomic) | `/neo-core:provenance-check` | Same shape, focus `provenance`. |
| **1.8** fhir-medplum-audit (composite) | `/neo-core:fhir-medplum-audit` | Single fhir-auditor invocation with three focuses; report has THREE Focus sections + one Verdict. |
| **1.9** hipaa-audit (composite) | `/neo-core:hipaa-audit` | Same shape, three different focuses. |
| **1.10** full-review (composite) | `/neo-core:full-review` | Three sub-agent invocations (code-reviewer, fhir-auditor for FHIR, fhir-auditor for HIPAA). Single merged report with consolidated Critical-issues list at top, then Detailed reports section with three sub-reports verbatim. |
| **1.11** PostToolUse typecheck hook | Edit any `.ts` file under `apps/backend/src/`. Save. | The hook runs `pnpm --filter backend typecheck` automatically. If the file is valid TS, no output (silent success). If you intentionally introduce a type error, hook exits 2 and Claude sees the diagnostic. |

For 1.11, you can verify the hook fired by editing a file like `apps/backend/src/main.ts` and adding a deliberate `const x: string = 5;` — Claude will see the typecheck failure on save. Revert the change after testing.

### Phase 2 — vault + vault skills + validate workflow

| Test | Command/action | Pass criteria |
|---|---|---|
| **2.1** Vault is browsable | `ls C:/Neo/dev/claude-config/vault` | Shows `adrs/`, `prds/`, `playbooks/`, `runbooks/`, `modules/`, `drafts/`, `index.md`, `log.md`, `README.md`. |
| **2.2** Index files are well-formed | `node C:/Neo/dev/claude-config/.github/workflows/scripts/vault-validate.mjs` | Exits 0 with `vault-validate: OK (N files scanned)`. |
| **2.3** ADR is readable in Claude | "Read `C:/Neo/dev/claude-config/vault/adrs/0001-medplum-as-data-layer.md` and tell me the title and one specific consequence." | Reads the file. Says "Medplum is a data layer, not the API surface." Quotes a specific consequence (e.g., "A `@medplum/*` import showing up under `apps/{provider,admin,patient}/` is a Critical finding..."). |
| **2.4** prd-to-vault skill (smoke test) | Create a stub draft: paste a 3-paragraph "feature idea" into `vault/drafts/raw-prds/test-feature.md` (manually for this test). Then in Claude, run `/neo-core:prd-to-vault drafts/raw-prds/test-feature.md`. | Skill confirms slug, asks before overwriting if path collides, generates four files (`overview.md`, `requirements.md`, `dependencies.md`, `open-questions.md`) under `vault/prds/test-feature/`, updates `vault/index.md`, appends to `vault/log.md`. Does NOT auto-commit. |
| **2.5** lint-vault | `/neo-core:lint-vault` | Returns a numbered fix list. Should report 0 page-format violations (we just seeded; everything follows the spec). May report orphans for the test-feature PRD if 2.4 didn't add it to index.md. May report stale-active for the seed pages (probably none, dates are recent). Check D shows "deferred to Phase 4." |
| **2.6** update-vault dry-run | `/neo-core:update-vault before="five-minute" after="10-minute"` | Returns a preview file path. **Does NOT modify the vault.** Preview lists every page that would change. Refuses if >10 files match (default fan-out limit). |
| **2.7** vault-validate GH Action (after push) | Push a deliberate broken commit to a feature branch on `claude-config` (e.g., add `<<<<<<< HEAD` at column 0 in a vault file). Open the GitHub Actions tab. | The `vault-validate` workflow fails. An issue tagged `vault-conflict` is auto-opened with a link to the failing run. Revert the broken commit afterward. |

For 2.4, the test draft can be 50-100 lines of plausible PRD prose — it doesn't need to be real. Sample idea: "Add a self-service password reset flow for providers (currently they email support)."

### Phase 3 — MCP server + vault-guardrail + boss flow

This phase has the biggest setup cost. If you haven't deployed the MCP server to Railway yet, do the **local-stdio test first** (3.1) and defer the rest until deployment.

#### 3a. Local-stdio test (no Railway needed)

| Test | Action | Pass criteria |
|---|---|---|
| **3.1** Build the MCP server | `cd C:/Neo/dev/claude-config/mcp-server && pnpm install && pnpm typecheck && pnpm build` | All three commands exit 0. `dist/server.js` and friends exist. If `pnpm typecheck` reports type errors, fix them — the source was written without a working install in this session, so minor adjustments may be needed (e.g., MCP SDK version drift). |
| **3.2** Stdio mode runs | From the monorepo root: `MCP_TRANSPORT=stdio VAULT_PATH=C:/Neo/dev/claude-config node C:/Neo/dev/claude-config/mcp-server/dist/server.js` (in a shell). It should read JSON-RPC on stdin. | Process starts, prints `[mcp-stdio] connected | vault=...`. Press Ctrl+C to stop. |
| **3.3** Wire as project MCP for devs | Edit `C:/Neo/dev/neo-monorepo/.mcp.json` temporarily to use `"command": "node"` + `"args": [...]` form (per `mcp-server/README.md` stdio section). Restart Claude session in the monorepo. | `claude mcp list` shows `neo-vault` as connected. Ask Claude: "use the neo-vault MCP to find ADRs about Medplum." It calls `vault_search`, returns the seed ADR. |

#### 3b. Deployed-HTTP test (after Railway deployment)

| Test | Action | Pass criteria |
|---|---|---|
| **3.4** Deploy to Railway | Follow `mcp-server/README.md` "Production deployment". Generate `MCP_TOKENS` per user. Set custom domain. | Service is green; `curl https://mcp.neo.internal/healthz` returns 200 with vault freshness JSON. |
| **3.5** Wire dev `.mcp.json` to hosted | Restore `.mcp.json` to the HTTP form (already in repo). Set `NEO_MCP_URL` and `NEO_MCP_TOKEN` in your shell. Restart Claude. | Same test as 3.3, now hitting Railway. |
| **3.6** Boss onboarding (curator does on his laptop) | Follow `docs/boss-onboarding.md` step by step. | Boss's Claude.ai Project answers "What ADRs do we have?" by calling the connector. PRD-drafting test references real modules by name. |
| **3.7** vault-guardrail workflow | On `claude-config`, create a test branch as the boss's identity (`git -c user.email=boss@neo.health commit -m '...'`) that touches a file outside `vault/drafts/`. Push. | The workflow auto-reverts the commit and opens an issue tagged `boss-overreach`. Curator commits are NOT affected by the workflow. |
| **3.8** Vault auto-pull works end-to-end | Edit a file in `vault/playbooks/`, commit, push to `dev`. Wait 5-15 min. Re-query the same content via the deployed MCP from boss's Claude.ai. | The change appears in the response (proves Railway pulls the repo on schedule and the snapshot reloads). |

#### 3c. If you haven't deployed yet

Mark 3.4–3.8 as `[deferred until Railway deployment]` and move on. Local-stdio coverage proves the server code works; the deployed-HTTP testing is a separate verification round.

### Phase 4 — promote-to-team + claude-review GH Action

| Test | Action | Pass criteria |
|---|---|---|
| **4.1** promote-to-team lists auto-memory | `/neo-core:promote-to-team` | Lists recent entries from `~/.claude/projects/C--Neo-dev-neo-monorepo/memory/MEMORY.md`. Asks which to promote. Does NOT auto-pick. |
| **4.2** promote-to-team end-to-end | Pick one entry. Confirm classification. Ask for the proposed change. Choose `yes` to open as a PR. | Skill creates a branch on the right repo (`claude-config` for vault/skill changes, monorepo for CLAUDE.md edits), commits with `chore(claude): promote <slug>`, surfaces the GitHub compare URL. Does NOT auto-merge. |
| **4.3** claude-review GH Action setup | Add `ANTHROPIC_API_KEY` to monorepo Settings → Secrets. Open a PR on the monorepo (any small change qualifies if it's not docs-only). | The `claude-review` workflow runs. Posts a comment with `/neo-core:full-review` output. If verdict is clean, posts the short "✅" comment. |
| **4.4** Path filters work | Open a docs-only PR (just edit a `.md`). | The `claude-review` workflow does NOT trigger (path filter excludes `**/*.md`). |

### What to do when something fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Skill doesn't appear in `/` menu | Plugin not installed at v1.0.0 | `claude plugin list`; if version is older, `claude plugin update neo-core@neo-health` and **restart session**. |
| `/neo-core:<skill>` runs but says "no diff" | You're on `dev` or branch hasn't diverged | `git checkout` a branch with real changes (e.g., `scribe-improvements`). |
| Sub-agent (code-reviewer / fhir-auditor) returns generic / wrong-shaped output | Skill prompt or agent prompt needs tuning | Iterate on the agent definition (`plugins/neo-core/agents/<name>.md`), commit + push to claude-config, bump plugin patch version, run `claude plugin update`. |
| Hook doesn't fire on Edit/Write | Hook permission not granted, or `pnpm` not on PATH in Claude's shell | Check `~/.claude/settings.json` for hook approvals. Test the hook manually: `echo '{"tool_input":{"file_path":"C:/Neo/dev/neo-monorepo/apps/backend/src/main.ts"}}' \| node C:/Neo/dev/claude-config/plugins/neo-core/hooks/scripts/typecheck-touched-ts.mjs` |
| MCP server fails to start | Missing env var (typically `VAULT_PATH` or `MCP_TOKENS`) | Check stderr; copy `.env.example` to `.env` and fill in. |
| MCP server starts but `vault_search` returns nothing | `VAULT_PATH` doesn't point at the claude-config repo root (it should NOT include `/vault`) | The server adds `/vault` itself. `VAULT_PATH=C:/Neo/dev/claude-config` is correct. |
| GH Action `claude-review` errors with "marketplace not found" | The action's container can't fetch the private claude-config repo | Make claude-config repo accessible to the action (Internal visibility means it's already accessible to the GH org). Or pin to `git-subdir` source with deploy key. |
| `vault-guardrail` reverts a curator commit | `BOSS_EMAILS` repo variable mistakenly includes the curator's email | Edit at Settings → Variables → Actions; remove the wrong email. |

### Iterating after the smoke test

The smoke tests above prove things **work end-to-end**. They don't prove **quality** of the skill outputs — that's what the monthly quality ritual covers (see `vault/README.md`'s shadow-curator section).

For the first quarter:
- Note in your personal `MEMORY.md` any time a skill produces a useless / wrong-shaped / overly-noisy report. After 5-10 such notes, use `/neo-core:promote-to-team` to capture the pattern, then iterate on the skill prompt.
- Add new ADRs and playbooks to the vault as the team makes decisions and discovers procedures. The vault compounds; this is its job.
- Add a `vault/modules/` page for each major NestJS module / Next.js feature as time permits — these power `module_summary` tool calls.

## Related

- [[0001-medplum-as-data-layer]] — the foundational ADR every audit skill checks against
- [[add-fhir-resource-module]] — the playbook that exercises most of the FHIR/HIPAA atomic skills end-to-end
