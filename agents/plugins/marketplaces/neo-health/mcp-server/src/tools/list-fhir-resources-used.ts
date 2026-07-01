/**
 * list_fhir_resources_used: returns the FHIR resource module names found
 * under apps/backend/src/fhir/resources/.
 *
 * IMPORTANT design note: this tool reads from the vault's curator-maintained
 * `vault/modules/fhir-resources.md` if it exists, NOT from the live monorepo.
 * Reasons:
 *   1. The MCP server is hosted on Railway and only has the claude-config
 *      repo; it doesn't have the monorepo cloned (and shouldn't — that's
 *      where PHI lives).
 *   2. Putting derived knowledge in a curator-maintained file means the
 *      curator decides what's worth surfacing (e.g., excluding deprecated
 *      modules, adding 1-line descriptions).
 *   3. Stays consistent with the rest of the vault's "compiled, persistent,
 *      cross-linked" Karpathy pattern.
 *
 * If vault/modules/fhir-resources.md doesn't exist yet, return a hint to
 * the curator instead of failing.
 */

import { getSnapshot } from "../vault-snapshot.js";

export interface ListFhirResourcesUsedResult {
  source: string;
  resources: { name: string; description?: string }[];
  hint?: string;
}

const SOURCE_PATH = "modules/fhir-resources.md";

export function listFhirResourcesUsed(): ListFhirResourcesUsedResult {
  const snap = getSnapshot();
  const page = snap.pages.find((p) => p.path === SOURCE_PATH);
  if (!page) {
    return {
      source: SOURCE_PATH,
      resources: [],
      hint:
        `vault/modules/fhir-resources.md doesn't exist yet. Curator: create it with one bullet per FHIR resource module currently active under apps/backend/src/fhir/resources/. Format: "- ResourceName — one-line description" per line.`,
    };
  }
  // Parse one-line bulleted entries: "- name — description"
  const resources: { name: string; description?: string }[] = [];
  const lines = page.body.split("\n");
  const entryRegex = /^[-*]\s+\*?\*?([\w/-]+)\*?\*?(?:\s+[-—]\s+(.+))?$/;
  for (const line of lines) {
    const m = line.match(entryRegex);
    if (m && m[1]) {
      const entry: { name: string; description?: string } = { name: m[1] };
      if (m[2]) entry.description = m[2].trim();
      resources.push(entry);
    }
  }
  return { source: SOURCE_PATH, resources };
}

export const listFhirResourcesUsedTool = {
  name: "list_fhir_resources_used",
  description:
    "Return the curator-maintained list of FHIR resource modules used in the Neo Health backend, sourced from vault/modules/fhir-resources.md. The MCP server is hosted and doesn't have the monorepo cloned — this list is what the curator decides is worth surfacing (excludes deprecated modules; includes 1-line descriptions). Use it when boss asks 'what FHIR resources do we already model?' or when devs need a quick overview without grepping the codebase.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
} as const;
