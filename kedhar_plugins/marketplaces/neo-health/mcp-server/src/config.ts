import "dotenv/config";

/**
 * Server config loaded once at startup. All env reads happen here so the rest
 * of the codebase can import a typed object instead of touching process.env.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function optional(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v : fallback;
}

function parseTokens(raw: string): Map<string, string> {
  // "label1:token1,label2:token2" -> Map<token, label>
  // Stored token-keyed for O(1) lookup on incoming requests; label is for log
  // attribution only and is never returned to clients.
  const map = new Map<string, string>();
  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx <= 0) {
      throw new Error(
        `Malformed MCP_TOKENS entry "${trimmed}". Expected "label:token".`
      );
    }
    const label = trimmed.slice(0, idx).trim();
    const token = trimmed.slice(idx + 1).trim();
    if (token.length < 16) {
      throw new Error(
        `MCP_TOKENS entry "${label}" has a token shorter than 16 chars. Use openssl rand -hex 32.`
      );
    }
    map.set(token, label);
  }
  if (map.size === 0) {
    throw new Error("MCP_TOKENS parsed to zero entries. Need at least one.");
  }
  return map;
}

const transport = optional("MCP_TRANSPORT", "http") as "http" | "stdio";
if (transport !== "http" && transport !== "stdio") {
  throw new Error(`MCP_TRANSPORT must be "http" or "stdio", got "${transport}"`);
}

export const config = {
  vaultPath: required("VAULT_PATH"),
  vaultRepoUrl: optional(
    "VAULT_REPO_URL",
    "git@github.com:neohealth-org/claude-config.git"
  ),
  vaultDeployKeyPem: process.env["VAULT_DEPLOY_KEY_PEM"] ?? "",
  vaultPullIntervalMs: parseInt(optional("VAULT_PULL_INTERVAL_MS", "300000"), 10),
  transport,
  port: parseInt(optional("MCP_PORT", "4000"), 10),
  tokens: transport === "http" ? parseTokens(required("MCP_TOKENS")) : new Map<string, string>(),
  exposeGlob: optional("MCP_EXPOSE_GLOB", "**/*.md"),
} as const;

export type Config = typeof config;
