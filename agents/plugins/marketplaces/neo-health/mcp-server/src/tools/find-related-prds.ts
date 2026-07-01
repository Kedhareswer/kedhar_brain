import { getSnapshot } from "../vault-snapshot.js";

export interface FindRelatedPrdsArgs {
  description: string;
  scope?: "dev" | "all";
}

export interface RelatedPrdHit {
  path: string;
  title: string;
  tier: string;
  snippet: string;
  score: number;
}

export interface FindRelatedPrdsResult {
  description: string;
  scope: "dev" | "all";
  hits: RelatedPrdHit[];
}

const MAX_HITS = 10;
const SNIPPET_LIMIT = 240;

export function findRelatedPrds(args: FindRelatedPrdsArgs): FindRelatedPrdsResult {
  const description = (args.description ?? "").trim();
  const scope = args.scope === "all" ? "all" : "dev";
  if (description.length < 3) {
    return { description, scope, hits: [] };
  }
  const snap = getSnapshot();
  const fuse = scope === "all" ? snap.fusePrdsAll : snap.fusePrdsDev;
  const results = fuse.search(description, { limit: MAX_HITS });
  return {
    description,
    scope,
    hits: results.map((r) => {
      // Snippet = the page's body trimmed to SNIPPET_LIMIT. PRD overview.md
      // bodies are kept short by the page format spec, so this is usually the
      // whole "Summary" + first paragraph.
      const body = r.item.body.replace(/\s+/g, " ").trim();
      const snippet =
        body.length <= SNIPPET_LIMIT ? body : body.slice(0, SNIPPET_LIMIT) + "…";
      return {
        path: r.item.path,
        title: r.item.title,
        tier: r.item.tier,
        snippet,
        score: r.score ?? 1,
      };
    }),
  };
}

export const findRelatedPrdsTool = {
  name: "find_related_prds",
  description:
    "Fuzzy-match a description against vault PRD overviews. Returns up to 10 ranked path + title + snippet hits. Boss's Claude.ai calls this with scope: 'all' to find his own raw drafts under vault/drafts/raw-prds/ in addition to structured PRDs under vault/prds/. Devs default to 'dev' (structured PRDs only). Snippets are short — call vault_read to get a full PRD.",
  inputSchema: {
    type: "object" as const,
    properties: {
      description: {
        type: "string",
        description:
          "What you're trying to find. Free-form description; fuzzy-matched against PRD titles and overviews. Min 3 chars.",
      },
      scope: {
        type: "string",
        enum: ["dev", "all"],
        default: "dev",
        description:
          "'dev' (default) searches structured vault/prds/<slug>/overview.md only. 'all' also searches boss's raw drafts under vault/drafts/raw-prds/.",
      },
    },
    required: ["description"],
  },
} as const;
