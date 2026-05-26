import { getSnapshot } from "../vault-snapshot.js";

export interface VaultReadArgs {
  path: string;
}

export interface VaultReadResult {
  path: string;
  title: string;
  tier: string;
  contents: string;
  frontmatter: Record<string, unknown>;
}

export function vaultRead(args: VaultReadArgs): VaultReadResult {
  const requested = (args.path ?? "").trim().replace(/^\/+/, "");
  if (!requested) {
    throw new Error("vault_read requires a non-empty path argument.");
  }
  // Reject any path that tries to escape the vault.
  if (requested.includes("..")) {
    throw new Error("vault_read path must not contain '..' segments.");
  }
  const snap = getSnapshot();
  const page = snap.pages.find((p) => p.path === requested);
  if (!page) {
    throw new Error(
      `vault_read: no page at "${requested}". Use vault_search to find available paths.`
    );
  }
  return {
    path: page.path,
    title: page.title,
    tier: page.tier,
    contents: page.contents,
    frontmatter: page.frontmatter,
  };
}

export const vaultReadTool = {
  name: "vault_read",
  description:
    "Read a specific vault file by its path (relative to the vault root, e.g., 'adrs/0001-medplum-as-data-layer.md'). Returns full contents + parsed frontmatter. Typically called after vault_search to retrieve full text of a relevant hit.",
  inputSchema: {
    type: "object" as const,
    properties: {
      path: {
        type: "string",
        description:
          "Vault-relative path (forward slashes; no leading slash; no '..'). Examples: 'index.md', 'adrs/0001-medplum-as-data-layer.md', 'prds/patient-consent/overview.md', 'drafts/raw-prds/feature-x.md'.",
      },
    },
    required: ["path"],
  },
} as const;
