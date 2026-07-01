# neo-health MCP server

Hosted Model Context Protocol server that serves the Neo Health vault to Claude.ai (boss, via Custom Connector) and Claude Code (devs, via `.mcp.json`). Same Node.js code, two transports.

## Tools exposed

| Tool | Args | Returns | Used by |
|---|---|---|---|
| `vault_search` | `query: string`, `scope: "dev" \| "all"` (default `"dev"`) | Up to 10 ranked path + snippet matches. Snippets only — no full file contents. | Devs (default) and boss (`scope: "all"`) |
| `vault_read` | `path: string` (relative to vault root) | Full file contents + frontmatter. | All clients, on demand after `vault_search` |
| `module_summary` | `name: string` (FHIR resource or NestJS module name) | The matching `vault/modules/<name>.md` if it exists, else a "no summary yet" stub. | All clients |
| `find_related_prds` | `description: string`, `scope: "dev" \| "all"` (default `"dev"`) | Up to 10 ranked PRD overview snippets, fuzzy-matched against `description`. Boss's Claude.ai uses `scope: "all"` to also see his own raw drafts. | Boss (drafting), devs (cross-referencing) |
| `list_fhir_resources_used` | (no args) | Sorted list of FHIR resource module names found under `apps/backend/src/fhir/resources/` of the latest `claude-config` snapshot. (Derived list, refreshed on git pull.) | All clients |

The two-tier `scope` parameter is the gate that keeps dev contexts lean. Devs default to `dev` (curated only); boss's Claude.ai system prompt opts into `scope: "all"` so he sees both tiers. See `vault/README.md` for the rationale.

## Local dev

```bash
cd mcp-server
pnpm install
cp .env.example ../.env  # repo-root .env is gitignored
# Edit .env: set VAULT_PATH to your local claude-config clone path,
# generate MCP_TOKENS via `openssl rand -hex 32`.
pnpm dev                 # tsx watch
```

Test with `curl`:

```bash
curl -X POST http://localhost:4000/mcp \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Stdio mode (devs via `.mcp.json`)

In the monorepo's `.mcp.json`:

```jsonc
{
  "mcpServers": {
    "neo-vault": {
      "command": "node",
      "args": ["/path/to/claude-config/mcp-server/dist/server.js"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "VAULT_PATH": "/path/to/claude-config"
      }
    }
  }
}
```

(Production-recommended: point devs at the hosted HTTPS endpoint instead — see Phase 3e wiring in the parent claude-config README.)

## Production deployment (Railway)

1. New Railway project from this directory (`mcp-server/`).
2. Mount a persistent volume at `/data` (or wherever `VAULT_PATH` points).
3. Set env vars per `.env.example`. Critical ones:
   - `MCP_TOKENS` (rotate by replacing the value).
   - `VAULT_DEPLOY_KEY_PEM` (read-only deploy key for `neohealth-org/claude-config`).
4. Custom domain (e.g., `mcp.neo.internal`) with TLS (Railway provides).
5. Healthcheck: `GET /healthz` returns 200 with vault freshness info.
6. Logs go to Railway's log stream — review periodically for unauthorized auth attempts.

## Security notes

- **Bearer tokens are the only auth.** Rotate via env var update on Railway.
- **No real PHI in the vault.** This server only serves `claude-config` content; the rule "no real patient data in claude-config" is enforced by `/neo-core:lint-vault` and the vault README.
- **`MCP_EXPOSE_GLOB`** can keep specific files out of all MCP responses (e.g., if a future internal-only ADR shouldn't reach the boss). Default exposes all `.md`.
- **No write tools.** This server is read-only by design. Vault writes happen via Obsidian Git on each user's machine.
