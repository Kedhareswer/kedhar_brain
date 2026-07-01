# Setup from zero

Two paths: **developers** (everyone who writes code in the monorepo) and **non-developers** (the boss, PM, anyone who works in Claude.ai but never opens a terminal). Pick yours.

If you're a developer setting up a non-dev's machine, skip to the **Non-developer** section — you'll be the one doing the steps on their laptop.

---

# Developer path

For anyone who'll write code, run skills, edit the vault, or curate the second brain. From a fresh laptop.

Total time: ~30-45 minutes (most of it waiting for installs).

## What you're going to install

1. **Node.js 20+** — runtime
2. **pnpm 10+** — package manager
3. **Git** — version control + SSH key setup for GitHub
4. **Docker Desktop** — local infrastructure (Postgres, Redis, MinIO, Medplum)
5. **Claude Code** — the CLI you'll be using
6. **The two repos** — `neo-monorepo` + (optionally) `claude-config`
7. **The neo-core plugin** — installs automatically via `pnpm setup:claude`
8. **(Optional) Obsidian + Obsidian Git plugin** — visual vault editor

## Step 1 — Install Node.js

Download Node.js 20 LTS or newer from https://nodejs.org/.

- **Windows**: pick the .msi installer. Accept defaults. Reboot after install (PATH changes need a restart on Windows).
- **macOS**: pick the .pkg installer, OR `brew install node` if you have Homebrew.
- **Linux**: use your package manager (`apt`, `dnf`, etc.) OR install via [nvm](https://github.com/nvm-sh/nvm).

Verify after reboot: open a terminal and run `node --version`. Should print `v20.x.x` or higher.

## Step 2 — Install pnpm

```bash
npm install -g pnpm@10.4.1
```

Verify: `pnpm --version` should print `10.4.1` or higher.

## Step 3 — Install Git and configure SSH

### Install Git

- **Windows**: download from https://git-scm.com/. Accept defaults. **Important Windows-specific defaults**: when asked about line endings, pick "Checkout as-is, commit Unix-style" (avoids CRLF noise in PRs).
- **macOS**: usually pre-installed; verify with `git --version`. If missing, `xcode-select --install` or `brew install git`.
- **Linux**: `apt install git` / `dnf install git`.

### Set your Git identity

```bash
git config --global user.name "Your Name"
git config --global user.email "you@neo.health"
```

Use your **work email** (matches GitHub).

### Generate an SSH key for GitHub

```bash
ssh-keygen -t ed25519 -C "you@neo.health"
```

Press Enter through all prompts (default location, no passphrase is fine for a work machine; passphrase recommended if you commute with the laptop).

Add the key to your SSH agent:

- **Windows (Git Bash)**: `eval "$(ssh-agent -s)"` then `ssh-add ~/.ssh/id_ed25519`
- **macOS**: `eval "$(ssh-agent -s)"` then `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`
- **Linux**: same as macOS without `--apple-use-keychain`.

Copy the **public** key:

- **Windows (Git Bash)**: `cat ~/.ssh/id_ed25519.pub | clip`
- **macOS**: `pbcopy < ~/.ssh/id_ed25519.pub`
- **Linux**: `cat ~/.ssh/id_ed25519.pub`, copy manually.

Add it to GitHub: https://github.com/settings/keys → **New SSH key** → paste → save.

Verify: `ssh -T git@github.com` should print "Hi <your-username>! You've successfully authenticated...".

### (Curator only) Set up the URL rewrite for Claude CLI

If your `~/.ssh/config` has a non-standard host alias for `neohealth-org` (e.g., `Host neo`), Claude CLI may fail to clone the marketplace because it uses the standard `git@github.com:` host. Quick fix — scoped to `neohealth-org/` only:

```bash
git config --global url."git@github.com:neohealth-org/".insteadOf "git@github.com:neohealth-org/"
```

(This is a no-op if your standard SSH host already works for `neohealth-org`. If you have a custom alias like `git@neo:`, replace `git@github.com:neohealth-org/` on the LEFT with your actual working alias.)

See [`README.md`](../README.md#troubleshooting-clone-fails-with-repository-not-found-or-ssh-auth-error) for the full troubleshooting doc.

## Step 4 — Install Docker Desktop

Download from https://www.docker.com/products/docker-desktop/. Run the installer. Reboot when prompted.

After reboot, open Docker Desktop and let it finish first-time setup (takes a minute or two).

Verify: `docker --version` should print a version, and `docker ps` should not error.

## Step 5 — Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Verify: `claude --version` should print a version.

Run `claude` once to authenticate. Follow the prompts (browser-based OAuth). Confirm with `claude /status` that you're logged in.

If you prefer the desktop UI (CCD), download from https://claude.com/download.

## Step 6 — Clone the monorepo

```bash
# Pick a folder for repos. Common: ~/Code, ~/dev, or C:/Neo/dev/ (Windows).
cd ~/dev

git clone git@github.com:neohealth-org/neo-monorepo.git
cd neo-monorepo
pnpm install
```

`pnpm install` takes 2-5 minutes the first time.

## Step 7 — Install the neo-core plugin

```bash
pnpm setup:claude
```

This runs:
```
claude plugin marketplace add neohealth-org/claude-config
claude plugin install neo-core@neo-health
```

Verify:
```bash
claude plugin list
```

Should show `neo-core@neo-health` enabled at version 1.0.0+.

If `pnpm setup:claude` fails with "Repository not found" — see [`README.md`](../README.md#troubleshooting-clone-fails-with-repository-not-found-or-ssh-auth-error). Most likely a custom SSH host alias issue.

## Step 8 — Start the local infrastructure

The backend needs Postgres, Redis, MinIO, and Medplum running locally:

```bash
cd apps/backend
docker-compose up -d
```

First time pulls images (~1-2 GB). Subsequent starts are instant.

Verify all four services are running:
```bash
docker-compose ps
```

## Step 9 — First Claude Code session

Open a terminal in the monorepo root, run `claude`. You should see Claude Code start with the project context.

Quick verification — paste:

> What's the base branch in this repo? What plugins do I have installed?

Expected: `dev` (not `main`), and `neo-core@neo-health v1.0.0+` listed.

If both answers are right, your developer setup is **done**. You can now use:
- `/neo-core:code-review` — review your branch
- `/neo-core:full-review` — comprehensive ship-readiness review
- `/neo-core:fhir-medplum-audit`, `/neo-core:hipaa-audit` — domain-specific audits
- And ~9 more — see [what-the-brain-can-do.md](what-the-brain-can-do.md).

## Step 10 — (Optional) Install Obsidian for visual vault editing

Skip if you're happy editing vault markdown in your IDE. Recommended if you want graph view + wikilink autocomplete + visual browsing.

### Install Obsidian

Download from https://obsidian.md/. Free for personal/team use. Install with defaults.

### Clone the claude-config repo

```bash
cd ~/dev
git clone git@github.com:neohealth-org/claude-config.git
```

### Open the vault folder in Obsidian

Open Obsidian → "Open folder as vault" → navigate to `~/dev/claude-config/vault/` (the `vault` subdirectory, not the repo root).

### Install the Obsidian Git plugin

In Obsidian:
1. Settings → Community plugins → Turn on community plugins (if first time).
2. Browse → search "Obsidian Git" → Install → Enable.
3. Settings → Obsidian Git:
   - **Auto pull interval (minutes)**: 10
   - **Auto commit-and-sync interval (minutes)**: 5
   - **Auto commit-and-sync after stopping file edits**: enable
   - **Vault backup interval (minutes)**: same as above

### Verify

Edit a file in `vault/playbooks/` (any small change), wait ~5 min. Open https://github.com/neohealth-org/claude-config/commits/dev — your commit should appear.

You're done. The vault is now bidirectionally synced.

## Optional next steps

- Configure your shell to set `NEO_MCP_URL` and `NEO_MCP_TOKEN` if you want Claude Code to use the hosted MCP server (see [`README.md`](../README.md) for the URL + ask the curator for your token).
- Read [what-the-brain-can-do.md](what-the-brain-can-do.md) for the full skill catalog.
- Skim the playbook on adding FHIR resources: open Obsidian, navigate to `playbooks/add-fhir-resource-module`.

---

# Non-developer path (the boss, a PM, or anyone who works in Claude.ai)

For users who'll never open a terminal. **A developer (the curator) does this on the user's laptop in one ~20-minute session.** The user themselves only needs to learn one thing: how to ask Claude in a Project.

The output: the user can write codebase-aware PRDs in Claude.ai without touching git, plugins, the CLI, or anything technical.

## Prerequisites the curator needs before the session

- A working hosted MCP server URL (see [deploy-mcp-on-railway.md](deploy-mcp-on-railway.md)).
- A unique bearer token for this user. Generate via `openssl rand -hex 32`. Add to the Railway `MCP_TOKENS` env var as `boss:<token>` (or `pm:<token>`, etc.). Keep the token in your password manager.
- This user's Claude account credentials (or sign them up — see Step 1).

## Step 1 — Subscribe to Claude Pro

Free tier message limits are too low for regular work.

1. Go to https://claude.com/upgrade.
2. Pro is $20/month. Pay with the company card, or use a Team plan ($25/seat) if multiple non-devs need access.
3. Sign in to https://claude.ai with the user's account.

## Step 2 — (Optional) Install Obsidian for them

If the user wants to write PRD drafts visually with a graph view, install Obsidian on their laptop. Skip if they'll write everything inside Claude.ai chat.

If installing:
1. Download Obsidian from https://obsidian.md/. Run installer.
2. They DON'T need Git installed for this — Obsidian Git plugin handles everything via JavaScript.
3. Install Obsidian Git plugin: Settings → Community plugins → Browse → "Obsidian Git" → Install → Enable.
4. Generate a **read-write deploy key** for `claude-config` (so user can push drafts back). On your laptop:
   ```
   ssh-keygen -t ed25519 -f ./<user>-vault-key -N ""
   ```
   Upload the `.pub` file to https://github.com/neohealth-org/claude-config/settings/keys with **write access** checked.
5. On the user's laptop, drop the private key (`<user>-vault-key`) into a known location, e.g., `C:\Users\<user>\.ssh\vault_key` (Windows) or `~/.ssh/vault_key` (macOS).
6. Add to Obsidian Git plugin's settings → Authentication → SSH key path.
7. Clone the repo via Obsidian Git plugin's "Clone an existing remote repo" option:
   - URL: `git@github.com:neohealth-org/claude-config.git`
   - Local path: `~/Documents/Neo Vault` (or wherever)
8. Open Obsidian → "Open folder as vault" → point at `~/Documents/Neo Vault/vault/` (the `vault` subdirectory).
9. Configure auto-pull (10 min) and auto-commit (5-min idle).

The user can now drop draft PRDs into `vault/drafts/raw-prds/` from Obsidian, and they auto-sync to GitHub. The MCP picks them up within 5 minutes.

The boss-overreach guardrail (a GitHub Action) auto-reverts any commit by this user that touches anything outside `vault/drafts/`. They get a friendly issue tagged `boss-overreach` if they accidentally edit tech context. Tell them: **edit only inside `drafts/`**.

## Step 3 — Create the Claude.ai Project

1. https://claude.ai/projects → **New Project**.
2. Name: **"Neo Health PRD writer"** (or appropriate to the user's role).
3. Open the [boss-onboarding.md](boss-onboarding.md) doc on your laptop.
4. Copy the **system prompt** from boss-onboarding's Step 3 (the verbatim block starting with "You are a Product Requirements Document writer for Neo Health...").
5. Paste it into the Project's **Custom Instructions** field. Save.

## Step 4 — Add the Custom Connector

1. In the Project: **Project settings** → **Connectors** → **Add Custom Connector**.
2. Fill in:
   - **Name**: `Neo Health vault`
   - **URL**: `https://mcp.neo.internal/mcp` (or whatever your Railway custom domain is — see [deploy-mcp-on-railway.md](deploy-mcp-on-railway.md) Step 10)
   - **Authentication**: Bearer token, paste the token you generated in prerequisites.
3. Save. Within a few seconds, the connector should show "connected" with 5 available tools (`vault_search`, `vault_read`, `module_summary`, `find_related_prds`, `list_fhir_resources_used`).

If it doesn't show "connected": the most common cause is the URL is wrong (typo) or the token wasn't added to Railway's `MCP_TOKENS` env var. Test from your laptop:
```bash
curl -X POST https://mcp.neo.internal/mcp \
  -H "Authorization: Bearer <user-token>" \
  -H "Accept: application/json, text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Step 5 — Test it together

Have the user open the Project and type:

> What ADRs do we have? List them with one-line descriptions.

Expected: Claude calls `vault_read("index.md")` and `vault_read("drafts/index.md")` (visible in the tool-call trace), then lists the ADRs from the curated index. At minimum: "0001-medplum-as-data-layer".

If Claude answers without calling the connector — the system prompt isn't being followed. Re-paste it from Step 3. Sometimes Claude.ai needs a second message or a fresh conversation to pick up new system prompt changes.

Then have them try a real PRD:

> Draft a PRD for adding patient consent management.

Expected: Claude first calls `find_related_prds("patient consent management", scope: "all")` and `module_summary` for relevant modules, THEN drafts. The PRD should reference real modules / FHIR resources by name (Patient, Consent, AuditEvent, etc.). If it invents module names, the system prompt's "never invent" rule isn't sticking — try a fresh conversation.

## Step 6 — Brief the user on the workflow

Tell them:

- **For PRDs**: open the "Neo Health PRD writer" Project, type the request. Claude will draft using real codebase context. Iterate inline.
- **For asking about anything in the codebase**: same Project, ask anything. Claude has read access to the whole vault.
- **If they have Obsidian**: optionally drop unstructured drafts into `vault/drafts/raw-prds/`. Within ~10 minutes the MCP picks it up; within ~15 min total their Claude.ai can find it via `find_related_prds(scope: "all")`. They never need to "save" or "publish" — saving a file in Obsidian is the publish.
- **DO NOT edit anything outside `drafts/`** if Obsidian is installed. The auto-revert workflow will undo it within minutes; they'll get a friendly issue and the change disappears. Tell them: "your stuff lives in drafts; everything else is the team's."
- **Ask the curator (you) for changes to the curated tier** (PRDs that should become structured, ADRs, playbooks). Curator runs `/neo-core:prd-to-vault` to convert their drafts into structured PRDs that the dev team sees.

## Ongoing for the user

Zero. New skills, new ADRs, new modules: all flow into the vault automatically. Their Claude.ai sees them on next session. They never re-install anything.

## When something breaks

Their connector says "unreachable" or returns errors. Check (you, the curator):
1. Railway service status — is `/healthz` returning 200?
2. Their bearer token — still in `MCP_TOKENS`?
3. The vault — did `vault-validate` open a `vault-conflict` issue recently?
4. If all three are fine, the issue is on Claude.ai side — try a fresh conversation.

---

# Quick reference table

| Task | Dev does | Curator does on non-dev's laptop | Non-dev does |
|---|---|---|---|
| Install Node, pnpm, Git, Docker, Claude Code | Themselves | — | — |
| Clone monorepo | Themselves | — | — |
| Install neo-core plugin (`pnpm setup:claude`) | Themselves | — | — |
| Subscribe to Claude Pro | If they want a personal subscription | Or pay for a team seat | — |
| Create Claude.ai Project | If they want one for personal use | Yes (boss/PM/etc.) | — |
| Configure Custom Connector | If they want to use the hosted MCP | Yes | — |
| Install Obsidian + Obsidian Git | Optional | Optional | — |
| Use skills (`/neo-core:*`) in Claude Code | Yes | — | — |
| Write PRDs in Claude.ai Project | If they want | — | Yes |
| Write drafts in Obsidian | If they want | — | If Obsidian was installed |

## Related docs

- [what-the-brain-can-do.md](what-the-brain-can-do.md) — what skills exist and when to use them
- [boss-onboarding.md](boss-onboarding.md) — the verbatim Claude.ai system prompt
- [deploy-mcp-on-railway.md](deploy-mcp-on-railway.md) — how to stand up the MCP server
- [`README.md`](../README.md) — repo overview + version-pin policy
