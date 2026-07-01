# Deploy MCP server on Railway

Step-by-step.

---

## Before you start — generate 3 secrets locally

You need a terminal for these.

- **macOS / Linux**: any terminal — Terminal, iTerm, Hyper, etc.
- **Windows**: open **Git Bash** (Start menu → "Git Bash"). PowerShell does NOT ship with `openssl`, `ssh-keygen`, or `curl` by default; Git for Windows includes all three.

### 1. Two MCP bearer tokens (one for you, one for the boss)

Run twice:

```bash
openssl rand -hex 32
```

(Or if you must stay in PowerShell: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.)

Save both outputs in your password manager:
- First output → label **`curator-token`**
- Second output → label **`boss-token`**

These are random secret strings. Anyone who has one can call your MCP server. Keep them private.

### 2. A GitHub fine-grained Personal Access Token (PAT) — read-only, scoped to claude-config

Many GitHub orgs (including neohealth-org) block "deploy keys" by policy. Fine-grained PATs are the recommended alternative.

1. Open https://github.com/settings/personal-access-tokens → **Generate new token** → **Fine-grained**.
2. Fill in:
   - **Token name**: `Railway MCP server - claude-config read`
   - **Expiration**: 1 year (max). Set a calendar reminder to rotate.
   - **Resource owner**: `neohealth-org` (NOT your personal account)
   - **Repository access**: **Only select repositories** → `claude-config`
   - **Repository permissions(Add permissions -> Contents)**:
     - Contents: **Read-only**
     - Metadata: Read-only (auto-required by GitHub)

3. Click **Generate token**.
4. **Copy the token immediately** (starts with `github_pat_...`). You'll only see it once. Save in your password manager labeled `Railway MCP repo access`.
5. If the token shows "Pending approval", an org admin must approve at https://github.com/organizations/neohealth-org/settings/personal-access-tokens-pending-requests before it works.

You'll paste this token into the Railway `VAULT_REPO_URL` env var in Step 3 below.

> **If your org also blocks fine-grained PATs**: stop here and ask the curator. The fallback is a GitHub App (more setup; requires a code change to the MCP server for token refresh).

---

## Railway setup

### Step 1 — Create the service and set every Railway setting

1. Go to https://railway.com → **New Project** → **Deploy from GitHub repo** → pick `neohealth-org/claude-config`.
2. Open the new service's **Settings** tab. Set each section below to these exact values. Most are pre-filled by `mcp-server/railway.json` once it's detected — verify and fix any that don't match.

**Source**

| Setting | Value |
|---|---|
| Source Repo | `neohealth-org/claude-config` |
| Root Directory | `/mcp-server` |
| Branch connected | `dev` |
| Wait for CI | **on** |

**Networking**

Skip for now. You'll click **Generate Domain** in Step 5 (after first successful deploy) to get a public URL.

**Scale**

| Setting | Value |
|---|---|
| Region | Pick closest to your team (e.g., US West for North America, EU West for Europe) |
| Replicas | **1** (must be 1 — Railway doesn't allow multiple replicas with attached volumes) |
| CPU / Memory limits | Leave at plan defaults |

**Build**

| Setting | Value |
|---|---|
| Builder | **Nixpacks** (the "Deprecated" badge is informational; Nixpacks still works) |
| Custom Build Command | `pnpm install --frozen-lockfile && pnpm build` |
| Watch Paths | `/mcp-server/**` |

**Deploy**

| Setting | Value |
|---|---|
| Custom Start Command | `pnpm start:http` |
| Pre-deploy step | (none) |
| Teardown | **off** |
| Cron Schedule | (none — the server runs continuously) |
| Healthcheck Path | `/healthz` |
| Healthcheck Timeout | `300` (seconds; gives the server time to clone the vault on first start) |
| Serverless | **off** (must stay on so the vault snapshot stays in memory) |
| Restart Policy | **On Failure**, max retries `10` |

**Config-as-code**

| Setting | Value |
|---|---|
| Railway Config File | `/mcp-server/railway.json` |

**Feature-flags**

| Setting | Value |
|---|---|
| Skipped Builds | **off** |

**Don't click Deploy yet** — Steps 2 and 3 below add the volume and env vars the deploy needs.

### Step 2 — Add a persistent volume

The server keeps its cloned vault on disk between restarts.

1. Service → **Volumes** → **New Volume**.
2. **Mount Path**: `/data`
3. **Size**: `1` GB

### Step 3 — Set environment variables

Service → **Variables** tab → **New Variable** (one at a time):

| Name | Value |
|---|---|
| `VAULT_PATH` | `/data/claude-config` |
| `MCP_TOKENS` | `curator:<your-curator-token>,boss:<your-boss-token>` |
| `MCP_TRANSPORT` | `http` |
| `MCP_PORT` | `4000` |
| `VAULT_REPO_URL` | `https://x-access-token:<your-PAT>@github.com/neohealth-org/claude-config.git` |

For `MCP_TOKENS`: replace `<your-curator-token>` and `<your-boss-token>` with the actual hex strings from "Before you start" Step 1. Format: `curator:abc123...,boss:def456...`. No spaces around the comma.

For `VAULT_REPO_URL`: replace `<your-PAT>` with the fine-grained PAT from "Before you start" Step 2 (the `github_pat_...` string). The literal `x-access-token` username stays as-is — that's GitHub's convention for token-based HTTPS auth. Railway encrypts env vars at rest.

### Step 4 — Deploy

Click **Deploy** at the top of the Railway page. The build takes 3-5 minutes the first time.

Watch the build logs. You'll see:
- `pnpm install` (~1 min)
- `pnpm build` (~30 sec)
- Server starts, clones the vault repo, prints `[mcp-http] listening on :4000`

If the deploy fails, check the **Common errors** section at the bottom of this doc.

### Step 5 — Verify

Railway shows a public URL at the top of your service page (e.g., `https://claude-config-mcp-production.up.railway.app`). Click **Generate Domain** if you don't see one yet.

In your terminal:

```bash
curl https://<your-railway-url>/healthz
```

You should see something like:

```json
{
  "status": "ok",
  "loadedAt": "2026-05-08T20:14:32.123Z",
  "lastPullAt": "2026-05-08T20:14:32.123Z",
  "lastPullError": null,
  "pages": 8
}
```

If you see this, **the MCP server is live**. The `pages` number should be 8 or more (the seeded vault content). If `pages: 0` or `lastPullError` is non-null, see common errors.

### Step 6 (optional) — Custom domain

If you want `mcp.neo.internal` instead of `*.up.railway.app`:

1. Service → **Settings** → **Networking** → **Custom Domain** → type your domain.
2. Railway gives you a CNAME target. Add it in your DNS provider.
3. Wait ~10 min for DNS + automatic TLS.

Update the boss's Custom Connector URL (and `.mcp.json` in the monorepo) to use the new domain.

---

## You're done

The MCP server is live and healthy. Next step: wire it into the boss's Claude.ai per [boss-onboarding.md](boss-onboarding.md), or point your own Claude Code at it via the `.mcp.json` already in the monorepo by setting `NEO_MCP_URL` and `NEO_MCP_TOKEN` env vars in your shell.

---

## Common errors

| Error in Railway logs | Fix |
|---|---|
| `Initial git clone exited 128: ... Permission denied (publickey)` | The deploy key isn't on the GitHub repo, OR `VAULT_DEPLOY_KEY_PEM` was pasted incorrectly. Re-paste the entire file including the BEGIN/END lines. |
| `MCP_TOKENS parsed to zero entries` | The token format is wrong. Must be `label:token,label:token`. No spaces. |
| `EACCES: permission denied, mkdir '/data'` | The `/data` volume isn't mounted. Re-do Step 2. |
| `/healthz` returns `pages: 0` | The vault clone succeeded but no markdown was found. Check `lastPullError` — usually means `VAULT_PATH` is wrong (should be `/data/claude-config`, NOT just `/data`). |
| `unauthorized` on every `curl` | Your `Authorization: Bearer <token>` header has the wrong token. Use one of the tokens from `MCP_TOKENS`, not the label. |

---

## Maintenance after deploy

| Task | When | How |
|---|---|---|
| Add a new user | Onboarding | Generate new token (`openssl rand -hex 32`). Append `,newuser:<token>` to `MCP_TOKENS` env var on Railway. Service auto-restarts. Share the token privately. |
| Rotate a token | Quarterly, or if leaked | Generate new token, replace the old `label:token` entry in `MCP_TOKENS`. Old token stops working immediately. Tell the user to update their connector. |
| Update server code | When you push to `mcp-server/**` on `dev` | Automatic. Railway redeploys on push (Watch Paths is set to `/mcp-server/**`). |
| Update vault content | Continuously | No deploy needed. Server pulls every 5 minutes. |
| Check logs | Weekly first month, monthly after | Railway → Deployments → click latest → Logs tab. Look for `unauthorized` (leaked token?) or `git pull exited` (network issue). |
