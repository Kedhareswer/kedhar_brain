# claude-config

Neo Health's team-shared Claude Code plugin marketplace. This repo distributes the **`neo-core`** plugin — a curated set of skills, agents, hooks, and (in later phases) a vault and MCP server — to everyone working on the Neo Health monorepo.

## Start here

| You are... | Read this first |
|---|---|
| A new developer setting up your laptop | [docs/setup-from-zero.md](docs/setup-from-zero.md) — developer path |
| The curator setting up a non-dev (boss/PM) | [docs/setup-from-zero.md](docs/setup-from-zero.md) — non-developer path + [docs/boss-onboarding.md](docs/boss-onboarding.md) |
| Trying to figure out what skills exist and when to use them | [docs/what-the-brain-can-do.md](docs/what-the-brain-can-do.md) |
| The curator deploying the MCP server on Railway | [docs/deploy-mcp-on-railway.md](docs/deploy-mcp-on-railway.md) |
| Verifying everything works after install | [vault/playbooks/testing-the-second-brain-rollout.md](vault/playbooks/testing-the-second-brain-rollout.md) |

## What's in here

```
claude-config/
├ .claude-plugin/
│  └ marketplace.json              # marketplace catalog (the file Claude Code reads)
├ plugins/
│  └ neo-core/                     # the one plugin we publish today
│     ├ .claude-plugin/
│     │  └ plugin.json             # plugin manifest (name, version, etc.)
│     ├ skills/                    # filled in Phase 1b–1d, 2, 4
│     ├ agents/                    # filled in Phase 1b, 1c
│     └ hooks/                     # filled in Phase 1f
├ vault/                            # added in Phase 2 (Obsidian-compatible knowledge base)
├ mcp-server/                       # added in Phase 3 (Node.js MCP for boss + devs)
└ .github/workflows/                # added in Phases 2–3 (vault-validate, vault-guardrail)
```

The structure mirrors the rollout plan documented in the parent monorepo. This repo is currently at **Phase 1a** — the empty marketplace skeleton, ready to receive its first skills.

## Install for a developer using the Neo Health monorepo

The monorepo's `.claude/settings.json` references this marketplace via `extraKnownMarketplaces`, so a fresh clone of the monorepo + Claude Code should auto-prompt to install the plugin. If the prompt doesn't fire (see [issue #32606](https://github.com/anthropics/claude-code/issues/32606)), run from the monorepo root:

```shell
pnpm setup:claude
```

That runs `claude plugin marketplace add neohealth-org/claude-config && claude plugin install neo-core@neo-health`. Or if you prefer slash commands, use `/plugin marketplace add neohealth-org/claude-config` then `/plugin install neo-core@neo-health` inside a Claude Code session.

Once installed, the plugin's skills are namespaced as `/neo-core:<skill-name>` (e.g., `/neo-core:code-review` once Phase 1b ships).

### Troubleshooting: clone fails with "Repository not found" or SSH auth error

If `pnpm setup:claude` errors with something like:

```
SSH clone failed, retrying with HTTPS: https://github.com/neohealth-org/claude-config.git
✘ Failed to add marketplace: ... fatal: repository '...' not found
```

…you've hit a GitHub auth mismatch. Claude CLI uses the standard `git@github.com:` host for SSH, but your `~/.ssh/config` may use a custom host alias (like `Host neo`) for `neohealth-org` access, with no `Host github.com` block. The HTTPS fallback then fails because the repo is Internal (not public) and no HTTPS credential is configured.

Three fixes, in order of preference:

1. **Use the local clone instead of GitHub** (zero global config changes). Clone this repo somewhere on your machine, then run from a Claude Code session:
   ```
   /plugin marketplace add /absolute/path/to/your/claude-config
   /plugin install neo-core@neo-health
   ```
   This is what most curators end up doing since they already have the repo cloned.

2. **Add a scoped git URL rewrite** (one-time, persistent, scoped to neohealth-org only):
   ```bash
   git config --global url."git@neo:neohealth-org/".insteadOf "git@github.com:neohealth-org/"
   git config --global url."git@neo:neohealth-org/".insteadOf "https://github.com/neohealth-org/"
   ```
   Replace `git@neo:` with whatever SSH alias works on your machine for `neohealth-org`. Reverse with `git config --global --unset-all url."git@neo:neohealth-org/".insteadOf`. After this, `pnpm setup:claude` works normally.

3. **Add `Host github.com` to your SSH config** pointing at the same identity file your `neohealth-org`-capable alias uses. Broadest fix — makes standard `git@github.com:` SSH work for all GitHub repos. Useful if you do non-Neo work on the same key. May conflict with an existing personal GitHub identity on the same machine.

## Develop locally

To iterate on this plugin without publishing a release:

```shell
# from the directory that contains your monorepo session,
# tell Claude Code to load this plugin from disk:
claude --plugin-dir C:/Neo/dev/claude-config/plugins/neo-core
```

After editing skills/agents/hooks, run `/reload-plugins` inside the session to pick up changes without restarting.

## Versioning

`plugins/neo-core/.claude-plugin/plugin.json` carries an explicit `version`. Bumping it is what makes installed copies update — without a bump, `/plugin update` is a no-op for users. We follow semver-ish conventions:

- **Patch** (e.g., 0.1.0 → 0.1.1): prompt tweaks, typo fixes, minor improvements.
- **Minor** (0.1.0 → 0.2.0): new skills/agents/hooks shipping.
- **Major** (0.x.x → 1.0.0): breaking changes to skill names, removed skills, or workflow shape.

Until 1.0.0 we treat any bump as a heads-up worth a one-line note in the commit message.

## Phase status

- [x] **Phase 1a** — marketplace + plugin skeleton.
- [x] **Phase 1b** — `/neo-core:code-review` skill + `code-reviewer` sub-agent.
- [x] **Phase 1c** — FHIR atomic skills (`fhir-resource-check`, `backend-fhir-impl-check`, `medplum-usage-check`) + `fhir-auditor` agent.
- [x] **Phase 1d** — HIPAA atomic skills (`phi-handling-check`, `audit-event-check`, `provenance-check`).
- [x] **Phase 1e** — composite skills (`fhir-medplum-audit`, `hipaa-audit`, `full-review`).
- [x] **Phase 1f** — `PostToolUse` typecheck hook + monorepo wiring + `pnpm setup:claude`.
- [x] **Phase 2** — Obsidian-compatible `vault/` (curated + drafts tiers, per-tier index/log, page format spec), seed ADR + playbook, `prd-to-vault`/`lint-vault`/`update-vault` skills, `vault-validate.yml` GitHub Action.
- [x] **Phase 3** — Railway-hosted MCP server (HTTP + stdio transports, 5 tools, bearer-token auth, scheduled git-pull), boss onboarding doc, vault-guardrail workflow, monorepo `.mcp.json`.
- [x] **Phase 4** — `/neo-core:promote-to-team` skill (auto-memory → team-shared brain bridge) + `claude-review.yml` GitHub Action in monorepo (runs `/neo-core:full-review` on every PR).

🎉 **All planned phases shipped at v1.0.0.** Ongoing work is iteration: tuning skill prompts based on real reviews, adding new ADRs/playbooks/modules to the vault, and the boss-side onboarding that has to happen on his laptop.

## Conventions

- Base branch is **`dev`**, not `main`. Same as the monorepo. Branches and PRs go off `dev`.
- Conventional commit prefixes: `feat(<scope>):`, `fix(<scope>):`, `chore(<scope>):`, etc. Scope examples: `feat(skills):`, `feat(agents):`, `chore(marketplace):`.
- **No `Co-Authored-By: Claude` trailers.** Commits are authored by the human running the session.
- Skills and agents that touch FHIR/PHI follow the rules documented in the monorepo's `apps/backend/CLAUDE.md` (Medplum is a data layer, not an API surface; PhiErrorFilter; AuditInterceptor).
