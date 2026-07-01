import { getSnapshot } from "../vault-snapshot.js";

export interface ModuleSummaryArgs {
  name: string;
}

export interface ModuleSummaryResult {
  name: string;
  found: boolean;
  path?: string;
  title?: string;
  contents?: string;
  hint?: string;
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/module$/i, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function moduleSummary(args: ModuleSummaryArgs): ModuleSummaryResult {
  const requested = (args.name ?? "").trim();
  if (!requested) {
    return {
      name: requested,
      found: false,
      hint: "module_summary requires a non-empty name argument (e.g., 'patient', 'fhir', 'auth').",
    };
  }
  const slug = normalize(requested);
  const snap = getSnapshot();
  // Look for vault/modules/<slug>.md or vault/modules/<slug>-anything.md
  const exact = snap.pages.find(
    (p) => p.tier === "curated" && p.path === `modules/${slug}.md`
  );
  if (exact) {
    return {
      name: requested,
      found: true,
      path: exact.path,
      title: exact.title,
      contents: exact.contents,
    };
  }
  const startsWith = snap.pages.find(
    (p) =>
      p.tier === "curated" &&
      p.path.startsWith(`modules/${slug}`) &&
      p.path.endsWith(".md")
  );
  if (startsWith) {
    return {
      name: requested,
      found: true,
      path: startsWith.path,
      title: startsWith.title,
      contents: startsWith.contents,
    };
  }
  return {
    name: requested,
    found: false,
    hint:
      `No vault/modules/${slug}.md yet. The curator can add one (or run /neo-core:lint-vault to check whether the concept appears in other pages but lacks its own page). For now, use vault_search to look across the whole vault.`,
  };
}

export const moduleSummaryTool = {
  name: "module_summary",
  description:
    "Look up the curator-maintained summary for a NestJS module or FHIR resource by name (e.g., 'PatientModule', 'patient', 'FhirModule', 'auth'). Returns the matching vault/modules/<slug>.md if it exists, else a hint to use vault_search. Module summaries are kept short (target ≤ 500 tokens) to keep retrieval lean.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description:
          "Module or resource name. Case- and suffix-insensitive — 'PatientModule', 'patient', and 'patient-module' all match vault/modules/patient.md.",
      },
    },
    required: ["name"],
  },
} as const;
