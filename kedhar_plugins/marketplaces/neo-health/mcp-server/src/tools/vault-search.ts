import { getSnapshot, type VaultPage } from "../vault-snapshot.js";

export interface VaultSearchArgs {
  query: string;
  scope?: "dev" | "all";
}

export interface VaultSearchHit {
  path: string;
  title: string;
  tier: VaultPage["tier"];
  snippet: string;
  score: number;
}

export interface VaultSearchResult {
  query: string;
  scope: "dev" | "all";
  hits: VaultSearchHit[];
}

const MAX_HITS = 10;
const SNIPPET_CONTEXT_CHARS = 80;

function snippetAround(body: string, query: string): string {
  const lower = body.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx < 0) {
    // No literal match (Fuse used fuzzy matching). Use the first non-empty line.
    const firstLine = body.split("\n").find((l) => l.trim().length > 0) ?? "";
    return firstLine.slice(0, SNIPPET_CONTEXT_CHARS * 2) + (firstLine.length > 160 ? "…" : "");
  }
  const start = Math.max(0, idx - SNIPPET_CONTEXT_CHARS);
  const end = Math.min(body.length, idx + query.length + SNIPPET_CONTEXT_CHARS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < body.length ? "…" : "";
  return prefix + body.slice(start, end).replace(/\s+/g, " ").trim() + suffix;
}

export function vaultSearch(args: VaultSearchArgs): VaultSearchResult {
  const query = (args.query ?? "").trim();
  const scope = args.scope === "all" ? "all" : "dev";
  if (query.length < 2) {
    return { query, scope, hits: [] };
  }
  const snap = getSnapshot();
  const fuse = scope === "all" ? snap.fuseAll : snap.fuseDev;
  const results = fuse.search(query, { limit: MAX_HITS });
  return {
    query,
    scope,
    hits: results.map((r) => ({
      path: r.item.path,
      title: r.item.title,
      tier: r.item.tier,
      snippet: snippetAround(r.item.body, query),
      score: r.score ?? 1,
    })),
  };
}

export const vaultSearchTool = {
  name: "vault_search",
  description:
    "Full-text + wikilink-aware fuzzy search of the Neo Health vault. Returns up to 10 ranked path + title + snippet matches. Snippets only — call vault_read to get full file contents. Use scope: 'dev' (default, curated tier only) for code work; pass scope: 'all' to also include vault/drafts/ (raw PRDs, ideas, research). Boss's Claude.ai uses scope: 'all'; devs default to 'dev'.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Search terms. Minimum 2 chars. Fuzzy-matched against page title, path, and body.",
      },
      scope: {
        type: "string",
        enum: ["dev", "all"],
        default: "dev",
        description:
          "'dev' (default) excludes vault/drafts/. 'all' includes drafts. Devs writing code should use 'dev'; the boss's PRD-writing flow uses 'all'.",
      },
    },
    required: ["query"],
  },
} as const;
