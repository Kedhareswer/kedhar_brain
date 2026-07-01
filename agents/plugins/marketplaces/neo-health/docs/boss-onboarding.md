# Boss onboarding (Phase 3)

One-time setup for the boss's Claude.ai PRD-writing flow. A developer (you, the curator) does this on the boss's machine — he doesn't touch git, plugins, or the CLI.

## What he gets after onboarding

- A Claude.ai Project named "Neo Health PRD writer" with a system prompt that knows: he's a PRD writer, the team's PRD format, and to call the connector before drafting.
- A Custom Connector pointing at the hosted MCP server (`https://mcp.neo.internal/mcp` or wherever Railway gives you).
- Optionally: Obsidian + Obsidian Git plugin so he can drop draft PRDs into `vault/drafts/raw-prds/` and they auto-sync to GitHub. The MCP picks them up within ~5 minutes.

## Prerequisites (you do these once before the session)

1. **Hosted MCP server is up.** Railway service running, healthcheck green at `https://mcp.neo.internal/healthz`.
2. **You generated a unique bearer token for the boss.** Generate with `openssl rand -hex 32`, add it to the Railway `MCP_TOKENS` env var as `boss:<token>`. Keep the token in your password manager — you'll paste it into his Claude.ai Custom Connector setup.
3. **Boss has a Claude Pro (or Team) subscription.** Free tier message limits are too low for regular PRD work.
4. **Optional**: read-only deploy key for `neohealth-org/claude-config` if he'll use Obsidian to add drafts.

## On his machine — Claude.ai Project setup (~10 min)

1. Open https://claude.ai/projects → New Project → name it **"Neo Health PRD writer"**.
2. **System prompt** — paste this verbatim, replacing `<...>` placeholders:

   ```
   You are a Product Requirements Document (PRD) writer for Neo Health, a HIPAA-aware healthcare transcription and care-record platform. The team uses a NestJS backend that wraps Medplum (a FHIR server) plus three Next.js frontends (provider, admin, patient).

   Before drafting any PRD, ALWAYS call the Neo Health vault connector to ground your work in real project knowledge. The protocol:

   1. Call `vault_read` for `index.md` AND `drafts/index.md` to orient — these list everything available in the curated tier (ADRs, playbooks, structured PRDs, modules) and the drafts tier (the user's past raw PRDs, ideas, research). Do this BEFORE the user's first request.

   2. For the user's request, call `find_related_prds(description, scope: "all")` to find any prior PRD or draft that touches the same topic. Read the most relevant 1-3 fully via `vault_read`.

   3. Call `module_summary(name)` for every NestJS module or FHIR resource the PRD will touch. If a module has no summary, ask the user whether to proceed without it or wait for the curator to add one.

   4. Now draft. Reference real modules and FHIR resources by name. Cite vault paths inline: "(source: adrs/0001-medplum-as-data-layer.md)".

   PRD format:
   - Overview: 1 short paragraph — problem, goal, success metric.
   - Requirements: bulleted list, must / should / could.
   - Dependencies: explicit list of which existing modules / ADRs / playbooks this touches.
   - Open questions: anything ambiguous that needs decisions before implementation.
   - Risks / non-goals: brief.

   Hard rules:
   - Never invent module names, FHIR resources, or facts about the codebase. If the connector doesn't have it, say so and ask the user.
   - Never include real patient data in PRD text. Use "Patient A", "Patient B" placeholders.
   - Treat the connector's "scope" as fixed at "all" (curated + drafts) for your work — don't restrict it.
   ```

3. **Attach the PRD template file** (you'll create one — see `docs/templates/prd-template.md` in this repo, or paste the format from the system prompt).

4. **Add Custom Connector**:
   - Project settings → Connectors → Add Custom Connector.
   - Name: `Neo Health vault`.
   - URL: `https://mcp.neo.internal/mcp` (whatever your Railway custom domain is).
   - Auth header: `Authorization: Bearer <his-token>`.
   - Save → it should show "connected" with the 5 available tools (`vault_search`, `vault_read`, `module_summary`, `find_related_prds`, `list_fhir_resources_used`).

5. **Test**: in the Project, ask: "What ADRs do we have? List them with one-line descriptions." Claude should call `vault_read("index.md")` and `vault_read("drafts/index.md")`, then list the ADRs from the curated index. If it doesn't, the system prompt isn't being followed — re-read step 2.

## Optional — Obsidian + Obsidian Git for boss-side draft writing

If the boss prefers writing PRDs in Obsidian (graph view, wikilinks, faster than Claude.ai for raw drafting):

1. Install [Obsidian](https://obsidian.md/) (free desktop app).
2. Settings → Community plugins → enable → Browse → install **Obsidian Git**.
3. On GitHub: generate a deploy key for `neohealth-org/claude-config` with **read-write** permission (boss writes drafts back to the repo).
4. On his laptop: clone the repo:
   ```bash
   git clone git@github.com:neohealth-org/claude-config.git ~/Documents/Neo\ Vault
   ```
5. Open Obsidian → "Open folder as vault" → point at `~/Documents/Neo Vault/vault` (the `vault/` subdir, not the repo root).
6. Configure Obsidian Git:
   - Auto-pull every 10 min ✓
   - Auto-commit on save with 5-min idle delay ✓
   - Push after commit ✓
7. **Tell him** the boss's lane:
   - **Edit anything in `drafts/`** (raw-prds/, ideas/, research/). Free for him to add notes.
   - **Don't touch the curated tier** (`adrs/`, `prds/`, `playbooks/`, `runbooks/`, `modules/`). The vault-guardrail GitHub Action auto-reverts within minutes if he forgets, but it's friendlier not to trigger it.
   - The auto-revert is a safety net, not a license. He'll see a revert in his next pull if he stepped outside.

## Verification (~5 min, do with him)

Have the boss try:

1. **Pure Claude.ai test** (no Obsidian needed):
   - In the Claude.ai Project: "Draft a PRD for adding patient consent management."
   - Verify Claude calls `find_related_prds`, `module_summary`, etc. before drafting (visible in the tool-call trace).
   - Verify the resulting PRD references real modules / FHIR resources by name (not invented ones).

2. **End-to-end test** (if he has Obsidian):
   - Boss opens Obsidian → creates a new file `vault/drafts/raw-prds/test-feature.md` → types a paragraph → saves.
   - Within ~10 min: Obsidian Git auto-commits and pushes.
   - Within another ~5 min: the Railway MCP picks up the new file via scheduled `git pull`.
   - Boss opens his Claude.ai Project → asks "what's the latest in my raw drafts?" — Claude calls `find_related_prds` (or `vault_search` with `scope: "all"`) and the new `test-feature.md` appears.

3. **Auto-revert test** (only if you want to verify the guardrail works):
   - Boss makes an intentional edit to a curated file (e.g., `vault/adrs/0001-medplum-as-data-layer.md` — add a single character).
   - Wait ~5 min for Obsidian Git to auto-commit.
   - Within ~1-2 min after the push: a GitHub issue tagged `boss-overreach` opens, the commit is reverted on `dev`, the boss's next Obsidian pull undoes the change.

## Ongoing

The boss never needs to update Claude.ai or anything else. New skills, ADRs, PRDs, etc. land in the vault via curator workflow → next git pull on Railway → next Claude.ai session sees them. No reinstallation.

If something breaks (connector errors, missing data), the boss pings you. Curator-side debugging path:
1. Check Railway logs for auth or pull errors.
2. Check GitHub Actions for `vault-validate` failures or `boss-overreach` issues.
3. If the bearer token rotated, update Railway `MCP_TOKENS` env var and re-share the new token.
